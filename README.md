<h1 align="center">epicfail</h1>
<p align="center">Better error reporting for Node.js command-line apps.</p>
<img  align="center" src="https://raw.githubusercontent.com/uetchy/epicfail/master/docs/top.png" />

## Features

[![npm-version]][npm-url]
[![npm-downloads]][npm-url]
![npm bundle size](https://img.shields.io/bundlephobia/minzip/epicfail)
[![Actions Status: test](https://github.com/uetchy/epicfail/workflows/test/badge.svg)](https://github.com/uetchy/epicfail/actions?query=test)

[npm-version]: https://badgen.net/npm/v/epicfail
[npm-downloads]: https://badgen.net/npm/dt/epicfail
[npm-url]: https://npmjs.org/package/epicfail

> epicfail handles `unhandledRejection` and `uncaughtException` with graceful error message.

1. ⬇️ GitHub Issues-ready Markdown output
1. 🌐 Show bug tracker URL (`bugs.url` in `package.json`)
1. 🍁 Show environments (OS, Node.js version, etc)
1. 👀 Suggest related issues in GitHub
1. 🛠 Integration with external error logging services

## Install

```bash
npm install --save epicfail
# or
yarn add epicfail
```

## Use

```js
import epicfail from 'epicfail';

epicfail();

// your CLI app code goes here
fs.readFileSync('foo'); // => will cause "ENOENT: no such file or directory, open 'foo'"
```

![With stacktrace](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/full.png)

## Options

### stacktrace (default: `true`)

Show stack trace.

```js
import epicfail from 'epicfail';

epicfail({
  stacktrace: false,
});
```

![Without stacktrace](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/without-stacktrace.png)

### issues (default: `false`)

Search and show related issues.

```js
import epicfail from 'epicfail';

epicfail({
  issues: true,
});
```

![With issues](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-issues.png)

### env

Show environment information. You can find all possible options [here](https://github.com/tabrindle/envinfo#cli-usage). Set to `false` to disable it.

```js
import epicfail from 'epicfail';

epicfail({
  env: {
    System: ['OS', 'CPU'],
    Binaries: ['Node', 'Yarn', 'npm'],
    Utilities: ['Git'],
  },
});
```

Default values:

```json
{
  "System": ["OS"],
  "Binaries": ["Node"]
}
```

![With envinfo](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-envinfo.png)

### message (default: `true`)

Show bug tracker URL.

```js
import epicfail from 'epicfail';

epicfail({ message: false });
```

## Advanced Usage

### Sentry integration

```js
import epicfail from 'epicfail';
import Sentry from '@sentry/node';

epicfail({
  stacktrace: false,
  env: false,
  onError: Sentry.captureException, // will returns event_id issued by Sentry
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  defaultIntegrations: false,
});

// your CLI app code goes here
fs.readFileSync('foo'); // => will cause "ENOENT: no such file or directory, open 'foo'"
```

![Sentry integration](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-sentry.png)

### Runtime options

```js
import epicfail from 'epicfail';

epicfail();

const expected = new Error('Wooops');
expected.epicfail = { stacktrace: false, env: false, message: false };

throw expected;
```
