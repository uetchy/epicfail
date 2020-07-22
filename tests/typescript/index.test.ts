import strip from 'strip-ansi';
import execa from 'execa';
import { join } from 'path';

let res: execa.ExecaReturnValue;

describe('typescript', () => {
  beforeAll(async () => {
    const runnable = join(__dirname, 'cli.ts');
    res = await execa('ts-node', [runnable]);
  });

  it('error', () => {
    expect(strip(res.stdout)).toBe(`Expected!`);
  });
});
