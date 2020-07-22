import handleErrors, { EpicfailError } from '../..';

handleErrors();

const err = new EpicfailError('Expected!');
err.epicfail = { stacktrace: false, env: false, message: false };

throw err;
