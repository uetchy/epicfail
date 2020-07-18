import chalk from 'chalk';
import link from 'terminal-link';
import { readJSON, getModulePackagePath } from './json';
import { EnvInfo, genEnv } from './envinfo';
import { Stash, title } from './term';
import { findIssues, guessRepo } from './github';

interface Option {
  showStackTrace?: boolean;
  showRelatedIssues?: boolean;
  envinfo?: Partial<EnvInfo>;
  onError?: (err: Error, ...rest: any[]) => undefined | string;
}

module.exports = function handleErrors({
  showStackTrace = true,
  showRelatedIssues = false,
  envinfo = {},
  onError,
}: Option = {}) {
  const pkgPath = getModulePackagePath(module.parent!.filename);
  if (!pkgPath) throw new Error('Could not find package.json for the module.');

  const handleError = async (err: Error, ...rest: any[]): Promise<void> => {
    const pkg = readJSON(pkgPath);
    const stash = new Stash();
    const reporterURL =
      pkg?.bugs?.url ?? pkg?.bugs ?? pkg?.homepage ?? pkg?.author;
    const repo = guessRepo(reporterURL);
    const eventID = onError ? onError(err, ...rest) : undefined;

    // show error message
    stash.push(title(chalk.red, err.name, err.message));

    // show stack trace
    if (showStackTrace && err.stack) {
      stash.push(
        '\n' +
          chalk.gray('```\n') +
          chalk.gray(err.stack) +
          chalk.gray('\n```'),
      );
    }

    // show additional env info
    stash.push(await genEnv(envinfo, pkg));

    // search related issues
    if (showRelatedIssues && repo) {
      const issues = await findIssues(err.message, repo);
      if (issues && issues.length > 0) {
        stash.push('\n' + title(chalk.white, 'Issues'));
        stash.push(
          issues
            .map(
              (issue: any) =>
                `${chalk.green(`#${issue.number}`)} ${issue.title}`,
            )
            .join('\n'),
        );
      }
    }

    // guide to bug tracker
    if (reporterURL) {
      stash.push(
        `\nIf you think this is a bug, please report at ${link(
          chalk.yellow(reporterURL),
          reporterURL,
          { fallback: false },
        )} along with the information above${
          eventID ? ` and event id ${chalk.bold.magenta(eventID)}` : ''
        }.`,
      );
    }

    console.log(stash.toString());
  };

  process.on('unhandledRejection', handleError);
  process.on('uncaughtException', handleError);
};
