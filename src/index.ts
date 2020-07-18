import { readFileSync } from 'fs';
import { dirname } from 'path';
import pkgUp from 'pkg-up';
import chalk from 'chalk';
import link from 'terminal-link';

function readJSON(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

interface Option {
  showStackTrace?: boolean;
  onError?: (err: Error, ...rest: any[]) => undefined | string;
}

function getModulePackagePath() {
  return pkgUp.sync({ cwd: dirname(module.parent!.filename) });
}

export = function handleErrors({
  showStackTrace = true,
  onError,
}: Option = {}) {
  const pkgPath = getModulePackagePath();
  if (!pkgPath) throw new Error('Could not find package.json for the module.');
  const pkg = readJSON(pkgPath);

  function handleError(err: Error, ...rest: any[]): void {
    const reporterURL = pkg?.bugs?.url ?? pkg?.homepage ?? pkg?.author;
    let errorID: string | undefined = undefined;

    if (onError) {
      errorID = onError(err, ...rest);
    }

    console.log(chalk.red.inverse(` ${err.name} `), chalk.red(err.message));

    if (showStackTrace && err.stack) {
      console.log('\n' + chalk.gray(err.stack));
    }

    if (reporterURL) {
      console.log(
        `\nIf you think this is a bug, please report at ${link(
          chalk.yellow(reporterURL),
          reporterURL,
          { fallback: false },
        )}${errorID ? ` with event id ${chalk.bold.magenta(errorID)}` : ''}.`,
      );
    }
    // process.exit(1);
  }

  process.on('unhandledRejection', handleError);
  process.on('uncaughtException', handleError);
};
