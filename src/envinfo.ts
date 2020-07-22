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
  envinfo: Partial<EnvInfo> | undefined,
  pkg: any,
): Promise<string> {
  const env = await runEnvinfo(
    envinfo ?? {
      System: ['OS'],
      Binaries: ['Node'],
    },
    {
      json: true,
      showNotFound: true,
    },
  );

  const res = [];
  res.push(title(chalk.green, 'Environment'));
  res.push(`- ${pkg.name}: ${pkg.version}`);
  res.push(
    Object.entries<any>(JSON.parse(env))
      .reduce(
        (s: any, i: any) => [
          ...s,
          ...Object.entries(i[1]).map(([k, v]) => [`${i[0]} > ${k}`, v]),
        ],
        [],
      )
      .map(([k, v]) => `- ${k}: ${parseEnvInfo(v)}`)
      .join('\n'),
  );
  return chalk.green(res.join('\n'));
}

function parseEnvInfo(v: any): string {
  if (typeof v === 'string') {
    return v;
  } else if (typeof v === 'object' && 'version' in v) {
    return `${v.version}${v.path ? ` - ${v.path}` : ''}`;
  } else if (Array.isArray(v)) {
    return v.join(', ');
  } else {
    return JSON.stringify(v);
  }
}
