import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

// Defining the structure of the table
const table_name = "pickup_request";
const Pickup = db.define(table_name, {
    trash: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    time_stamp: DataTypes.DATE
},{
    freezeTableName: true
});

export default Pickup;

// Create & run a function to create the table in the database
// if it does not exist
(async () => {
    await db.sync();
})();
