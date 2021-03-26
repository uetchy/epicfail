import chalk from 'chalk';
import link from 'terminal-link';
import { EnvInfo, genEnv } from './envinfo';
import { findIssues, guessRepo, linkToNewIssue } from './github';
import { getModulePackagePath, readJSON } from './json';
import { makeTitle, Stash } from './term';

export type EventID = string;

type MaybePromise<T> = T | Promise<T>;

export interface EpicfailOption {
  name?: string;
  message?: boolean;
  stacktrace?: boolean;
  issues?: boolean;
  env?: Partial<EnvInfo> | false;
  onError?: (err: Error, ...rest: any[]) => EventID | undefined;
  assertExpected?: (err: Error) => MaybePromise<boolean>;
}

export class EpicfailError extends Error {
  epicfail?: EpicfailOption;

  constructor(message?: string, option: EpicfailOption = {}) {
    super(message);

    if (option.name) this.name = option.name;

    this.epicfail = option;
  }
}

export function fail(
  message?: Error | string,
  Option: EpicfailOption = {}
): never {
  throw new EpicfailError(
    message instanceof Error ? message.message : message,
    Option
  );
}

export function logAndExit(
  message?: Error | string,
  option: EpicfailOption = {}
): never {
  fail(message, {
    ...{ stacktrace: false, message: false, env: false },
    ...option,
  });
}

export default function handleErrors(cliFlags: EpicfailOption = {}) {
  const parent = require.main || module.parent;
  if (!parent) {
    // couldn't handle errors
    return;
  }

  const pkgPath = getModulePackagePath(parent.filename);
  if (!pkgPath) throw new Error('Could not find package.json for the module.');

  const handleError = async (
    err: EpicfailError,
    ...rest: any[]
  ): Promise<void> => {
    // handle error
    if (!(err instanceof Error)) {
      err = new Error(JSON.stringify(err, null, 2));
    }

    const {
      stacktrace = true,
      issues = false,
      message = true,
      env,
      onError,
      assertExpected = () => false,
    } = { ...cliFlags, ...(err.epicfail ?? {}) };

    if (await Promise.resolve(assertExpected(err))) {
      return logAndExit(err);
    }

    const stash = new Stash();
    const pkg = readJSON(pkgPath);
    const reporterURL =
      pkg?.bugs?.url ??
      pkg?.bugs?.email ??
      pkg?.bugs ??
      pkg?.homepage ??
      pkg?.author;
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
    if (message && reporterURL) {
      stash.push(renderBugTracker(reporterURL, stash, repo, eventID));
    }

    stash.render();
  };

  process.on('unhandledRejection', handleError);
  process.on('uncaughtException', async (...args) => {
    await handleError(...args);
    process.exit(0);
  });
}

function renderError(err: Error) {
  const title = err.name;
  return (
    (title !== 'Error' ? makeTitle(chalk.red, title) + '\n' : '') +
    chalk.red(err.message)
  );
}

function renderStacktrace(stack: string) {
  return chalk.gray(`
\`\`\`
${stack}
\`\`\``);
}

async function renderEnv(
  env: Partial<EnvInfo> | undefined,
  pkg: any
): Promise<string> {
  return '\n' + (await genEnv(env, pkg));
}

async function renderIssues(message: string, repo: string) {
  const issues = await findIssues(message, repo);
  let res = [];
  if (issues && issues.length > 0) {
    res.push('\n' + makeTitle(chalk.white, 'Issues'));
    res.push(
      issues
        .map(
          (issue: any) => `${chalk.green(`#${issue.number}`)} ${issue.title}`
        )
        .join('\n')
    );
  }
  return res.join('\n') || undefined;
}

function renderBugTracker(
  reporterURL: string,
  stash: Stash,
  repo: string | undefined,
  eventID: string | undefined
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
    { fallback: false }
  )} along with the information above${
    eventID ? ` and event id ${chalk.bold.magenta(eventID)}` : ''
  }.`;
}
