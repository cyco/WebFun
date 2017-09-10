var testsContext = require.context("../performance/", true, /\.test.js$/);
testsContext.keys().forEach(testsContext);
