#!/usr/bin/env node -r esm

import handleErrors from 'epicfail';
import fs from 'fs';

handleErrors();

fs.readFileSync('foo');
