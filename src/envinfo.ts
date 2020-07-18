import chalk from 'chalk';
import { run as runEnvinfo } from 'envinfo';
import { title } from './term';

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

export async function genEnv(
  envinfo: Partial<EnvInfo>,
  pkg: any,
): Promise<string> {
  const env = await runEnvinfo(
    {
      ...{
        System: ['OS'],
        Binaries: ['Node'],
      },
      ...envinfo,
    },
    {
      markdown: true,
      showNotFound: true,
    },
  );
  let res = '\n';
  res += title(chalk.green, 'Environment') + '\n';
  res += `## Module\n - ${pkg.name}: ${pkg.version}\n`;
  res += env.trim();
  return res;
}
