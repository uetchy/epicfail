import handleErrors from '../..';

handleErrors();

const err = new Error('Expected!');
err.epicfail = { stacktrace: false, env: false, message: false };

throw err;
