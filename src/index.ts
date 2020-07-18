import { readFileSync } from 'fs';
import { dirname } from 'path';
import pkgUp from 'pkg-up';
import chalk from 'chalk';
import link from 'terminal-link';
import { run as runEnvinfo } from 'envinfo';

export interface EnvInfo {
  System: ('OS' | 'CPU' | 'Memory' | 'Shell')[];
  Binaries: ('Node' | 'Yarn' | 'npm' | 'Watchman')[];
  Managers: (
    | 'Cargo'
    | 'CocoaPods'
    | 'Composer'
    | 'Gradle'
    | 'Homebrew'
    | 'Maven'
    | 'pip2'
    | 'pip3'
    | 'RubyGems'
  )[];
  Utilities: (
    | 'CMake'
    | 'Make'
    | 'GCC'
    | 'Git'
    | 'Mercurial'
    | 'Clang'
    | 'Subversion'
  )[];
  Servers: ('Apache' | 'Nginx')[];
  Virtualization: {
    Docker: string;
    Parallels: string;
    VirtualBox: string;
  };
  SDKs: {
    'iOS SDK': 'Platforms'[];
    'Android SDK': ('API Levels' | 'Build Tools' | 'System Images')[];
  };
  IDEs: (
    | 'Android Studio'
    | 'Atom'
    | 'Emacs'
    | 'Nano'
    | 'VSCode'
    | 'Vim'
    | 'Xcode'
  )[];
  Languages: (
    | 'Bash'
    | 'Elixir'
    | 'Go'
    | 'Java'
    | 'Perl'
    | 'PHP'
    | 'Python'
    | 'Python3'
    | 'R'
    | 'Ruby'
    | 'Rust'
  )[];
  Databases: ('MongoDB' | 'MySQL' | 'PostgreSQL' | 'SQLite')[];
  Browsers: (
    | 'Chrome'
    | 'Chrome Canary'
    | 'Firefox'
    | 'Firefox Developer Edition'
    | 'Firefox Nightly'
    | 'Safari'
    | 'Safari Technology Preview'
  )[];
  npmPackages: string[];
  npmGlobalPackages: string[];
}

function readJSON(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

interface Option {
  showStackTrace?: boolean;
  onError?: (err: Error, ...rest: any[]) => undefined | string;
  envinfo?: Partial<EnvInfo>;
}

function getModulePackagePath() {
  return pkgUp.sync({ cwd: dirname(module.parent!.filename) });
}

module.exports = function handleErrors({
  showStackTrace = true,
  onError,
  envinfo = {},
}: Option = {}) {
  const pkgPath = getModulePackagePath();
  if (!pkgPath) throw new Error('Could not find package.json for the module.');
  const pkg = readJSON(pkgPath);

  async function handleError(err: Error, ...rest: any[]): Promise<void> {
    const reporterURL = pkg?.bugs?.url ?? pkg?.homepage ?? pkg?.author;
    let errorID: string | undefined = undefined;

    if (onError) {
      errorID = onError(err, ...rest);
    }

    // show error message
    console.log(chalk.red.inverse(` ${err.name} `), chalk.red(err.message));

    // show stack trace
    if (showStackTrace && err.stack) {
      console.log('\n' + chalk.gray(err.stack));
    }

    // show additional env info
    const env = await runEnvinfo(
      {
        ...{
          System: ['OS'],
          Binaries: ['Node', 'Yarn', 'npm'],
        },
        ...envinfo,
      },
      {
        markdown: true,
        showNotFound: true,
      },
    );
    console.log(chalk.green('\nEnvironment information'));
    console.log(`## Module\n - ${pkg.name}: ${pkg.version}`);
    console.log(env.trim());

    // guide to bug tracker
    if (reporterURL) {
      console.log(
        `\nIf you think this is a bug, please report at ${link(
          chalk.yellow(reporterURL),
          reporterURL,
          { fallback: false },
        )}${errorID ? ` with event id ${chalk.bold.magenta(errorID)}` : ''}.`,
      );
    }
  }

  process.on('unhandledRejection', handleError);
  process.on('uncaughtException', handleError);
};
