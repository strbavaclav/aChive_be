import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign(
      { user_id: newUser._id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "1 month" }
    );

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { user_id: user._id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "1 month" }
    );

    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user_id = decoded.user_id;

    req.user_id = user_id;

    next();
  });
};

export const refreshToken = (req, res, next) => {
  const refreshToken = req.headers["x-refresh-token"];

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No refresh token provided" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { user_id: decoded.user_id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "1 month" }
    );

    // Attach the new access token to the response headers
    res.set("Authorization", `Bearer ${newAccessToken}`);

    next();
  });
};

export const authenticateAndRefreshToken = (req, res, next) => {
  authenticateToken(req, res, () => refreshToken(req, res, next));
};
