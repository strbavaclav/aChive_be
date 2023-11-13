import { GraphQLError } from "graphql/error";
import {
  MutationSignUpArgs,
  User as UserType,
} from "../../../types/graphqlTypesGenerated";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../models/UserModel";

export const signUpResolver = async (
  _: unknown,
  { authData }: MutationSignUpArgs
): Promise<UserType> => {
  try {
    const { email, username, password } = authData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign(
      { user_id: newUser._id },
      process.env.ACCESS_JWT_SECRET!!,
      { expiresIn: "30d" }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new GraphQLError("Something wrong!", {
      extensions: { code: "AUTH_FAILED" },
    });
  }
};
