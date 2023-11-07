import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import  profileRoutes  from "./routes/ProfileRoutes.js"
import categoryRoutes from "./routes/CategoryRoutes.js";

import { notFound, errorHandler } from "./Middlewares/errorMiddleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users/", userRoutes);
app.use("/api/users/profile", profileRoutes);
app.use("/api/categories/", categoryRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
