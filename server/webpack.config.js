const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "server.js",
        publicPath: '/',
        path: path.resolve(__dirname, "dist")
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    resolve: {
        extensions: ['.js', '.ts'],
        fallback: {
            async_hooks: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [ 'ts-loader' ],
            }
        ]
    },
    externals: [
        nodeExternals()
    ]
};