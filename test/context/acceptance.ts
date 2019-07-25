import "../helpers/index.ts";

var testsContext = require.context("../acceptance/", true, /\.test.(js|ts)$/);
testsContext.keys().forEach(testsContext);
