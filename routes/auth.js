import express from "express";
import auth from "../middleware/auth.js"
import {
    register,
    login,
    logout
} from "../controller/usersRegister.js";

const app = express();

// Middleware to parse JSON
app.use(express.json());

const router= express.Router()


router.post("/register", register);

router.post("/login", login);

router.post("/logout", auth, logout);


export default router;
