import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

// Defining the structure of the table
const pickup_name = "pickupRecords";
export const Pickup = db.define(pickup_name, {
    qty: DataTypes.INTEGER,
    trashType: DataTypes.STRING,
    trashDetail: DataTypes.STRING,
    userId: DataTypes.STRING,
    location: DataTypes.JSON,
    status: DataTypes.STRING
},{
    freezeTableName: true
});

const user_table = "userRecords";
export const User = db.define(user_table, {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
},{
    freezeTableName: true
});


// Create & run a function to create the table in the database
// if it does not exist
(async () => {
    await db.sync();
})();
