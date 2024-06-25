import { Pickup, User, Trash } from "../models/dbModel.js";
import { Sequelize } from "sequelize"; 


export const getPickup = async (req, res) => {
    try {

    

        if (req.query.status) {
            if(req.query.id){
                const response = await Pickup.findOne({
                    where: {
                        id: req.query.id,
                        status: req.query.status
                    }
                });
                res.status(200).json(response);
            }
            else{
                const response = await Pickup.findAll({
                    where: {
                        status: req.query.status
                    }
                });
                res.status(200).json(response);
            }
        } else {
            const response = await Pickup.findOne({
                where: {
                    id: req.query.id
                }
            });
            res.status(200).json(response);
        }
    } catch (error) {
        console.log(error.message);
    }
};


export const createPickup = async (req, res) => {
    try {
        const response = await Pickup.create(req.body);
        res.status(201).json({
            id: response.id,
            message: "Pickup created"
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const updatePickup = async (req, res) => {
    try {
        if (!["Available", "Delivering", "Complete"].includes(req.body.status)) {
            res.status(400).json("Invalid status");
            return;
        }

        const pickup = await Pickup.findOne({
            where: {
                id: req.params.id
            }
        });


        if (req.body.status === "Complete" && pickup.status !== "Complete") {
            // Update the Pickup record
            await Pickup.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            

            // Fetch the updated Pickup record
            const trashReq = await Pickup.findOne({
                where: {
                    id: req.params.id
                }
            });

            // Check if the trash already exists
            const existingTrash = await Trash.findOne({
                where: {
                    trashDetail: trashReq.trashDetail,
                    trashType: trashReq.trashType
                }
            });

            if (existingTrash) {
                // If the trash exists, update the quantity
                await Trash.update({
                    qty: existingTrash.qty + trashReq.qty
                }, {
                    where: {
                        id: existingTrash.id
                    }
                });
            } else {
                // If the trash does not exist, create a new entry
                await Trash.create({
                    trashDetail: trashReq.trashDetail,
                    trashType: trashReq.trashType,
                    qty: trashReq.qty
                });
            }

            res.status(200).json(true);
        } else {
            // Update the Pickup record for statuses other than "Complete"
            await Pickup.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json(true);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Internal server error");
    }
};

export const getTrashStock = async (req, res) => {
    try {
        const response = await Trash.findAll();
        if (response.length === 0) {
            const empty_response = [{"trashDetail": "No Trash Available", "trashType" : "NaN", "qty" : 0}];
            res.status(200).json(empty_response);
        }else{
            res.status(200).json(response);
        }
    } catch (error) {
        console.log(error.message);
    }
};


const getPreviousDate = (filter) => {
    let currentDate = new Date();
    let previousDate;

    switch (filter) {
        case 'week':
            previousDate = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            previousDate = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
            break;
        case 'year':
            previousDate = new Date(currentDate - 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            return null;
    }

    previousDate.setHours(0, 0, 0, 0);
    return previousDate;
};


export const getUserHistory = async (req, res) => {
    try {
        const { id, datefilter, status, trashType } = req.query;
        
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        let whereClause = { userId: id };

        if (status) {
            whereClause.status = status;
        }

        if (trashType) {
            whereClause.trashType = trashType;
        }

        if (datefilter) {
            const dateStart = getPreviousDate(datefilter);
            if (dateStart) {
                whereClause.createdAt = { [Sequelize.Op.gte]: dateStart };
            }
        }

        const pickups = await Pickup.findAll({ where: whereClause });

        const response = await Promise.all(pickups.map(async (element) => {
            const trash = await Trash.findOne({
                where: {
                    trashDetail: element.trashDetail,
                    trashType: element.trashType
                }
            });

            return {
                id: element.id,
                qty: element.qty,
                trashDetail: element.trashDetail,
                trashType: element.trashType,
                userId: element.userId,
                location: element.location,
                status: element.status,
                trashPrice: trash ? trash.trashPrice : 0,
                totalReward: trash ? element.qty * trash.trashPrice : 0
            };
        }));

        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};


