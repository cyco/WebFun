require("../helpers/index.js");

var testsContext = require.context("../acceptance/", true, /\.test.js$/);
testsContext.keys().forEach(testsContext);
