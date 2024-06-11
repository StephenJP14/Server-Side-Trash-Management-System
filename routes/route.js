import express from "express";
import {getPickup, 
    getPickupById,
    createPickup,
    updatePickup, 
    insertNewUser,
    authenticateUser
} from "../controllers/pickupController.js";

// Route for the pickup requests 
const router = express.Router();
router.get("/pickup", getPickup);
router.get("/pickup/:id", getPickupById);
router.post("/requestpickup", createPickup);
router.put("/updatepickup/:id", updatePickup);
router.put("/register", insertNewUser);
router.post("/login", authenticateUser);

export default router;