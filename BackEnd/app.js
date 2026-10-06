import dotenv from "dotenv";
import express from "express";
import dbConnection from "./db/dbConnection.js";
import errorHandling from "./src/middleware/errorHandling.js";
import { router } from "./src/modules/courses/course.routes.js";
dotenv.config({ path: "../.env" });

const app = express();

dbConnection();

app.use(express.json());
app.use("/courses", router);
app.use(errorHandling);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
