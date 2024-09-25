const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { v4: uuidv4 } = require('uuid'); // Correctly import uuid
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const app = express();
const dbPath = path.join(__dirname, "./todos.db");
let db = null;

const PORT = process.env.PORT || 3015;
app.use(express.json());
app.use(cors());
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, () => {
      console.log("Server Running at http://localhost:3015/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


app.get('/',(request,response)=>{
  response.send('todos data base backend .....')
})

app.post("/users/", async (request, response) => {
  const { username, email, password, location } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const currentDate = new Date().toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
    const id = uuidv4();
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        users(user_id, username, email, password,location, created_at)  
      VALUES 
        (
          '${id}', 
          '${username}',
          '${email}', 
          '${hashedPassword}',
          '${location}',
          '${currentDate}'
        )`;
    const dbResponse = await db.run(createUserQuery);
    response.send({"response":"new use created"});
  } else {
    response.status = 400;
    response.send("User already exists");
  }
});

// Logging in as a user
app.post("/users/login/", async (request, response) => {
  const { username, password } = request.body;

  try {
    // Parameterized query to avoid SQL injection
    const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
    const dbUser = await db.get(selectUserQuery, [username]);

    if (dbUser === undefined) {
      // Send a generic error message to avoid revealing whether the username exists
      response.status(400).send("Invalid credentials");
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched) {
        const payload = { username: username };
        const jwtToken = jwt.sign(payload, "jwtToken");
        response.send({ jwtToken });
      } else {
        response.status(400).send("Invalid credentials");
      }
    }
  } catch (error) {
    console.error(error.message);
    response.status(500).send("Internal Server Error");
  }
});


  app.get("/todos/", async (request, response) => {
    const getBooksQuery = `
      SELECT
        *
      FROM
        todo
      ORDER BY
        todo_id;`;
    const booksArray = await db.all(getBooksQuery);
    response.send(booksArray);
  });

// adding new todo 

app.post("/todos/", async (request, response) => {
  const {todo_text,todo_status} = request.body;
  const currentDate=new Date()
  const newId=uuidv4()
  const addBookQuery = `
    INSERT INTO
      todo(todo_id,todo_text,todo_status,created_at)
    VALUES
      (
        '${newId}',
         '${todo_text}',
         '${todo_status}',
         '${currentDate}'
      );`;

  await db.run(addBookQuery);
  response.send('new todo added........')
});

//updating todo

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const {
    todo_text,todo_status
  } = todoDetails;
  const updatetodoQuery = `
    UPDATE
      todo
    SET
      todo_text='${todo_text}',
      todo_status='${todo_status}'
    WHERE todo_id = '${todoId}';`;
  await db.run(updatetodoQuery);
  response.send("todo Updated Successfully");
});

// delete  todo 

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deletetodoQuery = `
    DELETE FROM
      todo
    WHERE
      todo_id = '${todoId}';`;
  await db.run(deletetodoQuery);
  response.send("todo Deleted Successfully");
});