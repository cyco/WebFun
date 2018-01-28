const NodeExternals = require("webpack-node-externals");

const BaseConfig = require("./webpack.base");
BaseConfig.externals = [NodeExternals()];
BaseConfig.target = "node";

module.exports = BaseConfig;
