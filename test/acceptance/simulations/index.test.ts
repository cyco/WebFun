declare var require: any;
import run from "test/helpers/gameplay/test-runner";

var testFiles = require.context("./", false, /\.wftest$/);

testFiles.keys().forEach((key: string) => {
	run("Simulation", key, testFiles(key).default);
});
