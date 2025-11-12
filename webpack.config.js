const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.html'
    })
  ]
};
