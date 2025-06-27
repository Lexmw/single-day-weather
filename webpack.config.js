import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import path from 'path';

const prod = process.env.NODE_ENV === 'production';

export default {
  entry: "./src/index.jsx",
  output: {
    filename: prod ? "bundle.[contenthash].js" : "bundle.js",
    path: path.resolve("dist"),
    publicPath: "/",
    clean: true,
  },
  resolve: { extensions: [".js", ".jsx"] },
  devtool: prod ? "source-map" : "eval-cheap-module-source-map",
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            // Only use react-refresh in dev
            plugins: [!prod && "react-refresh/babel"].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new DotenvWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "public/index.html" }),
    !prod && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  mode: prod ? "production" : "development",
  performance: { hints: false },
};
