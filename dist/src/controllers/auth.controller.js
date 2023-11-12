"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAndRefreshToken = exports.refreshToken = exports.authenticateToken = exports.signin = exports.signup = void 0;
const UserModel_js_1 = __importDefault(require("../models/UserModel.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new UserModel_js_1.default({ username, email, password: hashedPassword });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({ user_id: newUser._id }, process.env.ACCESS_JWT_SECRET, { expiresIn: "1 month" });
        res.status(201).json({ message: "User created successfully", token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.signup = signup;
const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel_js_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user._id }, process.env.ACCESS_JWT_SECRET, { expiresIn: "1 month" });
        res.status(200).json({ message: "Signin successful", token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.signin = signin;
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized - No token provided" });
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        const user_id = decoded.user_id;
        req.user_id = user_id;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const refreshToken = (req, res, next) => {
    const refreshToken = req.headers["x-refresh-token"];
    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: "Unauthorized - No refresh token provided" });
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ message: "Unauthorized - Invalid refresh token" });
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ user_id: decoded.user_id }, process.env.ACCESS_JWT_SECRET, { expiresIn: "1 month" });
        // Attach the new access token to the response headers
        res.set("Authorization", `Bearer ${newAccessToken}`);
        next();
    });
};
exports.refreshToken = refreshToken;
const authenticateAndRefreshToken = (req, res, next) => {
    (0, exports.authenticateToken)(req, res, () => (0, exports.refreshToken)(req, res, next));
};
exports.authenticateAndRefreshToken = authenticateAndRefreshToken;
