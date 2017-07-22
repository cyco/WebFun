require('../helpers/index.js');

var testsContext = require.context("../../src/", true, /\.test.js$/);
testsContext.keys().forEach(testsContext);
