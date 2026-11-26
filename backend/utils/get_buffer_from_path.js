import fs from 'node:fs/promises';
import path from 'node:path';

export async function getBufferFromPath(filePath) {
  const resolvedPath = path.resolve(filePath);
  const buffer = await fs.readFile(resolvedPath);
  return buffer;
}