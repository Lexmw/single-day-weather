import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const prod = process.env.NODE_ENV === 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: './src/index.jsx',
  output: {
    filename: prod ? 'bundle.[contenthash].js' : 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  resolve: { extensions: ['.js', '.jsx'] },
  devtool: prod ? 'source-map' : 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 3000,
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: [!prod && 'react-refresh/babel'].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new DotenvWebpackPlugin(),
    new HtmlWebpackPlugin({ template: 'public/index.html' }),
    !prod && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  mode: prod ? 'production' : 'development',
  performance: { hints: false },
};
