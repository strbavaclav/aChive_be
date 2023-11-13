"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInResolver = exports.signUpResolver = void 0;
const error_1 = require("graphql/error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../../../models/UserModel"));
const signUpResolver = async (_, { authData }) => {
    try {
        const { email, username, password } = authData;
        // Check if email, username, and password are provided
        if (!email || !username || !password) {
            throw new error_1.GraphQLError("All fields must be filled.", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new error_1.GraphQLError("Invalid email format.", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
        // Check for duplicate email
        const existingEmailUser = await UserModel_1.default.findOne({ email });
        if (existingEmailUser) {
            throw new error_1.GraphQLError("Email already in use.", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
        // Check for duplicate username
        const existingUsernameUser = await UserModel_1.default.findOne({ username });
        if (existingUsernameUser) {
            throw new error_1.GraphQLError("Username already in use.", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new UserModel_1.default({ username, email, password: hashedPassword });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({ user_id: newUser._id }, process.env.ACCESS_JWT_SECRET, { expiresIn: "30d" });
        return { user: newUser, token: token };
    }
    catch (error) {
        console.log(error);
        throw new error_1.GraphQLError("ERROR", {
            extensions: { code: "ERROR", error: error },
        });
    }
};
exports.signUpResolver = signUpResolver;
const signInResolver = async (_, { authData }) => {
    try {
        const { email, password } = authData;
        // Check if email and password are provided
        if (!email || !password) {
            throw new error_1.GraphQLError("All fields must be filled.", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
        console.log("data");
        // Find the user by email
        const existingUser = await UserModel_1.default.findOne({ email });
        // Check if the user exists
        if (!existingUser) {
            throw new error_1.GraphQLError("Invalid credentials.", {
                extensions: { code: "UNAUTHORIZED" },
            });
        }
        // Compare passwords
        const passwordMatch = await bcrypt_1.default.compare(password, existingUser.password);
        if (!passwordMatch) {
            throw new error_1.GraphQLError("Invalid credentials.", {
                extensions: { code: "UNAUTHORIZED" },
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ user_id: existingUser._id }, process.env.ACCESS_JWT_SECRET, { expiresIn: "30d" });
        return { user: existingUser, token };
    }
    catch (error) {
        console.log(error);
        throw new error_1.GraphQLError("ERROR", {
            extensions: { code: "ERROR", error: error },
        });
    }
};
exports.signInResolver = signInResolver;
