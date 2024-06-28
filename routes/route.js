import express from "express";
import {
    getPickup,
    createPickup,
    updatePickup, 
    getTrashStock,
    getUserHistory
} from "../controllers/pickupController.js";
import { insertNewUser, authenticateUser } from "../controllers/authController.js";
import { registerDriver } from "../controllers/adminController.js";
import { getUserProfile, updateUserSetting, addNewItem, getItemStock, createItemWastePickup, getRecommendation } from "../controllers/userController.js";

const router = express.Router();

// Route for the pickup requests 
router.get("/pickup", getPickup); // Driver, User, Admin
router.post("/requestpickup", createPickup); // User

// Access by the driver only
router.put("/updatepickup/:id", updatePickup); // Driver

// Route for the admin requests
router.get("/trashstock", getTrashStock); // Admin

// Route for the user requests
router.post("/register", insertNewUser); // User, Admin
router.post("/login", authenticateUser); // User, Admin, Driver
router.post("/register/driver", registerDriver); // Admin
router.get("/history", getUserHistory); // User

router.get("/myprofile/:userId", getUserProfile) // User
router.put("/myprofile/update", updateUserSetting); // User
router.post("/myitem/add", addNewItem); // User
router.get("/myitem/:userId", getItemStock); // User, Admin
router.post("/myitem/createpickup", createItemWastePickup); // User

router.get("/myitem/recommendation", getRecommendation); // User

export default router;