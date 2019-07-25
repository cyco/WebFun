import "../helpers/index.ts";

var testsContext = require.context("../acceptance/", true, /\.test.ts$/);
testsContext.keys().forEach(testsContext);
