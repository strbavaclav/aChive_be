"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const database_config_js_1 = require("./database/database.config.js");
const auth_route_js_1 = __importDefault(require("./routes/auth.route.js"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
mongoose_1.default.connect(process.env.MONGODB_URI);
async function run() {
    try {
        await database_config_js_1.client.connect();
        await database_config_js_1.client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        await database_config_js_1.client.close();
    }
}
run().catch(console.dir);
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/auth", auth_route_js_1.default);
app.use((req, res) => {
    res.status(404).json("404 - endpoint do not exits!");
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port} 🚀`);
});
