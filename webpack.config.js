const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 重要觀念
// One big note:
// outputPath is place where your want to save files
// publicPath is what url you have in js, css and etc files.
module.exports = {
  devtool: 'eval',
  entry: ['./src/index.js', './src/views/ContentIndex.js', './src/views/MapIndex.js'],
  output: {
    path: path.resolve(__dirname, 'public'), // 此為輸出的位置，通常跟index.html一起輸出，第二個參數不用斜線不然會去找/public這個資料夾
    filename: '[name].js',
    // publicPath: 'public/', // 尋找資源的路由 針對index.html該從哪引進
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'all',
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'commons', // 分割出來的檔案命名
          minChunks: 2, // 被引入2次以上的code就會被提取出來
          priority: 1, // 檔案的優先順序，數字越大表示優先級越高
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/, // 提取引入的模組
          chunks: 'initial',
          name: 'vendor', // 分割出來的檔案命名
          priority: 2, // 檔案的優先順序，數字越大表示優先級越高
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['*.js', '*.map', '*.html'] }),
    new Dotenv({
      path:
        process.env.NODE_ENV === 'development'
          ? './.env.dev'
          : './.env.prd',
      systemvars: true, // 開啟讀取 process.env 下的任意系統變量(cross-env環境運行、Dotenv是編譯時讀取)
    }),
  ],
  module: { // module指的是 模組引入語法統一
    // rules的值是一個陣列可以存放多個loader物件
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@emotion/babel-preset-css-prop', '@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime', 'emotion'],
          },
        },
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'], // css編譯完才會是style，loader編譯順序是右到左
      },
      {
        test: /\.(png|jpg|gif|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: '../images/',
              esModule: false,
              emitFile: true, // 要不要拷貝檔案到打包後的資料夾裡
            },
          },
        ],
      },
    ],
  },
  devServer: {
    // 指定開啟port為8000
    port: 8000,
    contentBase: path.join(__dirname, 'public'),
    // contentBase 主要用來使伺服器在 devServer.publicPath 目錄下找不到 index.html 檔案時(沒設定時)，轉而載入的內容
    // 也就是監聽位置8000打開後server會去看有無publicPath跟contentBase參數，若無預設會在根目錄下虛擬出一個暫存的資料夾內存放打包內容
    // compress: true,
  },
};

// 說明webpack.config.js 指的是打包設定
// 設定內容:
// 1.此檔為基準的進入(打包)路由，此檔為所有檔案匯入之集大成(index)
// 2.打包要用那些套件跟掛件
// **注意**@babel/core、@babel/preset-env、babel-loader一定會有
// hint:.babelrc跟webpack設定可寫一起，但大多數會拆開方便其他專案重複利用
