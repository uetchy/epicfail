import execa from "execa";
import { join } from "path";

let res: execa.ExecaReturnValue;

const sandboxPath = join(__dirname, "sandbox");

describe("runtime", () => {
  jest.setTimeout(1000 * 60);

  beforeAll(async () => {
    await execa("yarn", ["install", "--no-lockfile"], { cwd: sandboxPath });

    const runnable = join(sandboxPath, "cli.js");
    res = await execa("node", [runnable], { cwd: sandboxPath });
  });

  it("error", () => {
    expect(res.stdout).toContain(`Expected!`);
  });
});
