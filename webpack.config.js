const path = require("path");

module.exports = {
    entry: path.resolve("src/app/Client.tsx"),
    output: {
        filename: "bundle.js",
        path: path.resolve("public/static")
    },
    devServer: {
        port: 3000,
        contentBase: path.resolve("public/static")
    },
    resolve: {
        extensions: [
            ".js", ".jsx", ".json", ".ts", ".tsx",
            ".css", ".png", ".jpg", ".svg", ".gif"
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: "ts-loader",
                exclude: [
                    path.resolve("src/server")
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(jpg|png|svg|gif)$/i,
                use: {
                    loader: "url-loader",
                    options: {
                        // limit: 32768
                        limit: 8192
                    }
                }
            }
        ]
    }
};