import dotenv from "dotenv";
import express from "express";
import dbConnection from "./db/dbConnection.js";
import errorHandling from "./src/middleware/errorHandling.js";

dotenv.config({ path: "../.env" });

const app = express();

dbConnection();

app.get("/", (req, res) => {
  res.send("Student Planner API is running");
});

app.use(errorHandling);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
