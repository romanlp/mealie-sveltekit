-- Migration number: 0001 	 2025-02-09T20:07:00.000Z
-- Create a temporary table with the new schema
CREATE TABLE user_new (
    id TEXT PRIMARY KEY,
    age INTEGER,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

-- Copy existing data to the new table, using username as temporary email
INSERT INTO user_new (id, age, username, email, password_hash)
SELECT id, age, username, username || '@temporary.com', password_hash
FROM user;

-- Drop the old table
DROP TABLE user;

-- Rename the new table to the original name
ALTER TABLE user_new RENAME TO user;
