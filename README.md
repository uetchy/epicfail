<h1 align="center">epicfail</h1>
<p align="center">Better error output for Node.js CLI apps.</p>
<img  align="center" src="https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-stacktrace.png" />

[![npm-version]][npm-url]
[![npm-downloads]][npm-url]

[npm-version]: https://badgen.net/npm/v/epicfail
[npm-downloads]: https://badgen.net/npm/dt/epicfail
[npm-url]: https://npmjs.org/package/epicfail

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
