const { epicfail } = require("epicfail");

epicfail(require.main.filename, {
  assertExpected: (err) => err.name === "CACError",
});

const err = new Error("Error!");
err.name = "CACError";

throw err;
