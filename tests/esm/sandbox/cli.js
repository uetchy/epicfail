import { epicfail } from "epicfail";
import fs from "node:fs";

epicfail(import.meta.url);

fs.readFileSync("foo");
