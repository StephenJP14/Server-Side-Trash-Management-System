import { Sequelize } from "sequelize";
import { Pickup, User, Food } from "../models/dbModel.js";
import moment from 'moment';
import { GoogleGenerativeAI } from "@google/generative-ai";


export const updateUserSetting = async (req, res) => {
    try {
        const response = await User.update(req.body, {
            where: {
                id: req.body.id
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

export const addNewFood = async (req, res) => {
    try{
        const response = await Food.create(req.body);
        res.status(201).json({
            message: "Food added"
        });

    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const getFoodStock = async (req, res) => {
    try{
        const status = ['Tersedia', 'Expired', 'Dibuang'] 
        if(req.query.status){
            if (status.includes(req.query.status)){
                const response = await Food.findAll({
                    where: {
                        status: req.query.status
                    }
                });
                res.status(200).json(response);
                return;
            }
            if (req.query.status === 'Semua'){
                const response = await Food.findAll();
                res.status(200).json(response);
                return;
            }
        }
        const response = await Food.findAll({
            where: {
                status: {
                    [Sequelize.Op.or]: [status[0], status[1]]
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


export const createFoodWastePickup = async (req, res) => {
    try {
        if(!req.body.fid){
            res.status(400).json({
                message: "Food Stock ID is required"
            });
            return;
        }

        const response = await Pickup.create(req.body);
        
        Food.update({
            status: 'Dibuang'
        },{
            where: {
                id: req.body.fid
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

        if (!req.query.id) {
            res.status(400).json({
                message: "User ID is required"
            });
            return;
        }

        const today = moment();
        const nextWeek = moment().add(7, 'days');

        const response = await Food.findAll({
            where: {
                userId: req.query.id,
                expiryDate: {
                    [Sequelize.Op.between]: [today.toDate(), nextWeek.toDate()]
                },
                status: 'Tersedia'
            }
        });

        let allFood = [];

        response.forEach(trash => {
            allFood.push(trash.trashDetail);
        });

        if (allFood.length === 0) {
            res.status(200).json({
                message: "No food available"
            });
            return;
        }
        const genAi = new GoogleGenerativeAI("AIzaSyAf8Y1DjPsfJH-lP9JhqhbIE-VvNGhdIG0");
        const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Anggap anda adalah sebuah sistem yang hanya akan mengembalikan perintah dalam format raw tepat seperti ini tanpa menambahkan apapun [{'nama makanan': 'nama makanan', 'deskripsi': 'desc','bahan': ['2 telur', 'tepung 500gram', 'gula 1kg'],'langkah': ['Step 1: ambil telur', 'Step 2: ambil tepung']}, {'nama makanan': 'nama makanan', 'deskripsi': 'desc','bahan': ['2 telur', 'tepung 500gram', 'gula 1kg'],'langkah': ['Step 1: ambil telur', 'Step 2: ambil tepung']}, {'nama makanan': 'nama makanan', 'deskripsi': 'desc','bahan': ['2 telur', 'tepung 500gram', 'gula 1kg'],'langkah': ['Step 1: ambil telur', 'Step 2: ambil tepung']}].  Berikan saya 3 rekomendasi yang bisa dibuat dengan bahan ${allFood}.`);
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