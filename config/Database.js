import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Defining the database connection parameters
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const db_name = process.env.MYSQL_DB;

// Using Sequelize to create a connection to the database
const db = new Sequelize(db_name, username, password, {
    host: process.env.MYSQL_HOST, // Defining the host
    dialect: "mysql", // Selecting mysql as the database
    port: process.env.MYSQL_PORT, // Defining the port
});

export default db;
