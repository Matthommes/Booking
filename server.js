const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");

const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/CategoryRoutes.js");
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware.js");

const app = express();
const prisma = new PrismaClient();


// Middlewares
app.use(cors());
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users/", userRoutes);
app.use("/api/categories/", categoryRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
