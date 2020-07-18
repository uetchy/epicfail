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
const epicfail = require('epicfail');
const Sentry = require('@sentry/node');

epicfail({
  showStackTrace: false,
  onError: (err) => {
    return Sentry.captureException(err); // will returns event_id issued at Sentry
  },
});

Sentry.init({
  dsn:
    'https://57ccd1e2e28147f8953e2ec07ee117f6@o48152.ingest.sentry.io/5343860',
  defaultIntegrations: false,
});

fs.readFileSync('foo');
```

![Sentry integration](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-sentry.png)
