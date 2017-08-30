require("../helpers/index.js");

var testsContext = require.context("../unit/", true, /\.test.(js|ts)$/);
testsContext.keys().forEach(testsContext);
