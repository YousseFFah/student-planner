import dotenv from "dotenv";
import express from "express";

import dbConnection from "./db/dbConnection.js";
import errorHandling from "./src/middleware/errorHandling.js";

import { router as courseRouter } from "./src/modules/courses/course.routes.js";
import { router as assessmentRouter } from "./src/modules/assessment/assessment.routes.js";
import { router as taskRouter } from "./src/modules/task/task.routes.js";
import {router as userRouter} from "./src/modules/user/user.routes.js";
import { router as dashboardRouter } from "./src/modules/dashboard/dashboard.routes.js";
import { router as progressRouter } from "./src/modules/progress/progress.routes.js";


dotenv.config({ path: "../.env" });

const app = express();

dbConnection();

app.use(express.json());

app.use("/courses", courseRouter);
app.use("/assessments", assessmentRouter);
app.use("/tasks", taskRouter);
app.use("/users", userRouter);
app.use("/dashboard", dashboardRouter);
app.use("/progress", progressRouter);

app.use(errorHandling);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
