Expense Tracker API
This is a Node.js Express-based API for managing users, transactions (both income and expense), and generating summaries of financial activity. The backend utilizes SQLite3 as the database and provides endpoints for user registration, login, transaction management, and generating income/expense summaries.



### API END-POINTS


## GET "/"

-Returns a Welcome message
{
  "message": "Todos backend testing is working... go for different routes"
}

## NEW-USER-REGISRATION   

POST "/sign-up/"
-Request JSON
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

-- RESPONSE JSON
{
  "message": "User created successfully."
}


## USER-LOGIN
POST "/login/"
-REQUEST JSON
{
  "username": "john_doe",
  "password": "password123"
}

-RESPONSE
{
  "jwtToken": "<JWT_TOKEN>"
}


## 4. Get All Users (Protected Route)
GET /users/

Requires JWT Authentication

Response (200):

json

[
  {
    "user_id": "user1-id",
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-10-22 14:30:00"
  },
  {
    "user_id": "user2-id",
    "username": "jane_doe",
    "email": "jane@example.com",
    "created_at": "2024-10-22 14:35:00"
  }
]
## 5. Add Transaction (Protected Route)
POST /transactions/

Requires JWT Authentication

Request:

json

{
  "amount": 500,
  "description": "Salary",
  "type": "income",
  "category": "Job"
}
Response (201):

json
Copy code
{
  "message": "Transaction Added Successfully"
}
## 6. Get All Transactions (Protected Route)
GET /transactions/

Requires JWT Authentication

Response (200):

json
[
  {
    "transaction_id": "tran-1",
    "user_id": "user1-id",
    "type": "income",
    "category": "Job",
    "amount": 500,
    "date": "2024-10-22 10:00:00",
    "description": "Salary"
  },
  {
    "transaction_id": "tran-2",
    "user_id": "user1-id",
    "type": "expense",
    "category": "Food",
    "amount": 100,
    "date": "2024-10-22 12:00:00",
    "description": "Lunch"
  }
]
## 7. Get Specific Transaction (Protected Route)
GET /transactions/:id/

Requires JWT Authentication

Response:

json
{
  "transaction_id": "tran-1",
  "user_id": "user1-id",
  "type": "income",
  "category": "Job",
  "amount": 500,
  "date": "2024-10-22 10:00:00",
  "description": "Salary"
}
## 8. Delete Specific Transaction (Protected Route)
DELETE /transactions/:id/

Requires JWT Authentication

Response (200):

json

{
  "message": "Transaction deleted successfully"
}
## 9. Update Specific Transaction (Protected Route)
PUT /transactions/:id/

Requires JWT Authentication

Request:

json

{
  "amount": 600,
  "description": "Updated Salary",
  "type": "income",
  "category": "Job"
}
Response (200):

json

{
  "message": "Transaction updated successfully"
}
## 10. Get Summary (Protected Route)
GET /summary

Requires JWT Authentication

Request:

json

{
  "start_date": "2024-10-01",
  "end_date": "2024-10-22",
  "category": "Job"
}
Response (200):

json
{
  "total_income": 1500,
  "total_expenses": 500,
  "balance": 1000
}
JWT Authentication
Most routes require JWT authentication. Include the Authorization header in requests:

Authorization: Bearer <jwtToken>


## Error Handling
The API will return a 500 status code for any internal server errors. If specific errors occur (e.g., invalid data), the API will return appropriate error messages with 400 or 401 status codes.

