import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(bodyParser.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log("MongoDb Connection Error", err));

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
