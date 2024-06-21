import express from "express";
import {getPickup, 
    getPickupByPickupId,
    createPickup,
    updatePickup, 
    insertNewUser,
    authenticateUser,
    getTrashStock,
    getUserHistory
} from "../controllers/pickupController.js";

const router = express.Router();

// Route for the pickup requests 
router.get("/pickup", getPickup);
router.get("/pickup/:id", getPickupByPickupId);
router.post("/requestpickup", createPickup);
router.put("/updatepickup/:id", updatePickup);

// Route for the user requests
router.put("/register", insertNewUser);
router.post("/login", authenticateUser);
router.get("/trashstock", getTrashStock);
router.get("/history", getUserHistory);


export default router;