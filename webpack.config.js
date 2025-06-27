import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack from "webpack";
import Dotenv from "dotenv-webpack";


export default (_env, argv) => {
  console.log("Netlify env", process.env.REACT_APP_AWS_REGION, process.env.REACT_APP_AWS_ACCESS_KEY_ID, process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);
  const prod = argv.mode === "production";
  return {
    entry: "./src/index.jsx",
    output: {
      filename: prod ? "bundle.[contenthash].js" : "bundle.js",
      path: path.resolve("dist"),
      publicPath: "/",
      clean: true
    },
    resolve: { extensions: [".js", ".jsx"] },
    devtool: prod ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
      hot: true,
      historyApiFallback: true,
      port: 3000
    },
    module: {
      rules: [
        // JavaScript and JSX
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                ["@babel/preset-react", { runtime: "automatic" }]
              ],
              plugins: [!prod && "react-refresh/babel"].filter(Boolean)
            }
          }
        },
        // Plain CSS
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        },
        // SCSS (optional later)
        {
          test: /\.scss$/i,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        // Images and assets
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset"
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "public/index.html" }),
      !prod && new ReactRefreshWebpackPlugin(),
      !prod && new Dotenv(),
      new webpack.DefinePlugin({
        "process.env.REACT_APP_WEATHER_API_KEY": JSON.stringify(process.env.REACT_APP_WEATHER_API_KEY),
  })
    ].filter(Boolean),
    mode: prod ? "production" : "development",
    performance: { hints: false }
  };
};