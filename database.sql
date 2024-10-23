-- CREATE TABLE users(
--     user_id TEXT PRIMARY KEY,
--     username TEXT UNIQUE,
--     email TEXT UNIQUE,
--     password TEXT NOT NULL,
--     created_at TEXT NOT NULL
-- );

-- CREATE TABLE categories (
--     category_id TEXT PRIMARY KEY,
--     name TEXT NOT NULL,
--     type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
-- );

-- CREATE TABLE transactions (
--     transaction_id TEXT PRIMARY KEY,
--     user_id TEXT NOT NULL,
--     type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
--     category_id TEXT NOT NULL,  -- Renamed for clarity
--     amount REAL NOT NULL,
--     date DATETIME NOT NULL,  -- Changed to DATETIME for better date handling
--     description TEXT,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
-- );




-- select * from users;

