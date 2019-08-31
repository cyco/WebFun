import "../helpers/index.ts";

const testsContext = require.context("../acceptance/", true, /\.test.ts$/);
testsContext.keys().forEach(testsContext);
