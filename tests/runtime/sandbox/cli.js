const { epicfail } = require("epicfail");

epicfail(require.main.filename);

const err = new Error("Expected!");
err.epicfail = { stacktrace: false, env: false, message: false };

throw err;
