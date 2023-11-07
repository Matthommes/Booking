import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt"
import { v4 as  uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import prisma from "../Services/prisma.js";
import { sendMail } from "./emailController.js";

const jwtSecret = process.env.JWT_SECRET;

const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body;
  try {
    if (!first_name || !last_name || !email || !password || !phone_number) {
      res.status(401).json({
        status: "error",
        message: "Invalid Credentials, Input all fields",
      });
      return;
    }

    const userExist = await prisma.user.findMany({
      where: {
        email: email,
      },
    });
    if (userExist.length > 0) {
      res.status(401).json({
        status: "error",
        message: "A user with this email already exist",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: hashedPassword,
        phone_number: parseInt(phone_number),
      },
    });

    res.status(201).json({ success: true, user: newUser });

    const emailCode = Math.floor(10000000 + Math.random() * 90000000);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        email_code: emailCode,
      },
    });
    const emailTemplate = `<body style="background-color: #fff; font-family: sans-serif;">
  <h1 style="text-align: center; font-size: 24px; color: #333;">Welcome To Bookings</h1>
  <p style="margin-top: 20px; font-size: 16px; color: #666;">Hi ${
    first_name + " " + last_name
  },</p >
  <p style="margin-top: 20px; font-size: 16px; color: #666;">
    We're happy to have you at booking
  </p>
  <p style="margin-top: 20px; font-size: 16px; color: #666;">This is your confirmation code.</p>
  <button style="background-color: #333; color: #fff; padding: 10px 20px; border-radius: 5px;">
    <a href="http://localhost:8000/api/users/confirm-email/${emailCode}" style="color: #fff;">Confirm Email</a>
  </button>
  <br />
  <p style="margin-top: 20px; font-size: 16px; color: #666;">Thanks,  ${first_name}</p>

  <p style="margin-top: 20px; font-size: 16px; color: #666;">The Bookings Team</p>
</body>`;

    sendMail(
      email,
      emailTemplate,
      "We're Happy to have you at Bookings 👋🏼 🚀 😎 🫶🏼"
    );
  } catch (error) {
    res.status(404).json({ status: false, error });
    console.log(error);
    return;
  }
});

const confirmEmail = asyncHandler(async (req, res) => {
  const code = req.params.id;

  const email_code = parseInt(code);

  try {
    const user = await prisma.user.findFirst({
      where: {
        email_code,
      },
    });

    if (!user) {
      res
        .status(401)
        .json({ status: false, error: "Invalid confirmation code" });
      return;
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email_code: null,
        email_confirmed: true,
      },
    });
    res.status(201).json({ status: true, message: "Email Confirmed" });
  } catch (error) {
    res.status(500).json(error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(404)
        .json({ status: "error", message: "Please input required fields" });
    }

    const user = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    if (!user || !user.length > 0) {
      res.status(401).json({ status: "error", message: "User doesn't exist" });
    }
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      res.status(401).json({ status: "error", message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign({ user }, jwtSecret, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ status: "completed", user });
  } catch (error) {
    // next(error);
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401).json({ message: "Please add an email address" });
    return;
  }

  try {
    // check if email input matches email in db
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    // console.log(user);
    if (!user) {
      res.status(401).json({ message: "Invalid email address" });
      return;
    }

    // UUID
    const token = uuidv4();

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password_reset: token,
      },
    });

    // Email template

    const template = `
      <body>
        <h1>Reset your password on Bookings</h1>

        <p>Hi ${user.first_name + " " + user.last_name},</p >

        <p>
          You have requested a password reset for your account on Bookings.
        </p>

        <p>To reset your password, please click on the following link:</p>


        <a href="http://localhost:8000/api/users/reset?token=${token}">http://localhost:8000/api/users/reset?token=${token}&email=${
      user.email
    }</a>
    <br />
    <button>
        <a href="http://localhost:8000/api/users/reset?token=${token}">
          RESET
        </a>
</button>
        <p>This link will expire in 24 hours.</p>

        <p>
          If you did not request a password reset, please ignore this email.
        </p>

        <p>Thanks,</p>

        <p>The Bookings Team</p>
      </body>
    `;

    sendMail(user.email, template, "Password reset token 👋🏼");

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(401).json({ message: error.message });
    console.log(error);
  }
});
const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(401).json({ status: "failed", message: "Unauthorized" });
      return;
    }

    if (token !== user.password_reset || token === "") {
      res.status(401).json({ status: "failed", message: "Invalid token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password_reset: "",
        password: hashedPassword,
      },
    });

    res
      .status(200)
      .json({ status: "Success", message: "Password Reset Successful" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An Error Occurred" });
    console.log(error);
  }
});

export { registerUser, confirmEmail, loginUser, forgotPassword, resetPassword };
