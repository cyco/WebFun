import '../../src/extension';
import './matchers';

var testsContext = require.context("../../src/", true, /\.test.js$/);
testsContext.keys().forEach(testsContext);
