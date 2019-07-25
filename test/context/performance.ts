import "../helpers/index.ts";

var testsContext = require.context("../performance/", true, /\.test\.ts$/);
testsContext.keys().forEach(testsContext);
