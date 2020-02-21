const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {

    entry: [ './src/js/index.js'  ],

    output: {
      path: __dirname,
      publicPath: '/',
      filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: "/"
    },

    module: {
        rules: [
           {
                test: /\.m?js$/,
                exclude: /node_modules/
            }
        ]
    }
};
