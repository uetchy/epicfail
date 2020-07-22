<h1 align="center">epicfail</h1>
<p align="center">Better error reporting for Node.js command-line apps.</p>
<img  align="center" src="https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-stacktrace.png" />

## Features

[![npm-version]][npm-url]
[![npm-downloads]][npm-url]

[npm-version]: https://badgen.net/npm/v/epicfail
[npm-downloads]: https://badgen.net/npm/dt/epicfail
[npm-url]: https://npmjs.org/package/epicfail

> epicfail handles `unhandledRejection` and `uncaughtException` with graceful error message.

- 🌐 Show bug tracker URL (`bugs.url` in `package.json`)
- ⬇️ GitHub Issues-ready error logs (Markdown)
- 👀 Suggest related issues
- 🛠 Integration with external error logging services

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

![With stacktrace](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-stacktrace.png)

## Options

### stacktrace (`default: true`)

Show stack trace.

```js
import epicfail from 'epicfail';

epicfail({
  stacktrace: false,
});
```

![Without stacktrace](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/without-stacktrace.png)

### issues (`default: false`)

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
  envinfo: {
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

## Advanced Usage

### Sentry integration

```js
import epicfail from 'epicfail';
import Sentry from '@sentry/node';

epicfail({
  stacktrace: false,
  onError: Sentry.captureException, // will returns event_id issued at Sentry
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  defaultIntegrations: false,
});

// your CLI app code goes here
fs.readFileSync('foo'); // => will cause "ENOENT: no such file or directory, open 'foo'"
```

![Sentry integration](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-sentry.png)
