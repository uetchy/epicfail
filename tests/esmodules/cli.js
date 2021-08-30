import { epicfail, logAndExit } from "epicfail";
import fs from "node:fs";

epicfail();

fs.readFileSync("foo");
