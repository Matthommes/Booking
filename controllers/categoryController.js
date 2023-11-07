import  prisma from "../Services/prisma.js"
import asyncHandler from "express-async-handler";

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const category = await prisma.category.findMany({});
    if (category.length < 1) {
      res.status(204).json({ message: "No Categories yet" });
    }
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, configuration } = req.body;
  const userId = req.user[0].id;
  console.log(userId)
  try {
    if (!name || !configuration) {
      res.status(401).json({ message: "Please fill required filled" });
    }
    const newCategory = await prisma.category.create({
      data: {
        categoryName: name,
        configuration,
        userId,
      },
    });
    res.json(
      {
        message: "Created new category",
      },
      newCategory
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export  { getAllCategories, createCategory };
