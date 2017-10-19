const Path = require("path");

const projectRoot = Path.resolve(__dirname, "../");
const sourceRoot = Path.resolve(projectRoot, "src");
const testRoot = Path.resolve(projectRoot, "test");
const toolsRoot = Path.resolve(projectRoot, "tools");
const toolsRootBin = Path.resolve(toolsRoot, "bin");
const buildRoot = Path.resolve(projectRoot, "build");
const configRoot = Path.resolve(projectRoot, "config");
const coverageRoot = Path.resolve(testRoot, "coverage");

module.exports = {
	projectRoot,
	sourceRoot,
	testRoot,
	toolsRoot,
	toolsRootBin,
	buildRoot,
	configRoot,
	coverageRoot
};
