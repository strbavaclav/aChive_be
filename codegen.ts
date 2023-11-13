import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/**/*.graphql",
  generates: {
    "./src/types/graphqlTypesGenerated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
