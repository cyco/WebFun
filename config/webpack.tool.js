const Path = require("path");
const Webpack = require("webpack");
const NodeExternals = require("webpack-node-externals");

const Paths = require("./paths");
const BaseConfig = require("./webpack.node.js");

const toolName = process.env.TOOL_NAME;
BaseConfig.entry = Path.resolve(Paths.toolsRoot, toolName + ".js");
BaseConfig.output = {
	filename: toolName + ".bin.js",
	path: Paths.toolsRoot
};

module.exports = BaseConfig;
