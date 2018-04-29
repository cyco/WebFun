const Path = require("path");
const Paths = require("./paths");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".jsx"],
		alias: {
			src: Paths.sourceRoot,
			std: Path.resolve(Paths.sourceRoot, "std"),
			"std.dom": Path.resolve(Paths.sourceRoot, "std.dom"),
			"std.math": Path.resolve(Paths.sourceRoot, "std.math"),
			"std.webgl": Path.resolve(Paths.sourceRoot, "std.webgl"),
			libs: Path.resolve(Paths.sourceRoot, "libs"),
			"test-helpers": Path.resolve(Paths.projectRoot, "test/helpers"),
			"test-fixtures": Path.resolve(Paths.projectRoot, "test/fixtures"),
			fs: Path.resolve(Paths.projectRoot, "test/helpers/polyfill/fs.js"),
			path: Path.resolve(Paths.projectRoot, "test/helpers/polyfill/path.js")
		},
		unsafeCache: true
	},
	mode: "development",
	cache: true,
	stats: "errors-only",
	plugins: [],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "awesome-typescript-loader",
				options: {
					configFileName: Path.resolve(Paths.projectRoot, "tsconfig.json"),
					silent: true,
					babelCore: "@babel/core"
				}
			},
			{
				test: /\.glsl?$/,
				loader: "webpack-glsl-loader",
				exclude: /node_modules/
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				exclude: /node_modules/,
				loader: "url-loader",
				options: {
					limit: 10000,
					mimetype: "application/font-woff"
				}
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				exclude: /node_modules/,
				loader: "file-loader"
			}
		]
	}
};
