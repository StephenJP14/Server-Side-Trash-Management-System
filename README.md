# Express API with MySQL

This is an Express.js API that connects to a MySQL database.

## Configuration

1. **Set up MySQL Database & Database Connection:**
    - Open XAMPP
    - Create a new MySQL database.
    - Open `config/Database.js`.
    - Update the configuration to match your MySQL setup:
    - Modify the Database.js file with your username, password, db_name, and your port.

## How to Run

1. **Start the server:**

      ```sh
      node index.js
      ```
    for debugging use
     ```sh
      nodemon index
    ```
   By default, the server will run on port 3000. You can access it at `http://localhost:3000`.
