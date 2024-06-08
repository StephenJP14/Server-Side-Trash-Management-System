import express from "express";
import {getPickup, 
    getPickupById,
    createPickup
} from "../controllers/pickupController.js";

// Route for the pickup requests 
const router = express.Router();
router.get("/pickup", getPickup);
router.get("/pickup/:id", getPickupById);
router.post("/requestpickup", createPickup);

export default router;