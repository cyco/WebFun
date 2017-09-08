const Path = require("path");

const Paths = require("./paths");
const BaseConfig = require("./webpack.node.js");

const toolName = process.env.TOOL_NAME;
BaseConfig.entry = Path.resolve(Paths.toolsRoot, toolName + ".js");
BaseConfig.output = {
	filename: toolName + ".bin.js",
	path: Paths.toolsRoot
};

module.exports = BaseConfig;
