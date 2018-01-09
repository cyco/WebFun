const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");

const BaseConfig = require("./webpack.base");
BaseConfig.entry = Path.resolve(Paths.sourceRoot, "index.ts");
BaseConfig.output = {
	filename: "webfun.js",
	path: Paths.buildRoot
};
BaseConfig.devServer = {
	publicPath: "/",
	contentBase: Paths.buildRoot,
	hot: true,
	stats: "none"
};

BaseConfig.plugins.push(new Webpack.NamedModulesPlugin());
BaseConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());
module.exports = BaseConfig;
