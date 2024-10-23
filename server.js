
// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3004;
// const path = require('path');
// const { open } = require('sqlite');
// const sqlite3 = require('sqlite3');
// const dbPath = path.join(__dirname, "database.db");
// const cors = require('cors');

// app.use(express.json());
// app.use(cors());

// let db = null;

// const { v4: uuidv4 } = require('uuid');
// const bcrypt = require('bcrypt');
// const jwt=require('jsonwebtoken')

// const initializeDBAndServer = async () => {
//     try {
//         db = await open({
//             filename: dbPath,
//             driver: sqlite3.Database
//         });
//         app.listen(port, () => {
//             console.log(`Server is running at http://localhost:${port}/`);
//         });
//     } catch (error) {
//         console.log(`DB ERROR: ${error.message}`);
//         process.exit(1);
//     }
// };

// initializeDBAndServer();

// // Check if the server is running
// app.get("/", (request, response) => {
//     response.send('Todos backend testing is working... go for different routes');
// });

// // Endpoint for user registration
// app.post("/users/", async (request, response) => {
//     const { username, email, password } = request.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//         const dbUser = await db.get( `SELECT username FROM users WHERE username = '${username}';`);
//         if (dbUser) {
//             response.status(400).send({ message: "User already exists." });
//         } else {
//             const userId = uuidv4();
//             const currentDate=new Date().toLocaleString()
//             await db.run(`INSERT INTO users(user_id, username, email, password,created_at) VALUES('${userId}','${username}','${email}','${hashedPassword}','${currentDate}');`);
//             response.status(201).send({ message: "User created successfully." });
//         }
//     } catch (error) {
//         console.log(`DB Error: ${error.message}`);
//         response.status(500).send({ message: "Internal server error." });
//     }
// });


// // login this user 


// app.post("/users/login/",async (request,response)=>{
//     const {username,password}=request.body
//     try {
//         const dbUser=`select * from users where username='${username}';`;
//         const checkingUserExists=await db.get(dbUser)
//         if(checkingUserExists===undefined){
//             response.status(401).send({message:'User Not Found...'})
//         }else{
//             const isValidPassword=await bcrypt.compare(password,checkingUserExists.password)
//             if(isValidPassword===true){
//                 const payload={username:username}
//                 const jwtToken=jwt.sign(payload,'my_secret_jwt_token')
//                 response.status(200).send({jwtToken})
//             }else{
//                 response.status(400).send("Invalid Password")
//             }
//         }
//     } catch (error) {
//         response.status(500).send({message:'Internal Server Error'})
//     }
// })




// const middleWare=(request,response,next)=>{
//     let jwtToken;
//     const authHeader=request.headers['authorization']
//     if(authHeader){
//         jwtToken=authHeader.split(' ')[1]
//     }
//     if(jwtToken){
//         jwt.verify(jwtToken,'my_secret_jwt_token',async (error,payload)=>{
//             if(error){
//                 response.status(401).send({message:'Invalid Token'})
//             }else{
//                 request.username=payload.username
//                 next()
//             }
//         })
//     }else{
//         response.status(401).send({message:'Invalid Token'})
//     }
// }


// // to get all users present in data base

// app.get('/users/',middleWare,async(request,response)=>{
//     const query=`select * from users;`
//     const users=await db.all(query)
//     response.status(200).send(users)
// })




// // Get all todos for a user
// const getAllTodosForUser = async (user_id) => {
//     const query = `SELECT * FROM todos WHERE user_id = '${user_id}';`;
//     return await db.all(query);
// };

// // Create a new todo and return the updated list of todos
// app.post('/todos/', middleWare, async (request, response) => {
//     const userQuery = `SELECT * FROM users WHERE username = '${request.username}';`;
//     const user = await db.get(userQuery);

//     if (user) {
//         const { title, description } = request.body;
//         const currentUploadTime = new Date().toLocaleString();
//         const todo_id = uuidv4();
//         const insertTodoQuery = `
//             INSERT INTO todos (todo_id, user_id, title, description, created_at) 
//             VALUES ('${todo_id}', '${user.user_id}', '${title}', '${description}', '${currentUploadTime}');
//         `;
//         await db.run(insertTodoQuery);

//         const updatedTodos = await getAllTodosForUser(user.user_id);
//         response.status(200).send({
//             message: 'New todo added successfully.',
//             todos: updatedTodos
//         });
//     }
// });

