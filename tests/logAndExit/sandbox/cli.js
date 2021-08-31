const { epicfail, logAndExit } = require("epicfail");

epicfail(require.main.filename);

logAndExit("nailed", { name: "NiceError" });
