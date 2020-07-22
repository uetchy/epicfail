#!/usr/bin/env node -r esm

import handleErrors from '../..';
import fs from 'fs';

handleErrors();

const err = new Error('Expected!');
err.epicfail = { stacktrace: false, env: false, message: false };

throw err;
