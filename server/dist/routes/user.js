"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    try {
        // express-validator doesen't work so cant do better validation
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ message: "Bad request" });
            return;
        }
        const existingUser = await User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(403).json({ email: "email already in use" });
            return;
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        User_1.User.create({ email: req.body.email, password: hash });
        res.status(200).json({ message: "User registered successfully" });
        return;
    }
    catch (error) {
        console.error(`Error during registration: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
// dont ever do this in real world
router.get("/list", async (req, res) => {
    res.status(200).json(User_1.User);
});
router.post("/login", async (req, res) => {
    try {
        const user = await User_1.User.findOne({ email: req.body.email });
        console.log("User:", user);
        if (!user) {
            res.status(401).json({ message: "Login failed" });
            return;
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            const jwtPayload = {
                email: user.email
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "1h" });
            res.status(200).json({ success: true, token, expiresIn: "1h" });
            return;
        }
        res.status(401).json({ message: "Login failed" });
        return;
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.default = router;