// // Delete a todo and return the updated list of todos
// app.delete("/todos/:todoId/", middleWare, async (request, response) => {
//     const { todoId } = request.params;
//     const userQuery = `SELECT * FROM users WHERE username = '${request.username}';`;
//     const user = await db.get(userQuery);

//     if (user) {
//         const deleteTodoQuery = `DELETE FROM todos WHERE todo_id = '${todoId}' AND user_id = '${user.user_id}';`;
//         await db.run(deleteTodoQuery);

//         const updatedTodos = await getAllTodosForUser(user.user_id);
//         response.status(200).send({
//             message: 'Todo deleted successfully.',
//             todos: updatedTodos
//         });
//     }
// });

// // Update a todo and return the updated list of todos
// app.put('/todos/:todoId/', middleWare, async (request, response) => {
//     const userQuery = `SELECT * FROM users WHERE username = '${request.username}';`;
//     const user = await db.get(userQuery);

//     if (user) {
//         const { todoId } = request.params;
//         const { title, description } = request.body;
//         const todoQuery = `SELECT * FROM todos WHERE todo_id = '${todoId}' AND user_id = '${user.user_id}';`;
//         const existingTodo = await db.get(todoQuery);

//         if (existingTodo) {
//             const updatedTitle = title !== undefined ? title : existingTodo.title;
//             const updatedDescription = description !== undefined ? description : existingTodo.description;
//             const currentDate = new Date().toLocaleString();
//             const updateTodoQuery = `
//                 UPDATE todos 
//                 SET title = '${updatedTitle}', description = '${updatedDescription}', created_at = '${currentDate}'
//                 WHERE todo_id = '${todoId}' AND user_id = '${user.user_id}';
//             `;
//             await db.run(updateTodoQuery);

//             const updatedTodos = await getAllTodosForUser(user.user_id);
//             response.status(200).send({
//                 message: 'Todo updated successfully.',
//                 todos: updatedTodos
//             });
//         } else {
//             response.status(404).send({ message: 'Todo not found.' });
//         }
//     } else {
//         response.status(401).send({ message: 'Unauthorized user.' });
//     }
// });

// // Get all todos for the logged-in user
// app.get('/todos/', middleWare, async (request, response) => {
//     const userQuery = `SELECT * FROM users WHERE username = '${request.username}';`;
//     const user = await db.get(userQuery);

//     if (user) {
//         const todos = await getAllTodosForUser(user.user_id);
//         response.status(200).send({todos});
//     } else {
//         response.status(401).send({ message: 'Unauthorized user.' });
//     }
// });



const express = require('express');
const app = express();
const port = process.env.PORT || 3012;

const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const dbPath = path.join(__dirname, "database.db");
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
    response.send('Transactions  backend testing is working... go for different routes');
});

