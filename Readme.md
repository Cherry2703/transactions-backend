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



{
    "username":"Balne Ram Charan",
    "password":"Ram@7569943648"
}