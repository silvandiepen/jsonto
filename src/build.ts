#!/usr/bin/env node

import ejs from "ejs";
import {
  BLOCK_START,
  asyncForEach,
  hello,
  BLOCK_END,
  BLOCK_LINE_SUCCESS,
} from "cli-block";
import { extname } from "path";
import { Config, File, Arguments } from "./types";
import {
  fileExists,
  loadFile,
  SassValue,
  SassObject,
  writeCreatedFile,
} from "./helpers";
import prettier from "prettier";

const getConfig = (args: Arguments): Config => {
  const input = process.argv[2] || args.input || "";
  const output = process.argv[3] || args.output || "";

  !input && console.warn("No source file defined");
  !output && console.warn("No output file defined");

  const template =
    process.argv[4] || args.template || `${extname(output)}.template`;

  const config: Config = {
    files: [
      {
        name: "input",
        path: input,
      },
      {
        name: "output",
        path: output,
      },
      {
        name: "template",
        path: template,
      },
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

  let generatedFile = prettier.format(
    ejs.render(templateFile, {
      data: getSourceData(config),
      sassData: SassObject(getSourceData(config)),
      toSassValue: SassValue,
      toSassObject: SassObject,
    })
  );
  return {
    ...config,
    compiled: generatedFile,
  };
};

const createFile = async (config: Config): Promise<Config> => {
  const outputFileName = getOutputFile(config);
  const sourceFile = getSourceFile(config) || { path: "" };

  await writeCreatedFile(outputFileName, config.compiled);
  BLOCK_LINE_SUCCESS(`${sourceFile.path} → ${outputFileName}`);

  return config;
};

export const runJsonTo = async (args: Arguments = {}): Promise<Config> => {
  const result = await hello()
    .then(() => {
      args.cli && BLOCK_START("JSON To...");
    })
    .then(() => getConfig(args))
    .then(loadAllFiles)
    .then(buildFile)
    .then((config) => {
      if (!args.noFile) createFile(config);
      return config;
    })
    .then((config) => {
      args.cli && BLOCK_END();
      return config;
    });
  console.log(result);
  return result;
};
