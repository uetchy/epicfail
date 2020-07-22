import strip from 'strip-ansi';
import execa from 'execa';
import { join } from 'path';

let res: execa.ExecaReturnValue;

describe('runtime', () => {
  beforeAll(async () => {
    const runnable = join(__dirname, 'cli.js');
    res = await execa('node', ['-r', 'esm', runnable]);
  });

  it('error', () => {
    expect(strip(res.stdout)).toBe(`# Expected!`);
  });
});
