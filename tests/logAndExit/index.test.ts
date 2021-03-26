import execa from 'execa';
import { join } from 'path';
import strip from 'strip-ansi';

let res: execa.ExecaReturnValue;

describe('logAndExit', () => {
  beforeAll(async () => {
    const runnable = join(__dirname, 'cli.js');
    res = await execa('node', ['-r', 'esm', runnable]);
  });

  it('with title', () => {
    expect(strip(res.stdout)).toEqual(`# NiceError
nailed`);
  });
});
