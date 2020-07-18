# epicfail

Better error output for Node.js CLI apps.

## Install

```bash
npm install --save epicfail
# or
yarn add epicfail
```

## Use

```js
import injectErrorHandler from 'epicfail';

injectErrorHandler();

// your CLI app code goes here
fs.readFileSync('foo'); // => will cause "ENOENT: no such file or directory, open 'foo'"
```
