
const express = require('express');
const app = express();
const port = process.env.PORT || 3004;
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const dbPath = path.join(__dirname, "todos.db");
const cors = require('cors');

app.use(express.json());
app.use(cors());

let db = null;

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}/`);
        });
    } catch (error) {
        console.log(`DB ERROR: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

// Check if the server is running
app.get("/", (request, response) => {
    response.send('Todos backend testing is working... go for different routes');
});

// Endpoint for user registration
app.post("/users/", async (request, response) => {
    const { username, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const dbUser = await db.get( `SELECT username FROM users WHERE username = '${username}';`);
        if (dbUser) {
            response.status(400).send({ message: "User already exists." });
        } else {
            const userId = uuidv4();
            const currentDate=new Date().toLocaleString()
            await db.run(`INSERT INTO users(user_id, username, email, password,created_at) VALUES('${userId}','${username}','${email}','${hashedPassword}','${currentDate}');`);
            response.status(201).send({ message: "User created successfully." });
        }
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        response.status(500).send({ message: "Internal server error." });
    }
});


// login this user 


app.post("/users/login/",async (request,response)=>{
    const {username,password}=request.body
    try {
        const dbUser=`select * from users where username='${username}';`;
        const checkingUserExists=await db.get(dbUser)
        if(checkingUserExists===undefined){
            response.status(401).send({message:'User Not Found...'})
        }else{
            const isValidPassword=await bcrypt.compare(password,checkingUserExists.password)
            if(isValidPassword===true){
                const payload={username:username}
                const jwtToken=jwt.sign(payload,'my_secret_jwt_token')
                response.status(200).send({jwtToken})
            }else{
                response.status(400).send("Invalid Password")
            }
        }
    } catch (error) {
        response.status(500).send({message:'Internal Server Error'})
    }
})




const middleWare=(request,response,next)=>{
    let jwtToken;
    const authHeader=request.headers['authorization']
    if(authHeader){
        jwtToken=authHeader.split(' ')[1]
    }
    if(jwtToken){
        jwt.verify(jwtToken,'my_secret_jwt_token',async (error,payload)=>{
            if(error){
                response.status(401).send({message:'Invalid Token'})
            }else{
                request.username=payload.username
                next()
            }
        })
    }else{
        response.status(401).send({message:'Invalid Token'})
    }
}


// to get all users present in data base

app.get('/users/',middleWare,async(request,response)=>{
    const query=`select * from users;`
    const users=await db.all(query)
    response.status(200).send(users)
})




// Get all todos for a user
const getAllTodosForUser = async (user_id) => {
    const query = `SELECT * FROM todos WHERE user_id = '${user_id}';`;
    return await db.all(query);
};

// Create a new todo and return the updated list of todos
app.post('/todos/', middleWare, async (request, response) => {
    const userQuery = `SELECT * FROM users WHERE username = '${request.username}';`;
    const user = await db.get(userQuery);

    if (user) {
        const { title, description } = request.body;
        const currentUploadTime = new Date().toLocaleString();
        const todo_id = uuidv4();
        const insertTodoQuery = `
            INSERT INTO todos (todo_id, user_id, title, description, created_at) 
            VALUES ('${todo_id}', '${user.user_id}', '${title}', '${description}', '${currentUploadTime}');
        `;
        await db.run(insertTodoQuery);

        const updatedTodos = await getAllTodosForUser(user.user_id);
        response.status(200).send({
            message: 'New todo added successfully.',
            todos: updatedTodos
        });
    }
});

// Delete a todo and return the updated list of todos
app.delete("/todos/:todoId/", middleWare, async (request, response) => {
    const { todoId } = request.params;
    const userQuery = `SELECT * FROM users WHERE username = '${request.username}';`;
    const user = await db.get(userQuery);

    if (user) {
        const deleteTodoQuery = `DELETE FROM todos WHERE todo_id = '${todoId}' AND user_id = '${user.user_id}';`;
        await db.run(deleteTodoQuery);

        const updatedTodos = await getAllTodosForUser(user.user_id);
        response.status(200).send({
            message: 'Todo deleted successfully.',
            todos: updatedTodos
        });
    }
});

// Update a todo and return the updated list of todos
app.put('/todos/:todoId/', middleWare, async (request, response) => {
    const userQuery = `SELECT * FROM users WHERE username = '${request.username}';`;
    const user = await db.get(userQuery);

    if (user) {
        const { todoId } = request.params;
        const { title, description } = request.body;
        const todoQuery = `SELECT * FROM todos WHERE todo_id = '${todoId}' AND user_id = '${user.user_id}';`;
        const existingTodo = await db.get(todoQuery);

        if (existingTodo) {
            const updatedTitle = title !== undefined ? title : existingTodo.title;
            const updatedDescription = description !== undefined ? description : existingTodo.description;
            const currentDate = new Date().toLocaleString();
            const updateTodoQuery = `
                UPDATE todos 
                SET title = '${updatedTitle}', description = '${updatedDescription}', created_at = '${currentDate}'
                WHERE todo_id = '${todoId}' AND user_id = '${user.user_id}';
            `;
            await db.run(updateTodoQuery);

            const updatedTodos = await getAllTodosForUser(user.user_id);
            response.status(200).send({
                message: 'Todo updated successfully.',
                todos: updatedTodos
            });
        } else {
            response.status(404).send({ message: 'Todo not found.' });
        }
    } else {
        response.status(401).send({ message: 'Unauthorized user.' });
    }
});

// Get all todos for the logged-in user
app.get('/todos/', middleWare, async (request, response) => {
    const userQuery = `SELECT * FROM users WHERE username = '${request.username}';`;
    const user = await db.get(userQuery);

    if (user) {
        const todos = await getAllTodosForUser(user.user_id);
        response.status(200).send({todos});
    } else {
        response.status(401).send({ message: 'Unauthorized user.' });
    }
});




