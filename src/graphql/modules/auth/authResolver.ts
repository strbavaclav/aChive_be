import { GraphQLError } from "graphql/error";
import {
  AuthData,
  MutationSignInArgs,
  MutationSignUpArgs,
  User as UserType,
} from "../../../types/graphqlTypesGenerated";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../models/UserModel";

export const signUpResolver = async (
  _: unknown,
  { authData }: MutationSignUpArgs
): Promise<AuthData> => {
  try {
    const { email, username, password } = authData;

    // Check if email, username, and password are provided
    if (!email || !username || !password) {
      throw new GraphQLError("All fields must be filled.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new GraphQLError("Invalid email format.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Check for duplicate email
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      throw new GraphQLError("Email already in use.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Check for duplicate username
    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      throw new GraphQLError("Username already in use.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign(
      { user_id: newUser._id },
      process.env.ACCESS_JWT_SECRET!!,
      { expiresIn: "30d" }
    );

    return { user: newUser, token: token };
  } catch (error) {
    console.log(error);
    throw new GraphQLError("ERROR", {
      extensions: { code: "ERROR", error: error },
    });
  }
};

export const signInResolver = async (
  _: unknown,
  { authData }: MutationSignInArgs
): Promise<AuthData> => {
  try {
    const { email, password } = authData;

    // Check if email and password are provided
    if (!email || !password) {
      throw new GraphQLError("All fields must be filled.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    console.log("data");

    // Find the user by email
    const existingUser = await User.findOne({ email });

    // Check if the user exists
    if (!existingUser) {
      throw new GraphQLError("Invalid credentials.", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      throw new GraphQLError("Invalid credentials.", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: existingUser._id },
      process.env.ACCESS_JWT_SECRET!!,
      { expiresIn: "30d" }
    );

    return { user: existingUser, token };
  } catch (error) {
    console.log(error);
    throw new GraphQLError("ERROR", {
      extensions: { code: "ERROR", error: error },
    });
  }
};
