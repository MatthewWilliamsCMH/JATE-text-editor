const HtmlWebpackPlugin = require('html-webpack-plugin'); //loads the plugin that will rebuild an HTML file with the Webpack bundles
const WebpackPwaManifest = require('webpack-pwa-manifest'); //loads the plugin that will generate the manifest for the PWA
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin'); //injects a service worker in to the build

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development', //sets Webpack to development mode; if this is changed to "production", the files in the dist folder will be minified and undiagnosable
    entry: { //specifies the entry points (kind of like scripts in package.json) for the app
      main: './src/js/index.js',
      install: './src/js/install.js',
    },
    output: { //where the bundle will be output (the 'dist' directory)
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin ({ //regenerates the HTML that will be packaged in the bundle
        template: './index.html',
        title: 'JATE Text Editor'
      }),
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js'
      }),
      new WebpackPwaManifest({ //generates the manifest.json file required to be a PWA
        name: 'JATE Text Editor',
        short_name: 'JATE',
        description: 'JATE text-editor app',
        background_color: 'white',
        start_url: './',
        publicPath: './', //what is this?
        icons: [
          {
            src: path.resolve('./src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('src', 'icons')
          }
        ]
      }),
    ],
    module: { //collects the files to be loaded (or excluded) based regex strings
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader', // babel transpiles JS files allowing browsers that may not support modern JS syntax or features natively
            options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime']
            }
          }
        }
      ]
    }
  };
};