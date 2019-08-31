declare let require: any;
import run from "test/helpers/gameplay/test-runner";

const testFiles = require.context("./", false, /\.wftest$/);

testFiles.keys().forEach((key: string) => {
	run("Gameplay", key, testFiles(key).default);
});
