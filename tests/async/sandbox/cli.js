const { epicfail } = require("epicfail");

epicfail(require.main.filename);

new Promise((_, reject) => reject("Woops"));
