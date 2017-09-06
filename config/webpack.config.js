const Path = require("path");

const projectRoot = Path.resolve(__dirname, '../');
const sourceRoot = Path.resolve(projectRoot, "src");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "webfun.js",
		path: Path.resolve(projectRoot, "build")
	},
	resolve: {
		extensions: [ ".js", ".ts" ],
		alias: {
			"src": sourceRoot,
			"std": Path.resolve(sourceRoot, "std"),
			"std.dom": Path.resolve(sourceRoot, "std.dom"),
			"std.webgl": Path.resolve(sourceRoot, "std.webgl"),
			"libs": Path.resolve(sourceRoot, "libs"),
			"test-helpers": Path.resolve(projectRoot, "test/helpers"),
			"fs": Path.resolve(projectRoot, "test/helpers/polyfill/fs.js"),
			"path": Path.resolve(projectRoot, "test/helpers/polyfill/path.js"),
			// disable zlib (imported from KaitaiStream)
			"zlib": Path.resolve(sourceRoot, "util/empty.js")
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
		contentBase: Path.resolve(projectRoot, "build"),
		hot: false
	}
};
