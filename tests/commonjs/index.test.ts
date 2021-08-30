import execa from "execa";
import { join } from "path";

let res: execa.ExecaReturnValue;

describe("simple", () => {
  beforeAll(async () => {
    const runnable = join(__dirname, "cli.js");
    res = await execa("node", ["-r", "esm", runnable]);
  });

  it("error", () => {
    expect(res.stdout).toContain("foo");
  });

  it("env", () => {
    expect(res.stdout).toContain("test: 1.0.0");
  });

  it("reporter", () => {
    expect(res.stdout).toContain("https://github.com/uetchy/simple/issues");
  });
});
