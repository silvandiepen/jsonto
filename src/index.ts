#!/usr/bin/env node

import { Config } from "./types";

const input = process.argv[2];
const output = process.argv[3];
const template = process.argv[4];

if (!process.argv[2]) console.warn("No source file defined");
if (!process.argv[3]) console.warn("No output file defined");
if (!process.argv[4]) console.warn("No template file defined");

const config: Config = {
  input: process.argv[2],
  output: process.argv[3],
  template: process.argv[4],
};

console.log(config);
