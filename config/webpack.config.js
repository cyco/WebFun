const Path = require("path");
const Webpack = require("webpack");

const projectRoot = Path.resolve(__dirname, "../");
module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "webfun.js",
		path: Path.resolve(projectRoot, "dist")
	},
	resolve: {
		extensions: [".js", ".ts"],
		alias: {
			"src": Path.resolve(projectRoot, "src"),
			"std": Path.resolve(projectRoot, "src/std"),
			"std.dom": Path.resolve(projectRoot, "src/std.dom"),
			"std.webgl": Path.resolve(projectRoot, "src/std.webgl"),
			"test-helpers": Path.resolve(projectRoot, "test/helpers"),
			"fs": Path.resolve(projectRoot, "test/helpers/polyfill/fs.js"),
			"path": Path.resolve(projectRoot, "test/helpers/polyfill/path.js"),
			"libs": Path.resolve(projectRoot, "src/libs.js"),
			// disable zlib (imported from KaitaiStream)
			"zlib": Path.resolve(projectRoot, "src/util/empty.js")
		},
		unsafeCache: true
	},
	module: {
		rules: [{
			/* JavaScript / Babel */
			test: /\.js?$/,
			loader: "babel-loader",
			include: [
				Path.resolve(projectRoot, "src")
			],
			exclude: [
				"node_modules",
				Path.resolve(projectRoot, "src/editor"),
				Path.resolve(projectRoot, "src/debug")
			]
		}, {
			/* JavaScript / Babel */
			test: /\.js?$/,
			loader: "babel-loader",
			include: [
				Path.resolve(projectRoot, "src/editor"),
				Path.resolve(projectRoot, "src/debug"),
				Path.resolve(projectRoot, "test/helpers")
			]
		}, {
			/* JavaScript / Babel */
			test: /\.tsx?$/,
			loader: "ts-loader",
			include: [
				Path.resolve(projectRoot, "src"),
				Path.resolve(projectRoot, "tools")
			],
			exclude: [
				"node_modules"
			]
		}, {
			/* Styles */
			test: /\.scss$/,
			use: [{
				loader: "style-loader"
			}, {
				loader: "css-loader"
			}, {
				loader: "sass-loader",
				options: {
					includePaths: ["src/_style"]
				}
			}],
			exclude: [
				"node_modules"
			]
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
		}, {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
		]
	},
	cache: true,
	plugins: [],

	devtool: "inline-source-map",
	devServer: {
		publicPath: "/",
		contentBase: "./dist",
		hot: false
	}
};
