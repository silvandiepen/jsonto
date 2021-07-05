#!/usr/bin/env node

import ejs from "ejs";
import {
  BLOCK_START,
  asyncForEach,
  hello,
  BLOCK_END,
  BLOCK_LINE_SUCCESS,
} from "cli-block";

import { Config, File } from "./types";
import {
  fileExists,
  loadFile,
  SassValue,
  SassObject,
  writeCreatedFile,
} from "./helpers";

const getConfig = (): Config => {
  
  if (!process.argv[2]) console.warn("No source file defined");
  if (!process.argv[3]) console.warn("No output file defined");
  if (!process.argv[4]) console.warn("No template file defined");

  const config: Config = {
    files: [
      {
        name: "input",
        path: process.argv[2],
      },
      {
        name: "output",
        path: process.argv[3],
      },
      { name: "template", path: process.argv[4] },
    ],
    compiled: "",
  };
  return config;
};

const stop = () => {
  BLOCK_END();
  process.exit();
};

const loadAllFiles = async (config: Config): Promise<Config> => {
  await asyncForEach(config.files, async (file: File) => {
    if (await fileExists(file.path))
      file.file = await (await loadFile(file.path)).toString();
    else {
      if (file.name == "input" || file.name == "template") stop();
    }
    if (file.file && file.path.includes(".json"))
      file.data = JSON.parse(file.file);
  });
  return config;
};

const getTemplateFile = (config: Config): string => {
  const file: File | undefined = config.files.find(
    (f) => f.name === "template"
  );
  return file && file.file ? file.file : "";
};

const getSourceData = (config: Config): any => {
  const file: File | undefined = config.files.find((f) => f.name === "input");
  return file && file.data ? file.data : "";
};

const getSourceFile = (config: Config): File | undefined => {
  const file: File | undefined = config.files.find((f) => f.name === "input");
  return file;
};

const getOutputFile = (config: Config): any => {
  const file: File | undefined = config.files.find((f) => f.name === "output");
  return file && file.path ? file.path : "";
};

const buildFile = (config: Config): Config => {
  let templateFile = getTemplateFile(config);

  let generatedFile = ejs.render(templateFile, {
    data: getSourceData(config),
    sassData: SassObject(getSourceData(config)),
    toSassValue: SassValue,
    toSassObject: SassObject,
  });
  return {
    ...config,
    compiled: generatedFile,
  };
};

const createFile = async (config: Config): Promise<Config> => {
  const output = getOutputFile(config);
  const compiled = config.compiled;
  const sourceFile = getSourceFile(config) || { path: "" };

  await writeCreatedFile(output, compiled);
  await BLOCK_LINE_SUCCESS(`${sourceFile.path} → ${output}`);

  return config;
};

hello()
  .then(() => {
    BLOCK_START("JSON To...");
  })
  .then(getConfig)
  .then(loadAllFiles)
  .then(buildFile)
  .then(createFile)
  .then(() => BLOCK_END());
