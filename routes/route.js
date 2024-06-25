import express from "express";
import {
    getPickup,
    createPickup,
    updatePickup, 
    getTrashStock,
    getUserHistory
} from "../controllers/pickupController.js";
import { insertNewUser, authenticateUser } from "../controllers/authController.js";
import { updateUserSetting, addNewFood, getFoodStock, createFoodWastePickup, getRecommendation } from "../controllers/userController.js";

const router = express.Router();

// Route for the pickup requests 
router.get("/pickup", getPickup); // Driver, User, Admin
router.post("/requestpickup", createPickup); // User

// Access by the driver only
router.put("/updatepickup/:id", updatePickup); // Driver

// Route for the admin requests
router.get("/trashstock", getTrashStock); // Admin

// Route for the user requests
router.put("/register", insertNewUser); // User
router.post("/login", authenticateUser); // User
router.get("/history", getUserHistory); // User

router.put("/updatesetting/", updateUserSetting); // User
router.post("/addfood", addNewFood); // User
router.get("/foodstock", getFoodStock); // User, Admin
router.post("/foodpickup", createFoodWastePickup); // User

router.get("/recommendation", getRecommendation); // User

export default router;