import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (content: string | object): string => {
  return jwt.sign(content, process.env.ACCESS_JWT_SECRET!!);
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, process.env.ACCESS_JWT_SECRET!!);
};
