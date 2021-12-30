type Data = any; // TODO: Type Data

export interface File {
  name: string;
  path: string;
  file?: string;
  data?: Data;
}

export interface Config {
  files: File[];
  compiled: string;
}
export interface Arguments {
  cli?: boolean;
  input?: string;
  output?: string;
  template?: string;
  noFile?: boolean;
}
