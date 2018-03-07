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
			fs: Path.resolve(Paths.projectRoot, "test/helpers/polyfill/fs.js"),
			path: Path.resolve(Paths.projectRoot, "test/helpers/polyfill/path.js"),
			// disable zlib (imported from KaitaiStream)
			zlib: Path.resolve(Paths.sourceRoot, "util/empty.js")
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
				/* HACK: Uglify can't handle KaitaiStream's backticks */
				test: /KaitaiStream\.js$/,
				loader: "babel-loader"
			},
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
					configFileName: Path.resolve(Paths.configRoot, "tsconfig.json"),
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
				test: /\.ksy$/,
				exclude: /node_modules/,
				loader: "kaitai-struct-loader"
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
