#!/usr/bin/env node
const shell = require("shelljs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const SOURCE_FOLDER = "./src/graphql";
const DESTINATION_FOLDER = "./dist/src/graphql/schema";

shell.cd(ROOT_DIR);

if (!shell.test("-d", SOURCE_FOLDER)) {
  console.error(`Source folder '${SOURCE_FOLDER}' not found.`);
  process.exit(1);
}

shell.mkdir("-p", DESTINATION_FOLDER);

shell
  .find(SOURCE_FOLDER)
  .filter((fileName) => fileName.endsWith(".graphql"))
  .forEach((fileName) => {
    shell.cp("--", fileName, DESTINATION_FOLDER);
  });

console.log(
  `✅ Copied .graphql files from '${SOURCE_FOLDER}' and its subdirectories to '${DESTINATION_FOLDER}'.`
);
