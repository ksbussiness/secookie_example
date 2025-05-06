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

const router = express.Router()


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               age:
 *                 type: number
 *               email:
 *                 type: string
 *               Phone:
 *                 type: string
 *               Address:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       403:
 *         description: User already exists
 */

router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: User not found
 *       403:
 *         description: Invalid credentials
 */

router.post("/login", login);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs the user out and clears session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Logout failed
 */

router.post("/logout", auth, logout);


export default router;
