const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  // Note: 
  // Chrome MV3 no longer allowed remote hosted code
  // Using module bundlers we can add the required code for your extension
  // Any modular script should be added as entry point
  entry: {
    firebase_config: './src/scripts/firebase.js',
    service_worker: './src/scripts/service-worker.js',
    popupStartProject: './src/popup/popupStartProject.js',
    popupStopProject: './src/popup/popupStopProject.js',
    popup: './src/popup/popup.js'
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"] // This is script from entry point
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "popupStartProject.html"),
      filename: "popupStartProject.html",
      chunks: ["popupStartProject"] // This is script from entry point
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "popupStopProject.html"),
      filename: "popupStopProject.html",
      chunks: ["popupStopProject"] // This is script from entry point
    }),
    // Note: you can add as many new HtmlWebpackPlugin objects  
    // filename: being the html filename
    // chunks: being the script src
    // if the script src is modular then add it as the entry point above
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "src", "options", "options.html"),
    //   filename: "options.html",
    //   chunks: ["options"] // This is script from entry point
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "src", "popup", "main.html"),
    //   filename: "main.html",
    //   chunks: ["main_script"] // This is script from entry point
    // }),
    // Note: This is to copy any remaining files to bundler
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/scripts/*' },
        { from: './manifest.json' },
        { from: './src/logo/*' },
        { from: './src/css/*'}
        // { from: './src/html/*'}
      ],
    }),
  ],
  output: {
    // chrome load uppacked extension looks for files under dist/* folder
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
};
