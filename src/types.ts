export interface File {
  name: string;
  path: string;
  file?: string;
  data?: any;
}

export interface Config {
  files: File[];
  compiled: string;
}
