import exp from "constants";
import { Pickup, User, Trash } from "../models/dbModel.js";
import { createHash } from 'crypto';
import { Sequelize } from "sequelize"; 

// Pickup controller
export const getPickup = async (req, res) => {
    try {
        const statusFilter = req.query.status ? { status: req.query.status } : {};

        const pickup = await Pickup.findAll({
            where: statusFilter
        });

        const response = await Promise.all(pickup.map(async (element) => {
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
                trashPrice: trash.trashPrice,
                totalReward: element.qty * trash.trashPrice
            };
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPickupByPickupId = async (req, res) => {
    try {
        if (req.query.status) {
            const response = await Pickup.findAll({
                where: {
                    id: req.params.id,
                    status: req.query.status
                }
            });
            res.status(200).json(response);
        } else {
            const response = await Pickup.findOne({
                where: {
                    id: req.params.id
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
        res.status(201).json(response);
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


// User Controller
export const insertNewUser = async (req, res) => {
    try {
        req.body.password = createHash('sha256').update(req.body.password).digest('hex');
        const response = await User.create(req.body);
        res.status(201).json(true);
    } catch (error) {
        console.log(error.message);
    }
};

export const authenticateUser = async (req, res) => {
    try {
        req.body.password = createHash('sha256').update(req.body.password).digest('hex');
        const response = await User.findOne({
            where: {
                email: req.body.email,
                password: req.body.password
            }
        });
        if (response) {
            res.status(200).json(true);
        } else {
            res.status(404).json(false);
        }
    } catch (error) {
        console.log(error.message);
    }
};


export const getUserHistory = async (req, res) => {
    try{
        const dateFilter = req.query.datefilter ? { filter: req.query.datefilter } : false;

        if (req.query.status) {
            if (dateFilter){
                if (dateFilter.filter === "week") {
                    let currentDate = new Date();
                    var previousFilter = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
                    previousFilter.setHours(0)
                    previousFilter.setMinutes(0)
                    previousFilter.setSeconds(0)
                    console.log(previousFilter);
                }
        
                if (dateFilter.filter === "month") {
                    let currentDate = new Date();
                    var previousFilter = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
                    previousFilter.setHours(0)
                    previousFilter.setMinutes(0)
                    previousFilter.setSeconds(0)
                }
        
                if (dateFilter.filter === "year") {
                    let currentDate = new Date();
                    var previousFilter = new Date(currentDate - 365 * 24 * 60 * 60 * 1000);
                    previousFilter.setHours(0)
                    previousFilter.setMinutes(0)
                    previousFilter.setSeconds(0)
                }

                const response = await Pickup.findAll({
                    where: {
                        userId: req.query.id,
                        status: req.query.status,
                        createdAt: {
                            [Sequelize.Op.gte]: previousFilter
                        }
                    }
                });
                res.status(200).json(response);
            }else{
                console.log("No date filter"); 
                const response = await Pickup.findAll({
                    where: {
                        userId: req.query.id,
                        status: req.query.status
                    }
                });
                res.status(200).json(response);
            }
        } else {
            if (dateFilter){
                if (dateFilter.filter === "week") {
                    let currentDate = new Date();
                    var previousFilter = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
                    previousFilter.setHours(0)
                    previousFilter.setMinutes(0)
                    previousFilter.setSeconds(0)
                    console.log(previousFilter);
                }
        
                if (dateFilter.filter === "month") {
                    let currentDate = new Date();
                    var previousFilter = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
                    previousFilter.setHours(0)
                    previousFilter.setMinutes(0)
                    previousFilter.setSeconds(0)
                }
        
                if (dateFilter.filter === "year") {
                    let currentDate = new Date();
                    var previousFilter = new Date(currentDate - 365 * 24 * 60 * 60 * 1000);
                    previousFilter.setHours(0)
                    previousFilter.setMinutes(0)
                    previousFilter.setSeconds(0)
                }
                console.log(previousFilter);
                const response = await Pickup.findAll({
                    where: {
                        userId: req.query.id,
                        createdAt: {
                            [Sequelize.Op.gte]: previousFilter
                        }
                    }
                });
                res.status(200).json(response);
            }else{
                console.log("No date filter"); 
                const response = await Pickup.findAll({
                    where: {
                        userId: req.query.id
                    }
                });
                res.status(200).json(response);
            }    
        }




    }catch (error){
        console.log(error.message);
    }

};

