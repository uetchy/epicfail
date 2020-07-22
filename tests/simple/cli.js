#!/usr/bin/env node -r esm

import handleErrors from '../..';
import fs from 'fs';

handleErrors();

fs.readFileSync('foo');
