import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import { client } from "./database/database.config.js";
import authRoutes from "./routes/auth.route.js";
import mongoose from "mongoose";

const app = express();

mongoose.connect(process.env.MONGODB_URI!!);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json("404 - endpoint do not exits!");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`);
});
