const Path = require("path");

const projectRoot = Path.resolve(__dirname, "../");
const sourceRoot = Path.resolve(projectRoot, "src");
const testRoot = Path.resolve(projectRoot, "test");
const buildRoot = Path.resolve(projectRoot, "build");
const configRoot = Path.resolve(projectRoot, "config");
const testReportRoot = Path.resolve(testRoot, "reports");
const assetsRoot = Path.resolve(projectRoot, "assets");

module.exports = {
	projectRoot,
	sourceRoot,
	testRoot,
	buildRoot,
	configRoot,
	testReportRoot,
	assetsRoot
};
