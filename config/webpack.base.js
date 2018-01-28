const Path = require("path");
const Paths = require("./paths");

module.exports = {
	resolve: {
		extensions: [".js", ".ts"],
		alias: {
			src: Paths.sourceRoot,
			std: Path.resolve(Paths.sourceRoot, "std"),
			"std.dom": Path.resolve(Paths.sourceRoot, "std.dom"),
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
	cache: true,
	devtool: "inline-source-map",
	plugins: [],
	module: {
		rules: [
			{
				/* JavaScript / Babel */
				test: /\.js$/,
				loader: "babel-loader",
				exclude: ["node_modules"]
			},
			{
				/* TypeScript */
				test: /\.ts$/,
				loader: "awesome-typescript-loader",
				exclude: ["node_modules"],
				options: {
					configFileName: Path.resolve(Paths.configRoot, "tsconfig.json"),
					silent: true,
					babelCore: "@babel/core"
				}
			},
			{
				/* Styles */
				test: /\.scss$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							minimize: true
						}
					},
					{
						loader: "sass-loader",
						options: {
							includePaths: [Path.resolve(Paths.sourceRoot, "_style"), "./"]
						}
					}
				],
				exclude: ["node_modules"]
			},
			{
				/* Shader */
				test: /\.glsl?$/,
				loader: "webpack-glsl-loader",
				exclude: ["node_modules"]
			},
			{
				/* Kaitai-Struct definitions */
				test: /\.ksy$/,
				loader: "kaitai-struct-loader",
				exclude: ["node_modules"]
			},
			{
				/** fonts **/
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					mimetype: "application/font-woff"
				},
				exclude: ["node_modules"]
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader",
				exclude: ["node_modules"]
			}
		]
	},
	stats: "errors-only"
};
