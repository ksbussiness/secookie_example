import cors from "cors";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import UsersDetails from "../models/UsersDetails.js";
import Logs from "../models/LoginLogoutDetails.js";


import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cors());



export const register = async (req, res) => {
  let { username, age, email, Phone, Address, password } = req.body;

  try {
    let existingUser = await UsersDetails.findOne({ username });

    if (existingUser) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "User already exists" });
    }

    let user = new UsersDetails({
      username,
      age,
      email,
      Phone,
      Address,
      password,
    });

    await user.save();

    res
      .status(StatusCodes.CREATED)
      .json({ message: "The endUser registered successfully" });
  } catch (err) {
    console.error("Error creating user:", err);


    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server Error creating user" });
  }
};

export const login = async (req, res) => {
  let { username, password } = req.body;

  try {
    console.log(req.body);

    let user = await UsersDetails.findOne({ username });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid credentials" });



    // let payload = { id: user._id, username: user.username };
    // const token = jwt.sign(payload, process.env.SEC);

    // console.log(token);

    let existingLog = await Logs.findOne({ UserId: user._id });

    console.log(existingLog, "exisiting loger details here");

    // Store user ID in session
    req.session.userId = user._id;

    await Logs.findOneAndUpdate(
      { UserId: user._id },
      {
        logintime: Date.now(),
        logouttime: null,
        // UserToken: token,
        UserToken: "token",
      },
      { upsert: true, new: true }
    );

    // console.log("Sending login response with token:", token);



    // res.cookie("token", token, {

    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "Strict",
    //   maxAge: 24 * 60 * 60 * 1000,
    //   signed: true
    // });


    res.status(StatusCodes.OK).json({ message: "Login Successfull" });
  } catch (err) {
    console.log("Server error while login", err);


    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error while logging in" });
  }
};

export const logout = async (req, res) => {
  try {


    const userId = req.session.userId;
    //let token = req.cookies.token;
    // let token = req.signedCookies.token;


    // let authHeader = req.headers["authorization"];
    // let token = authHeader && authHeader.split(" ")[1];

    // let decoded = jwt.verify(token, process.env.SEC);
    // let userId = decoded.id;
    // console.log(userId);

    const userlogs = await Logs.findOne({ UserId: userId });



    if (userlogs) {
      userlogs.logouttime = Date.now();
      userlogs.UserToken = null;
      await userlogs.save();
    }


    // console.log("User logs for logout:", userlogs);

    // userlogs.logouttime = Date.now();
    // userlogs.UserToken = null;

    // await userlogs.save();

    // res.clearCookie('token', {
    //   path: '/',          // Must match the path used when setting
    //   httpOnly: true,     // If it was httpOnly when you set it
    //   secure: false,
    //   sameSite: "Strict",
    //   maxAge: 24 * 60 * 60 * 1000,// If it was secure when you set it
    // });




    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.log("Session destroy error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }

      res.clearCookie('sessionId');
      res.json({ message: "Logout successful" });
    });




    // res.json({ message: "Logout successful" });
  } catch (err) {
    console.log("server error while logging out:", err);
    Sentry.captureException(err);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error while logging out" });
  }
};

