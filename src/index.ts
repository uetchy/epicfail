import chalk from 'chalk';
import link from 'terminal-link';
import { readJSON, getModulePackagePath } from './json';
import { EnvInfo, genEnv } from './envinfo';
import { Stash, title } from './term';
import { findIssues, guessRepo, linkToNewIssue } from './github';

interface Option {
  stacktrace?: boolean;
  env?: Partial<EnvInfo> | false;
  issues?: boolean;
  onError?: (err: Error, ...rest: any[]) => undefined | string;
}

function renderError(err: Error) {
  return [title(chalk.red, err.name), chalk.red(err.message)].join('\n');
}

function renderStacktrace(stack: string) {
  return chalk.gray(`
\`\`\`
${stack}
\`\`\``);
}

async function renderEnv(
  env: Partial<EnvInfo> | undefined,
  pkg: any,
): Promise<string> {
  return '\n' + (await genEnv(env, pkg));
}

async function renderIssues(message: string, repo: string) {
  const issues = await findIssues(message, repo);
  let res = [];
  if (issues && issues.length > 0) {
    res.push('\n' + title(chalk.white, 'Issues'));
    res.push(
      issues
        .map(
          (issue: any) => `${chalk.green(`#${issue.number}`)} ${issue.title}`,
        )
        .join('\n'),
    );
  }
  return res.join('\n') || undefined;
}

function renderBugTracker(
  reporterURL: string,
  stash: Stash,
  repo: string | undefined,
  eventID: string | undefined,
): string {
  let detailedURL = reporterURL;
  if (repo) {
    let link = linkToNewIssue(repo, stash.toString());
    if (link.length > 2000)
      link = linkToNewIssue(repo, stash.toString({ extra: false }));
    detailedURL = link;
  }

  return `\nIf you think this is a bug, please report at ${link(
    chalk.yellow(reporterURL),
    detailedURL,
    { fallback: false },
  )} along with the information above${
    eventID ? ` and event id ${chalk.bold.magenta(eventID)}` : ''
  }.`;
}

export = function handleErrors({
  stacktrace = true,
  issues = false,
  env,
  onError,
}: Option = {}) {
  const pkgPath = getModulePackagePath(module.parent!.filename);
  if (!pkgPath) throw new Error('Could not find package.json for the module.');

  const handleError = async (err: Error, ...rest: any[]): Promise<void> => {
    if (!(err instanceof Error)) {
      err = new Error(JSON.stringify(err, null, 2));
    }

    const pkg = readJSON(pkgPath);
    const stash = new Stash();
    const reporterURL =
      pkg?.bugs?.url ?? pkg?.bugs ?? pkg?.homepage ?? pkg?.author;
    const repo = guessRepo(reporterURL);
    const eventID = onError ? onError(err, ...rest) : undefined;

    // show error message
    stash.push(renderError(err));

    // show stack trace
    if (stacktrace && err.stack) {
      stash.push(renderStacktrace(err.stack), { extra: true });
    }

    // show additional env info
    if (env !== false) {
      stash.push(await renderEnv(env, pkg));
    }

    // search related issues
    if (issues && repo) {
      const res = await renderIssues(err.message, repo);
      if (res) stash.push(res);
    }

    // guide to bug tracker
    if (reporterURL) {
      stash.push(renderBugTracker(reporterURL, stash, repo, eventID));
    }

    stash.render();
  };

  process.on('unhandledRejection', handleError);
  process.on('uncaughtException', handleError);
};
