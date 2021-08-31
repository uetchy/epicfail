import { epicfail, logAndExit } from "epicfail";

epicfail(require.main.filename);

logAndExit("Test");
