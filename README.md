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

### showStackTrace (`default: true`)

```js
import epicfail from 'epicfail';

epicfail({
  showStackTrace: false,
});
```

![Without stacktrace](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/without-stacktrace.png)

### showRelatedIssues (`default: false`)

```js
import epicfail from 'epicfail';

epicfail({
  showRelatedIssues: true,
});
```

![With issues](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-issues.png)

### envinfo

Shows environment information on the errors. You can find all possible options [here](https://github.com/tabrindle/envinfo#cli-usage).

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

![With envinfo](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-envinfo.png)

Default values:

```json
{
  "System": ["OS"],
  "Binaries": ["Node"]
}
```

## Advanced Usage

### Sentry integration

```js
import epicfail from 'epicfail';
import Sentry from '@sentry/node';

epicfail({
  showStackTrace: false,
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
