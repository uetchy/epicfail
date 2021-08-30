const { epicfail } = require("epicfail");
const fs = require("fs");

epicfail();

fs.readFileSync("foo");
