const { epicfail } = require("epicfail");
const fs = require("fs");

epicfail(require.main.filename);

fs.readFileSync("foo");
