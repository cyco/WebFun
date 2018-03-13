import "../helpers/index.js";

var testsContext = require.context("../performance/", true, /\.test.(js|ts)$/);
testsContext.keys().forEach(testsContext);
