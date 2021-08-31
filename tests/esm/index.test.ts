import execa from "execa";
import { join } from "path";

let res: execa.ExecaReturnValue;

const sandboxPath = join(__dirname, "sandbox");

describe("esm", () => {
  jest.setTimeout(1000 * 60);

  beforeAll(async () => {
    await execa("yarn", ["install", "--cwd", sandboxPath]);

    const runnable = join(sandboxPath, "cli.js");
    res = await execa("node", [runnable], { cwd: sandboxPath });
  });

  it("error", () => {
    expect(res.stdout).toContain("foo");
  });

  it("env", () => {
    expect(res.stdout).toContain(`esm: 1.0.0`);
  });

  it("reporter", () => {
    expect(res.stdout).toContain("https://github.com/uetchy/esm/issues");
  });
});
