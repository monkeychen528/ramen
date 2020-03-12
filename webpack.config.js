const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'public'), // 此為輸出的位置，通常跟index.html一起輸出，第二個參數不用斜線不然會去找/public這個資料夾
    filename: 'bundle.js',
    // publicPath: '/public/', // 尋找資源的路由 針對index.html該從哪引進
  },
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
              // publicPath: '/images',
              // outputPath: 'images/',
              emitFile: false, // 要不要拷貝檔案到打包後的資料夾裡
            },
          },
        ],
      },
    ],
  },
  // 拆分js test 但這針對頁面不統以打包的狀況，也就是各個頁面最後不從index.js進入
  // (需要htmlplugin自動帶入各頁面自己的js)
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     cacheGroups: {
  //       reactBase: {
  //         name: 'reactBase',
  //         test: (module) => /react|redux|prop-types/.test(module.context),
  //         chunks: 'initial',
  //         priority: 10,
  //       },
  //       common: {
  //         name: 'common',
  //         chunks: 'initial',
  //         priority: 2,
  //         minChunks: 2,
  //       },
  //     },
  //   },
  // },
  // 虛擬伺服器設置
  devServer: {
    // 指定開啟port為8000
    port: 8000,
    contentBase: path.join(__dirname, 'public'), // 指定靜態檔案的監聽位置這樣8000打開後會直接指向public裡的index
    compress: true,
  },
};

// 說明webpack.config.js 指的是打包設定
// 設定內容:
// 1.此檔為基準的進入(打包)路由，此檔為所有檔案匯入之集大成(index)
// 2.打包要用那些套件跟掛件
// **注意**@babel/core、@babel/preset-env、babel-loader一定會有
// hint:.babelrc跟webpack設定可寫一起，但大多數會拆開方便其他專案重複利用
