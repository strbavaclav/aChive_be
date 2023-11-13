import { signUpResolver } from "./modules/auth/authResolver";
import { type Resolvers } from "../types/graphqlTypesGenerated";

const resolvers: Resolvers = {
  Mutation: {
    signUp: signUpResolver,
  },
};

export default resolvers;
