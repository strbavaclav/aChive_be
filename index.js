import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import { client } from "./src/database/database.config.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res) => {
  res.status(404).json("404 - endpoint do not exits!");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`);
});
