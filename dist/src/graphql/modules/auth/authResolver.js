"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpResolver = void 0;
const error_1 = require("graphql/error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../../../models/UserModel"));
const signUpResolver = async (_, { authData }) => {
    try {
        const { email, username, password } = authData;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new UserModel_1.default({ username, email, password: hashedPassword });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({ user_id: newUser._id }, process.env.ACCESS_JWT_SECRET, { expiresIn: "30d" });
        return newUser;
    }
    catch (error) {
        console.log(error);
        throw new error_1.GraphQLError("Something wrong!", {
            extensions: { code: "AUTH_FAILED" },
        });
    }
};
exports.signUpResolver = signUpResolver;
