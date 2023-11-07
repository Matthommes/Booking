import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.token;
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode.user;
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized - Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized - No token");
  }
  next();
});
export { protect };
