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

> **epicfail** converts `unhandledRejection` and `uncaughtException` into graceful and helpful error message for both users and developers.

⬇️ Prints error messages in _copy and paste ready_ Markdown.  
🌐 Asks users to report a bug (navigate users to `bugs.url` in `package.json`).  
🍁 Shows machine environments (OS, Node.js version, etc).  
👀 Suggests related issues in GitHub.  
🛠 Integration with error aggregation service (like Sentry).

## Table of Contents

<!-- START mdmod {use: 'toc'} -->


- [epicfail](#epicfail)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Use](#use)
    - [ESModules](#esmodules)
    - [CommonJS](#commonjs)
  - [Options](#options)
    - [stacktrace (default: `true`)](#stacktrace-default-true)
    - [issues (default: `false`)](#issues-default-false)
    - [env](#env)
    - [message (default: `true`)](#message-default-true)
    - [assertExpected (default: `() => false`)](#assertexpected-default---false)
    - [onError (default: `undefined`)](#onerror-default-undefined)
  - [Advanced Usage](#advanced-usage)
    - [Print error message without extra information](#print-error-message-without-extra-information)
    - [Sentry integration](#sentry-integration)
    - [Runtime options](#runtime-options)

<!-- END mdmod -->

## Install

```bash
npm install --save epicfail
# or
yarn add epicfail
```

## Use

### ESModules

```js
import { epicfail } from "epicfail";

epicfail(import.meta.url);

// your CLI app code goes here
fs.readFileSync("foo"); // => will cause "ENOENT: no such file or directory, open 'foo'"
```

### CommonJS

```js
const { epicfail } = require("epicfail");

epicfail(require.main.filename);

// your CLI app code goes here
fs.readFileSync("foo"); // => will cause "ENOENT: no such file or directory, open 'foo'"
```

![With stacktrace](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/full.png)

## Options

### stacktrace (default: `true`)

Show stack trace.

```js
import { epicfail } from "epicfail";

epicfail(import.meta.url, {
  stacktrace: false,
});
```

![Without stacktrace](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/without-stacktrace.png)

### issues (default: `false`)

Search and show related issues in GitHub Issues.

```js
import { epicfail } from "epicfail";

epicfail(import.meta.url, {
  issues: true,
});
```

![With issues](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-issues.png)

### env

Show environment information. You can find all possible options [here](https://github.com/tabrindle/envinfo#cli-usage). Set to `false` to disable it.

```js
import { epicfail } from "epicfail";

epicfail(import.meta.url, {
  env: {
    System: ["OS", "CPU"],
    Binaries: ["Node", "Yarn", "npm"],
    Utilities: ["Git"],
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

Show bug tracker URL and ask users to report the error.

```js
import { epicfail } from "epicfail";

epicfail(import.meta.url, { message: false });
```

### assertExpected (default: `() => false`)

While processing an error, if `assertExpected(error)` returns `true`, epicfail just prints the error message without any extra information; which is the same behaviour as the `logAndExit()` function described below.

```js
import { epicfail } from "epicfail";

epicfail(import.meta.url, {
  assertExpected: (err) => err.name === "ArgumentError",
});
```

### onError (default: `undefined`)

Pass the function that process the error and returns event id issued by external error aggregation service.

```js
import { epicfail } from "epicfail";
import Sentry from "@sentry/node";

epicfail(import.meta.url, {
  onError: (err) => Sentry.captureException(err), // will returns an event id issued by Sentry
});
```

## Advanced Usage

### Print error message without extra information

Use `logAndExit()` to print error message in red text without any extra information (stack trace, environments, etc), then quit program. It is useful when you just want to show the expected error message without messing STDOUT around with verbose log messages.

```js
import { epicfail, logAndExit } from "epicfail";

epicfail(import.meta.url);

function cli(args) {
  if (args.length === 0) {
    logAndExit("usage: myapp <input>");
  }
}

cli(process.argv.slice(2));
```

You can also pass an Error instance:

```js
function cli(args) {
  try {
    someFunction();
  } catch (err) {
    logAndExit(err);
  }
}
```

### Sentry integration

```js
import { epicfail } from "epicfail";
import Sentry from "@sentry/node";

epicfail(import.meta.url, {
  stacktrace: false,
  env: false,
  onError: Sentry.captureException, // will returns event_id issued by Sentry
});

Sentry.init({
  dsn: "<your sentry token here>",
  defaultIntegrations: false, // required
});

// your CLI app code goes here
fs.readFileSync("foo"); // => will cause "ENOENT: no such file or directory, open 'foo'"
```

![Sentry integration](https://raw.githubusercontent.com/uetchy/epicfail/master/docs/with-sentry.png)

### Runtime options

```js
import {epicfail} from 'epicfail';

epicfail(import.meta.url);

// 1. Use epicfail property in Error instance.
const expected = new Error('Wooops');
expected.epicfail = { stacktrace: false, env: false, message: false };
throw expected;

// 2. Use fail method
import { fail } from 'epicfail';
fail('Wooops', { stacktrace: false, env: false, message: false });

// 3. Use EpicfailError class (useful in TypeScript)
import { EpicfailError } from 'epicfail';
const err = new EpicfailError('Wooops', { stacktrace: false, env: false, message: false };);
throw err;
```
