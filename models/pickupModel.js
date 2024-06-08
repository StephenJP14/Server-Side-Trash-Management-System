import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

// Defining the structure of the table
const table_name = "TrashRecords";
const Pickup = db.define(table_name, {
    qty: DataTypes.INTEGER,
    trashType: DataTypes.STRING,
    trashDetail: DataTypes.STRING,
    userId: DataTypes.STRING,
    location: DataTypes.JSON
},{
    freezeTableName: true
});

export default Pickup;

// Create & run a function to create the table in the database
// if it does not exist
(async () => {
    await db.sync();
})();
