import { signInResolver, signUpResolver } from "./modules/auth/authResolver";
import { type Resolvers } from "../types/graphqlTypesGenerated";

const resolvers: Resolvers = {
  Mutation: {
    //Auth
    signUp: signUpResolver,
    signIn: signInResolver,
  },
};

export default resolvers;
