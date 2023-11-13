"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (content) => {
    return jsonwebtoken_1.default.sign(content, process.env.ACCESS_JWT_SECRET);
};
exports.createToken = createToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.ACCESS_JWT_SECRET);
};
exports.verifyToken = verifyToken;
