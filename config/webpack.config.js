const Path = require("path");
const Paths = require("./paths");

const BaseConfig = require("./webpack.base");
BaseConfig.entry = Path.resolve(Paths.sourceRoot, "index.ts");
BaseConfig.output = {
	filename: "webfun.js",
	path: Paths.buildRoot
};
BaseConfig.devServer = {
	publicPath: "/",
	contentBase: Paths.buildRoot,
	hot: false
};

module.exports = BaseConfig;
