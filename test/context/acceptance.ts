import "../helpers/index.ts";
import "../acceptance/ingame-coverage.test.ts";

const testsContext = require.context("../acceptance/", true, /\.test.ts$/);
testsContext.keys().forEach(testsContext);
