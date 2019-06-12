import "../helpers/index.ts";

var testsContext = require.context("../performance/", true, /\.test.(js|ts)$/);
testsContext.keys().forEach(testsContext);
