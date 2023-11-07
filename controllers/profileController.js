import asyncHandler from "express-async-handler";
import prisma from "../Services/prisma.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user[0].id;
    const userProfile = await prisma.profile.findMany({
      where: {
        userId,
      },
    });
    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    business_name,
    message,
    address,
  } = req.body;
  try {
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !business_name ||
      !message ||
      !address
    ) {
      res.status(400).json({ message: "Please fill all the fields" });
    }
    const userId = req.user[0].id;
    const userProfile = await prisma.profile.update({
      where: {
        userId,
      },
      data: {
        first_name,
        last_name,
        email,
        phone_number,
        business_name,
        message,
        address,
      },
      user: {
        update: {
          email,
        },
      },
    });
    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
