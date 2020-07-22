import execa from 'execa';
import { join } from 'path';

let res: execa.ExecaReturnValue;

describe('async', () => {
  beforeAll(async () => {
    const runnable = join(__dirname, 'cli.js');
    res = await execa('node', [runnable]);
  });

  it('error', () => {
    expect(res.stdout).toContain('Woops');
  });

  it('env', () => {
    expect(res.stdout).toContain('test: 1.0.0');
  });

  it('reporter', () => {
    expect(res.stdout).toContain(
      'please report at https://github.com/uetchy/simple/issues',
    );
  });
});
