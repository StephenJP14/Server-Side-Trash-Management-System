import express from "express";
import {getPickup, getPickupById} from "../controllers/pickupController.js";

// Route for the pickup requests 
const router = express.Router();
router.get("/pickup", getPickup);
router.get("/pickup/:id", getPickupById);

export default router;