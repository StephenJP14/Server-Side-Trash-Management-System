import { Sequelize } from "sequelize";
import { Pickup, User, MyItems } from "../models/dbModel.js";
import { createHash } from 'crypto';
import moment from 'moment';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getUserProfile = async (req, res) => {
    try{
        if(!req.params.userId){
            res.status(400).json({
                message: "User ID is required"
            })
            return;
        }

        let response = await User.findOne({
            where: {
                id: req.params.userId
            }
        });

        response.password = "*".repeat(response.password.length);

        res.status(200).json(response);

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal Server error",
            error: error
        });
    }
}


export const updateUserSetting = async (req, res) => {
    try {
        if (!req.body.userId) {
            res.status(400).json({
                message: "User ID is required"
            });
            return;
        }
        let data = req.body;

        if (req.body.password) {
            data.password = createHash('sha256').update(req.body.password).digest('hex');
        }

        const response = await User.update(data, {
            where: {
                id: data.userId
            }
        });
        res.status(200).json({
            id : response.id,
            message: "User updated"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }

};

const updateItemStatus = async () => {
    try{
        const response = await MyItems.update({
            status: "Expired"
        }, {
            where: {
                expiryDate: { 
                    [Sequelize.Op.ne]: null
                },
                expiryDate: {
                    [Sequelize.Op.lt]: new Date()
                },
                status: {
                    [Sequelize.Op.ne]: "PickedUp"
                }
            }
        });
    }catch(error){
        console.log(error.message);
    }
};



export const addNewItem = async (req, res) => {
    try{
        if (!req.body.userId) {
            res.status(400).json({
                message: "User ID is required"
            });
            return;
        }

        if (!req.body.trashType) {
            res.status(400).json({
                message: "Trash Type is required"
            });
            return;
        }

        let data = req.body;

        if (!['Food', 'Makanan'].includes(req.body.trashType)) {
            console.log("kok bisa")
            data.expiryDate = null;
        }

        const response = await MyItems.create(data);
        await updateItemStatus();

        res.status(201).json({
            message: "Item added"
        });

    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}



export const getItemStock = async (req, res) => {
    try{
        await updateItemStatus();
        if (!req.params.userId) {
            res.status(400).json({
                message: "User ID is required"
            });
            return;
        }
        const itemStatus = ['Good', 'Expired', 'PickedUp'] 
        if(req.query.status){
            if (itemStatus.includes(req.query.status)){
                const response = await MyItems.findAll({
                    where: {
                        userId: req.params.userId,
                        status: req.query.status
                    }
                });
                res.status(200).json(response);
                return;
            }
            if (req.query.status === 'All'){
                const response = await MyItems.findAll(
                    {
                        where: {
                            userId: req.params.userId
                        }
                    }
                );
                res.status(200).json(response);
                return;
            }
        }
        const response = await MyItems.findAll({
            where: {
                userId: req.params.userId,
                status: {
                    [Sequelize.Op.or]: [itemStatus[0], itemStatus[1]]
                }
            }
        });
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


export const createItemWastePickup = async (req, res) => {
    try {
        await updateItemStatus();

        if(!req.body.itemId){
            res.status(400).json({
                message: "Item Stock ID is required"
            });
            return;
        }

        const data = await MyItems.findOne({
            where: {
                id: req.body.itemId
            }
        });

        let finalData = {};
        finalData.userId = data.userId;
        finalData.status = "Available";
        finalData.location = req.body.location;
        finalData.locationLabel = req.body.locationLabel
        finalData.trashDetail = data.trashDetail;
        finalData.trashType = data.trashType;
        finalData.qty = data.qty;

        const response = await Pickup.create(finalData);
        
        await MyItems.update({
            status: 'PickedUp'
        },{
            where: {
                id: req.body.itemId
            }
        });

        res.status(201).json({
            message: "Pickup created"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getRecommendation = async (req, res) => {
    try {
        await updateItemStatus();
        if (!req.query.userId) {
            res.status(400).json({
                message: "User ID is required"
            });
            return;
        }

        const today = moment();
        const nextWeek = moment().add(7, 'days');

        const response = await MyItems.findAll({
            where: {
                userId: req.query.userId,
                status: 'Expired'
            }
        });

        let allItem = [];

        response.forEach(trash => {
            allItem.push(trash.trashDetail);
        });

        if (allItem.length === 0) {
            res.status(200).json({
                message: "No Item available"
            });
            return;
        }
        const genAi = new GoogleGenerativeAI("AIzaSyAf8Y1DjPsfJH-lP9JhqhbIE-VvNGhdIG0");
        const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Anggap anda adalah sebuah sistem yang hanya akan mengembalikan perintah dalam format raw tepat seperti ini tanpa menambahkan apapun [{'namaResep': 'namaResep', 'deskripsi': 'desc','bahan': ['2 telur', 'tepung 500gram', 'gula 1kg'],'langkah': ['Step 1: ambil telur', 'Step 2: ambil tepung']}, {'namaResep': 'namaResep', 'deskripsi': 'desc','bahan': ['2 telur', 'tepung 500gram', 'gula 1kg'],'langkah': ['Step 1: ambil telur', 'Step 2: ambil tepung']}, {'namaResep': 'namaResep', 'deskripsi': 'desc','bahan': ['2 telur', 'tepung 500gram', 'gula 1kg'],'langkah': ['Step 1: ambil telur', 'Step 2: ambil tepung']}].  Berikan saya 3 rekomendasi yang bisa dibuat dengan bahan ${allItem}.`);
        const answer = result.response.text();
        const finalAnwers = eval(answer);


        res.status(200).json(finalAnwers);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// let a = 