// Endpoint for user registration
app.post("/sign-up/", async (request, response) => {
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


app.post("/login/",async (request,response)=>{
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
                const jwtToken=jwt.sign(payload,process.env.JWT_SECRET || 'my_secret_jwt_token')
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


// to check if the users exists in the database or not
const getUserId=async(username)=>{
    const response=`select * from users where username='${username}';`
    const user=await db.get(response)
    return user
}

// get all trasaction made by user
app.get("/transactions/",middleWare,async(request,response)=>{
    const {username}=request
    const user=await getUserId(username)
    const allTransactions=`select * 
    from transactions INNER JOIN categories ON transactions.category_id=categories.category_id
    where transactions.user_id='${user.user_id}';`
    const transactions=await db.all(allTransactions)
    response.status(200).send(transactions)
})


// add a new trasaction to the data base
app.post("/transactions/", middleWare, async (request, response) => {
    try {
        const { username } = request;
        const user = await getUserId(username);
        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }
        const { amount, description = null, type, category } = request.body;
        if (!amount || !type || !category) {
            return response.status(400).json({ error: 'Amount, type, and category are required fields' });
        }
        if (type !== 'income' && type !== 'expense') {
            return response.status(400).json({ error: 'Type must be either income or expense' });
        }
        const newTransactionId = uuidv4();
        const newCategoryId = uuidv4();
        const transactionTime = new Date().toLocaleString();

        
        const categoryQuery = `
            INSERT INTO categories (category_id, name, type)
            VALUES ('${newCategoryId}', '${category}', '${type}');
        `;

        await db.run(categoryQuery);


        const newTransaction = `
            INSERT INTO transactions (transaction_id, user_id, type, category_id, amount, date, description)
            VALUES ('${newTransactionId}', '${user.user_id}', '${type}', '${newCategoryId}', ${amount}, '${transactionTime}', '${description}');
        `;

        await db.run(newTransaction);
        response.status(201).send({ message: 'Transaction Added Successfully' });

    } catch (error) {
        console.error('Error adding transaction:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});



// getting specific trasaction made by user
app.get("/transactions/:id/",middleWare,async(request,response)=>{
    const {id}=request.params
    const query=`select * 
    from transactions INNER JOIN categories ON transactions.category_id=categories.category_id
    where transactions.transaction_id='${id}';`
    const result=await db.all(query)
    response.send(result)
})

// deleting specific transaction based on user preference
app.delete("/transactions/:id/",middleWare,async(request,response)=>{
    const {id}=request.params
    const deleteQuery=`select * from transactions where transaction_id='${id}';`;
    const transactionData=await db.get(deleteQuery)

    const query=`DELETE FROM transactions WHERE transaction_id='${id}';`;
    await db.run(query);

    const catagoriesDelete=`DELETE FROM categories WHERE category_id='${transactionData.category_id}';`;
    await db.run(catagoriesDelete)

    response.send({message:'Transaction deleted successfully'})

})


// updating the specific transaction based on user preference
app.put("/transactions/:id/", middleWare, async (request, response) => {
    try {
        const { id } = request.params;
        const dataQuery = `SELECT * FROM transactions WHERE transaction_id = '${id}';`;
        const transactionData = await db.get(dataQuery);
        const getCategories=`select * from categories where category_id='${transactionData.category_id}';`
        const categoriesData=await db.get(getCategories)
        if (!transactionData) {
            return response.status(404).json({ error: 'Transaction not found' });
        }
        const { amount = transactionData.amount, description = transactionData.description, type = transactionData.type, category = categoriesData.name } = request.body;
        if (!amount) {
            return response.status(400).json({ error: 'Amount is required to update the transaction' });
        }
        if (type !== 'income' && type !== 'expense') {
            return response.status(400).json({ error: 'Type must be either income or expense' });
        }

        // Updating the transaction 
        const updateTransactionQuery = `
            UPDATE transactions
            SET amount = ${amount}, type = '${type}', description = '${description}', category_id = '${transactionData.category_id}'
            WHERE transaction_id = '${id}';
        `;
        await db.run(updateTransactionQuery);


        const updateCatagory=`UPDATE categories set type='${type}',name='${category}' where category_id='${transactionData.category_id}';`
        await db.run(updateCatagory)
        response.send({ message: 'Transaction updated successfully' });
    } catch (error) {
        console.error('Error while updating transaction:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

// summary route for all the income and expenses calculation

app.get('/summary', middleWare, async (request, response) => {
    try {
        const { username } = request;
        const queryCheck = `SELECT * FROM users WHERE username = '${username}';`;
        const userData = await db.get(queryCheck);
        if (!userData) {
            return response.status(404).send({ error: 'User not found' });
        }
        const { start_date, end_date, category } = request.body;
        let incomeQuery = `SELECT SUM(amount) as total_income FROM transactions WHERE type = 'income' AND user_id = '${userData.user_id}'`;
        let expenseQuery = `SELECT SUM(amount) as total_expenses FROM transactions WHERE type = 'expense' AND user_id = '${userData.user_id}'`;
        if (start_date && end_date) {
            incomeQuery += ` AND date BETWEEN '${start_date}' AND '${end_date}'`;
            expenseQuery += ` AND date BETWEEN '${start_date}' AND '${end_date}'`;
        }
        if (category) {
            const categoryQuery = `SELECT category_id FROM categories WHERE name = '${category}'`;
            const categoryResult = await db.get(categoryQuery);

            if (categoryResult) {
                incomeQuery += ` AND category_id = '${categoryResult.category_id}'`;
                expenseQuery += ` AND category_id = '${categoryResult.category_id}'`;
            }
        }
        const incomeResult = await db.get(incomeQuery);
        const expenseResult = await db.get(expenseQuery);

        // Calculating total income, total expenses, and balance
        const totalIncome = incomeResult?.total_income || 0;
        const totalExpenses = expenseResult?.total_expenses || 0;
        const balance = totalIncome - totalExpenses;
        response.status(200).send({
            total_income: totalIncome,
            total_expenses: totalExpenses,
            balance: balance,
        });

    } catch (error) {
        console.error('Error while fetching summary:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});



