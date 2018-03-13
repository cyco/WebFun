import "../helpers/index.js";

var testsContext = require.context("../acceptance/", true, /\.test.(js|ts)$/);
testsContext.keys().forEach(testsContext);
