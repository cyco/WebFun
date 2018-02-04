const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	entry: Path.resolve(Paths.sourceRoot, "index.ts"),
	devtool: "inline-source-map",
	output: {
		filename: "webfun.js",
		path: Paths.buildRoot
	},
	devServer: {
		publicPath: "/",
		contentBase: Paths.buildRoot,
		hot: true,
		stats: "errors-only"
	},

	plugins: [new Webpack.NamedModulesPlugin(), new Webpack.HotModuleReplacementPlugin()]
});
