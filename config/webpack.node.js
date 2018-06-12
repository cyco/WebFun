const NodeExternals = require("webpack-node-externals");
const BaseConfig = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge(BaseConfig, {
	target: "node",
	externals: [NodeExternals()]
});
