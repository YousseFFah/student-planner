import dotenv from "dotenv";
import express from "express";

import dbConnection from "./db/dbConnection.js";
import errorHandling from "./src/middleware/errorHandling.js";

import { router as courseRouter } from "./src/modules/courses/course.routes.js";
import { router as assessmentRouter } from "./src/modules/assessment/assessment.routes.js";
import { router as taskRouter } from "./src/modules/task/task.routes.js";
import { router as userRouter } from "./src/modules/user/user.routes.js";
import { router as dashboardRouter } from "./src/modules/dashboard/dashboard.routes.js";
import { router as progressRouter } from "./src/modules/progress/progress.routes.js";

dotenv.config({ path: "../.env" });

const app = express();

// Database
dbConnection();

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Body parser
app.use(express.json());

// Routes
app.use("/courses", courseRouter);
app.use("/assessments", assessmentRouter);
app.use("/tasks", taskRouter);
app.use("/users", userRouter);
app.use("/dashboard", dashboardRouter);
app.use("/progress", progressRouter);

// Error handling
app.use(errorHandling);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});