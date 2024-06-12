import express from "express";
import {getPickup, 
    getPickupById,
    createPickup,
    updatePickup, 
    insertNewUser,
    authenticateUser,
    getTrashStock
} from "../controllers/pickupController.js";

// Route for the pickup requests 
const router = express.Router();
router.get("/pickup", getPickup);
router.get("/pickup/:id", getPickupById);
router.post("/requestpickup", createPickup);
router.put("/updatepickup/:id", updatePickup);
router.put("/register", insertNewUser);
router.post("/login", authenticateUser);
router.get("/trashstock", getTrashStock);

export default router;