const Path = require("path");
const Paths = require("./paths");
const BaseConfig = require("./webpack.node.js");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const toolName = process.env.TOOL_NAME;
BaseConfig.entry = Path.resolve(Paths.toolsRoot, toolName + ".js");
BaseConfig.output = {
	filename: toolName + ".bin.js",
	path: Paths.toolsRootBin
};
const babelLoader = BaseConfig.module.rules.find(({ loader }) => loader === "babel-loader");
if (babelLoader) {
	babelLoader.options = babelLoader.options || {};
	babelLoader.options.plugins = babelLoader.options.plugins || [];
	babelLoader.options.plugins.push("@babel/transform-runtime");
}

const atLoader = BaseConfig.module.rules.find(({ loader }) => loader === "awesome-typescript-loader");
if (atLoader) {
	atLoader.options = atLoader.options || {};
	atLoader.options.babelOptions = atLoader.options.babelOptions || {};
	atLoader.options.babelOptions.plugins = atLoader.options.babelOptions.plugins || [];
	atLoader.options.babelOptions.plugins.push("@babel/transform-runtime");
}

if (+process.env.ci) {
	// skip type checking entirely
	BaseConfig.plugins = BaseConfig.plugins.filter(plugin => !(plugin instanceof ForkTsCheckerWebpackPlugin));
}

module.exports = BaseConfig;
