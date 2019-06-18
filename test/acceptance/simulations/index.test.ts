declare var require: any;
import run from "test/helpers/gameplay/test-runner";

var testFiles = require.context("./", false, /\.wftest$/);

fdescribe("WebFun.Simulation", () => {
	testFiles.keys().forEach((key: string) => {
		run(key, testFiles(key).default);
	});
});
