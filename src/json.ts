import { dirname } from 'path';
import pkgUp from 'pkg-up';
import { readFileSync } from 'fs';

export function readJSON(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function getModulePackagePath(caller: string) {
  return pkgUp.sync({ cwd: dirname(caller) });
}
