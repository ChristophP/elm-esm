#!/usr/bin/env node

const {spawn, spawnSync} = require("child_process");
const {promisify} = require("util");
const fs = require("fs");
const which = require("which");
const {toESModule} = require("./index");

const findElmBinary = () => {
  // global installation
  if (compilerPath) {
    return compilerPath;
  }
  const binDir = spawnSync("npm", ["bin"], {encoding: "utf8"})
    .stdout.toString("utf8")
    .trim();
  return which("elm", {path: binDir})
    .catch(() => which("elm"))
    .catch(() => {
      console.log(
        "No elm compiler found. Please make sure Elm is installed and available through any of these options."
      );
      console.log("Looked for compiler in:");
      console.log(`- ${binDir}`);
      console.log(`- Anywhere in you \$PATH environment variable`);
      console.log(`- in a path passed to this tool via the --compiler flag`);
      process.exit(1);
    });
};

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const args = process.argv;
const outputArg = process.argv.find(arg => arg.startsWith("--output"));
const outputFile = outputArg ? outputArg.split("=")[1] : "index.html";
const isJsFile = outputFile.endsWith(".js");

const compilerArg = process.argv.find(arg => arg.startsWith("--compiler"));
const compilerPath = compilerArg ? compilerArg.split("=")[1] : null;

const delegateToElmCompiler = async () => {
  const sanitizedArgs = args
    .slice(2)
    .filter(arg => !arg.startsWith("--compiler"));
  const elmBinary = await findElmBinary();
  const elm = spawn(elmBinary, sanitizedArgs, {stdio: "inherit"});

  return new Promise((resolve, reject) => {
    elm.on("close", resolve);
    elm.on("error", reject);
  });
};

const postProcess = async () => {
  const js = await readFileAsync(outputFile, "utf8");
  await writeFileAsync(outputFile, toESModule(js), "utf8");
};

const run = async () => {
  await delegateToElmCompiler();
  if (isJsFile) {
    await postProcess();
  }
};

run().catch(err => {
  console.log(
    "Something crashed unexpectedly. Please open an issue with this error message."
  );
  console.log(err);
});
