import epicfail from '../..';
import fs from 'fs';

epicfail();

fs.readFileSync('foo');
