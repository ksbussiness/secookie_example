import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRou from "./routes/auth.js";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import session from "express-session"
import MongoStore from 'connect-mongo';

import setupSwagger from "./docs/swaggerSetup.js"

// import dbConnect from './utils/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
console.log("Mongo URI", process.env.MONGO_URL);

//const secret = crypto.randomBytes(64).toString('hex');

// console.log("Generated Secret Key:", process.env.COOKIE_SECRET);
// app.use(cookieParser((process.env.COOKIE_SECRET)));

app.use(cookieParser());


// swagger set up
setupSwagger(app)



// Database connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 5000,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);

    });







// Session Setup
app.use(session({
    name: 'sachinSession',
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: false, // Set true in production with HTTPS
        sameSite: 'lax'
    }
}));






// Routes
app.use("/auth", authRou);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
