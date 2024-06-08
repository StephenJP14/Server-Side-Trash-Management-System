import Pickup from "../models/pickupModel.js";

export const getPickup = async (req, res) => {
    try {
        const response = await Pickup.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const getPickupById = async (req, res) => {
    try {
        const response = await Pickup.findOne({
            where: {
                userId: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const createPickup = async (req, res) => {
    try {
        const response = await Pickup.create(req.body);
        res.status(201).json(response);
    } catch (error) {
        console.log(error.message);
    }
};