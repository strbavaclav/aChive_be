"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const database_config_1 = require("./database/database.config");
const mongoose_1 = __importDefault(require("mongoose"));
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
const rootTypeDefs_1 = __importDefault(require("./graphql/rootTypeDefs"));
const rootResolver_1 = __importDefault(require("./graphql/rootResolver"));
const init = async () => {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const server = new server_1.ApolloServer({
        typeDefs: [rootTypeDefs_1.default],
        resolvers: rootResolver_1.default,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    await server.start();
    mongoose_1.default.connect(process.env.MONGODB_URI);
    async function run() {
        try {
            await database_config_1.client.connect();
            await database_config_1.client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        }
        finally {
            await database_config_1.client.close();
        }
    }
    run().catch(console.dir);
    app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
    }));
    app.use((req, res) => {
        res.status(404).json("404 - endpoint do not exits!");
    });
    await httpServer.listen({ port: 4000 });
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};
init();
