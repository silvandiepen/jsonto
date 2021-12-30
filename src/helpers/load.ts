const { readFile, access, F_OK, writeFile, mkdir } = require("fs").promises;
import { BLOCK_LINE_ERROR } from "cli-block";
import { join, dirname } from "path";

const filePath = (file: string): string => {
  return join(process.cwd(), file);
};

export const fileExists = async (
  path: string,
  report = false
): Promise<Boolean> => {
  const file = filePath(path);
  const exists = await access(file, F_OK)
    .then(() => true)
    .catch(() => {
      if (report) BLOCK_LINE_ERROR(`${path} does not exist`);
      return false;
    });
  return exists;
};

export const loadFile = async (path: string): Promise<string> => {
  const file = filePath(path);
  try {
    const fileData = await readFile(file);
    return fileData.toString();
  } catch (err) {
    throw Error(err);
  }
};

export const createFolder = async (path: string): Promise<void> => {
  const createPath = await !fileExists(path);

  if (createPath) await mkdir(dirname(filePath(path)), { recursive: true });
  return;
};

export const writeCreatedFile = async (
  path: string,
  data: string
): Promise<void> => {
  const file = filePath(path);
  try {
    await createFolder(path);
    await writeFile(file, data);
  } catch (err) {
    throw Error(err);
  }
};
