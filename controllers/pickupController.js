import { execPath } from "process";
import {Pickup, User} from "../models/dbModel.js";
// import sha256 from 'crypto-js';
import {createHash} from 'crypto';
import { exec } from "child_process";

export const getPickup = async (req, res) => {
    try {
        if (req.query.status) {
            const response = await Pickup.findAll({
                where: {
                    status: req.query.status
                }
            });
            res.status(200).json(response);
        }else{
            const response = await Pickup.findAll();
            res.status(200).json(response);
        }
    } catch (error) {
        console.log(error.message);
    }
};

export const getPickupById = async (req, res) => {
    try {
        if (req.query.status) {
            const response = await Pickup.findAll({
                where: {
                    userId: req.params.id,
                    status: req.query.status
                }
            });
            res.status(200).json(response);
        }
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

export const updatePickup = async (req, res) => {
    try {
        const response = await Pickup.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(true);
    } catch (error) {
        console.log(error.message);
    }
};

export const insertNewUser = async (req, res) => {
    try {
        req.body.password = createHash('sha256').update(req.body.password).digest('hex');
        const response = await User.create(req.body);
        res.status(201).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const authenticateUser = async (req, res) => {
    try{
        req.body.password = createHash('sha256').update(req.body.password).digest('hex');
        const response = await User.findOne({
            where: {
                email : req.body.email,
                password : req.body.password
            }
        });
        if (res){
            res.status(200).json(response);
        }else{
            res.status(404).json(false);
        }
    }catch(error){
        console.log(error.message);
    }
};