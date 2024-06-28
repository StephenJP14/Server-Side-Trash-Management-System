import { User } from "../models/dbModel.js";
import { createHash } from 'crypto';



export const insertNewUser = async (req, res) => {
    try {
        
        if(!req.body.role){
            res.status(400).json({
                message: "Role is required"
            });
        }

        const roles = ["user", "driver", "admin"];

        if(req.body.role == "driver"){
            if(!req.body.currentRole || req.body.currentRole !== "admin"){
                res.status(400).json({
                    message: "Contact admin to register as driver"
                });
                return;
            }

        }

        if (!roles.includes(req.body.role)) {
            res.status(400).json({
                message: "Invalid role"
            });
        }else{
            req.body.password = createHash('sha256').update(req.body.password).digest('hex');
    
            const sameEmailUser = await User.findOne({
                where: {
                    email: req.body.email
                }
            });
    
            if(sameEmailUser){
                res.status(400).json({
                    message: "Email already exists"
                });
            }else{
                let response = await User.create(req.body);
                response = {
                    "user" : {
                        "id": response.id,
                        "name": response.name,
                        "email": response.email,
                        "createdAt": response.createdAt,
                        "updatedAt": response.updatedAt
                    },
                    "userRole": response.role
                }
                    
                res.status(201).json(response);
            }
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const authenticateUser = async (req, res) => {
    try {
        req.body.password = createHash('sha256').update(req.body.password).digest('hex');
        let response = await User.findOne({
            where: {
                email: req.body.email,
                password: req.body.password
            }
        });
        if (response) {
            response = {
                "user" : {
                    "id": response.id,
                    "name": response.name,
                    "email": response.email,
                    "createdAt": response.createdAt,
                    "updatedAt": response.updatedAt
                },
                "userRole": response.role
            }
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};