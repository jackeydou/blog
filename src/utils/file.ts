import fs from 'fs';
import path from 'path';

export const getAllFilesRecursively = (folder: string): string[] => {
  const result: string[] = [];
  fs.readdirSync(folder).forEach((it) => {
    const curPath = path.join(folder, it);
    if (fs.statSync(curPath).isFile()) {
      result.push(curPath);
    } else {
      const subDirFiles = getAllFilesRecursively(curPath);
      result.push(...subDirFiles);
    }
  });
  return result;
};
