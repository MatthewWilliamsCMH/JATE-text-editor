const HtmlWebpackPlugin = require('html-webpack-plugin'); //loads the plugin that will rebuild an HTML file with the Webpack bundles
const WebpackPwaManifest = require('webpack-pwa-manifest'); //loads the plugin that will generate the manifest for the PWA
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin'); //injects a service worker in to the build

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development', //sets Webpack to development mode; if this is changed to "production", the files in the dist folder will be minified and undiagnosable
    entry: { //specifies the entry points (kind of like scripts in package.json) for the app. What does this mean, though?
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: { //where the bundle will be output (the 'dist' directory)
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin ({ //this regenerates the HTML that will be packaged in the bundle
        template: './index.html',
        title: 'Jate PWA Text Editor'
      }),
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'service-worker.js'
      }),
      new WebpackPwaManifest({ //generates the manifest.json file required to be a PWA
        name: 'Jate PWA Text Editor',
        short_name: 'Jate',
        description: 'Jate text-editor app',
        background_color: 'rgba(255, 255, 128, .5)',
        theme_color: 'green',
        start_url: './',
        publicPath: './', //what is this?
        icons: [
          {
            src: path.resolve('./src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', icon)
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
                presets: ['@babel.preset-env'],
                plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime']
            }
          }
        }
      ]
    }
  };
};