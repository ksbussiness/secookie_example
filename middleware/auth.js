import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import Logs from "../models/LoginLogoutDetails.js";
import { StatusCodes } from "http-status-codes";

const app = express();
app.use(express.json());
app.use(cors());

export default async (req, res, next) => {

    //const token = req.signedCookies.token;

    const userId = req.session.userId;

    // if (!token) return res.status(401).json({ message: "No token, authorization denied" });


    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: No session found" });
    }




    try {
        // Verify the JWT token
        // let decoded = jwt.verify(token, process.env.SEC);
        // let userId = decoded.id;

        // Check if the user has an active session in the Logs model
        const userLogs = await Logs.findOne({ UserId: userId });

        // If no logs are found or if the UserToken is null, it means the user is logged out
        if (!userLogs || userLogs.UserToken === null) {
            return res
                .status(StatusCodes.NOT_ACCEPTABLE)
                .json({ error: "User is logged out" });
        }
        //req.user = decoded;
        req.user = { id: userId };
        next()
    } catch (err) {

        console.log("server error in the middleware:", err)


        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Invalid token" });
    }
};
