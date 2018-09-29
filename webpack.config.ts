import { CheckerPlugin } from "awesome-typescript-loader";
import HtmlWebpackPlugin from "html-webpack-plugin"; // tslint:disable-line:import-name
import path from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import webpack from "webpack";

const config: webpack.Configuration = {
  devtool: "eval-source-map",
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              babelCore: "@babel/core",
              babelOptions: {
                babelrc: false,
                presets: [
                  [
                    "@babel/preset-env",
                    { targets: "> 0.25%, not dead", useBuiltIns: "usage" },
                  ],
                ],
              },
              useBabel: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new CheckerPlugin(), new HtmlWebpackPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
};

export default config;
