import run from "test/helpers/gameplay/test-runner";

const testFiles = require.context("./", false, /\.f?wftest$/);
testFiles.keys().forEach((key: string) => {
	run("Simulation", key, testFiles(key).default);
});
