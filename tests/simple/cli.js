import handleErrors from '../..';
import fs from 'fs';

handleErrors();

fs.readFileSync('foo');
