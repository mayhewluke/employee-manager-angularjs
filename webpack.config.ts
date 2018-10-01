import { CheckerPlugin } from "awesome-typescript-loader";
import HtmlWebpackPlugin from "html-webpack-plugin"; // tslint:disable-line:import-name
import path from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import webpack from "webpack";

export default (_: any, argv: any) => {
  const { mode } = argv;
  const config: webpack.Configuration = {
    devServer: {
      historyApiFallback: true,
    },
    devtool: mode === "development" ? "eval-source-map" : "source-map",
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
                  plugins: ["angularjs-annotate"],
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
        {
          test: /\.png$/,
          use: "url-loader?limit=100000",
        },
        {
          test: /\.jpg$/,
          use: "file-loader",
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader? limit=10000&mimetype=application/font-woff",
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=application/octet-stream",
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: "file-loader",
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=image/svg+xml",
        },
        {
          test: /\.html$/,
          use: "html-loader",
        },
      ],
    },
    output: {
      filename: "bundle-[hash].js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new CheckerPlugin(),
      new HtmlWebpackPlugin({ template: "./src/index.html" }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      plugins: [new TsconfigPathsPlugin()],
    },
  };

  return config;
};
