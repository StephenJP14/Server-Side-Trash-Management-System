import { createHash } from 'crypto';
import { User } from '../models/dbModel.js';

export const registerDriver = async (req, res) => {
    try {
        // req.body.password = createHash('sha256').update(req.body.password).digest('hex');
        if (!req.body.role || req.body.role !== "admin") {
            res.status(400).json({
                message: "Admin Role is required"
            });
            return;
        }
        const result = await User.findOne(
            {
                where: {
                    email: req.body.adminEmail,
                    password: createHash('sha256').update(req.body.adminPassword).digest('hex'),
                    role: "admin"
                }
            }
        );

        if (!result){
            res.status(400).json({
                message: "Invalid admin credentials"
            });
            return;
        }

        let response = await User.create(
            {
                "name": req.body.driverName,
                "email": req.body.driverEmail,
                "password": createHash('sha256').update("changepass").digest('hex'),
                "role": "driver"
            }
        );
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
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }


};