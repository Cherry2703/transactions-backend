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
  response.send(`todos backend database
    
    
    This is a backend API built using Express.js, SQLite, and JSON Web Tokens (JWT). It supports user registration, login, and a basic todo management system, including adding, updating, and deleting tasks.

Features


User Registration
User Login (JWT-based authentication)
Todo CRUD (Create, Read, Update, Delete) operations
Tech Stack
Node.js (Express.js)
SQLite (Database)
JWT (Authentication)
UUID (For generating unique IDs)
Bcrypt (For password hashing)



Create the SQLite database:

Ensure you have SQLite3 installed.
Create a todos.db file if it doesn't exist. Use the following schema for the database:

CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  location TEXT,
  created_at TEXT
);

CREATE TABLE todo (
  todo_id TEXT PRIMARY KEY,
  todo_text TEXT NOT NULL,
  todo_status TEXT NOT NULL,
  created_at TEXT
);



API Endpoints
1. Register a New User
Endpoint: POST /users/
Description: Registers a new user with a unique username and hashed password.
Example Input:
json
Copy code
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "password123",
  "location": "New York"
}
Response:
json
Copy code
{
  "response": "new use created"
}
2. Login a User
Endpoint: POST /users/login/
Description: Logs in a user and returns a JWT token if credentials are correct.
Example Input:
json
Copy code
{
  "username": "johndoe",
  "password": "password123"
}
Response:
json
Copy code
{
  "jwtToken": "your_jwt_token_here"
}
3. Get All Todos
Endpoint: GET /todos/
Description: Retrieves all todos from the database.
Response:
json
Copy code
[
  {
    "todo_id": "1",
    "todo_text": "Complete assignment",
    "todo_status": "pending",
    "created_at": "2024-10-02T10:20:30Z"
  },
  {
    "todo_id": "2",
    "todo_text": "Buy groceries",
    "todo_status": "completed",
    "created_at": "2024-10-02T11:30:45Z"
  }
]
4. Add a New Todo
Endpoint: POST /todos/
Description: Adds a new todo item.
Example Input:
json
Copy code
{
  "todo_text": "Finish reading book",
  "todo_status": "pending"
}
Response:
arduino
Copy code
new todo added........
5. Update a Todo
Endpoint: PUT /todos/:todoId/
Description: Updates a specific todo by its ID.
Example Input:
json
Copy code
{
  "todo_text": "Finish reading book",
  "todo_status": "completed"
}
Response:
Copy code
todo Updated Successfully
6. Delete a Todo
Endpoint: DELETE /todos/:todoId/
Description: Deletes a specific todo by its ID.
Response:
Copy code
todo Deleted Successfully
License
This project is open-source and free to use.

`)
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