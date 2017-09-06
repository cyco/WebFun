const Path = require("path");
const Webpack = require("webpack");
const NodeExternals = require("webpack-node-externals");

const Paths = require("./paths");

module.exports = {
	externals: [ NodeExternals() ],
	resolve: {
		extensions: [ ".js", ".ts" ],
		alias: {
			"src": Paths.sourceRoot,
			"std": Path.resolve(Paths.sourceRoot, "std"),
			"std.dom": Path.resolve(Paths.sourceRoot, "std.dom"),
			"std.webgl": Path.resolve(Paths.sourceRoot, "std.webgl"),
			"libs": Path.resolve(Paths.sourceRoot, "libs"),
			"test-helpers": Path.resolve(Paths.projectRoot, "test/helpers"),
			"fs": Path.resolve(Paths.projectRoot, "test/helpers/polyfill/fs.js"),
			"path": Path.resolve(Paths.projectRoot, "test/helpers/polyfill/path.js"),
			// disable zlib (imported from KaitaiStream)
			"zlib": Path.resolve(Paths.sourceRoot, "util/empty.js")
		},
		unsafeCache: true
	},
	module: {
		rules: [ {
			/* JavaScript / Babel */
			test: /\.js$/,
			loader: "babel-loader",
			exclude: [ "node_modules" ]
		}, {
			/* TypeScript */
			test: /\.ts$/,
			loader: "awesome-typescript-loader",
			exclude: [ "node_modules" ],
			options: { configFileName: "./config/tsconfig.json" }
		}, {
			/* Styles */
			test: /\.scss$/,
			use: [ {
				loader: "style-loader"
			}, {
				loader: "css-loader"
			}, {
				loader: "sass-loader",
				options: {
					includePaths: [ "./src/_style", "./" ]
				}
			} ],
			exclude: [ "node_modules" ]
		}, {
			/* Shader */
			test: /\.glsl?$/,
			loader: "webpack-glsl-loader"
		}, {
			/* Kaitai-Struct definitions */
			test: /\.ksy$/,
			loader: "kaitai-struct-loader"
		}, {
			/** fonts **/
			test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: "url-loader?limit=10000&mimetype=application/font-woff"
		}, { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	},
	cache: true,
	devtool: "inline-source-map",
	devServer: {
		publicPath: "/",
		contentBase: Path.resolve(Paths.projectRoot, "build"),
		hot: false
	}
};
