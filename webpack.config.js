const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack'); 

module.exports = {
  devtool: false,
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/i, // กำหนดรูปแบบไฟล์ภาพที่ต้องการให้โหลด
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[hash].[ext]', // กำหนดชื่อไฟล์หลังจากโหลด
      //     outputPath: 'assets/images', // กำหนดตำแหน่งการจัดเก็บไฟล์
      //   }
      // },
      // {
      //   test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2|eot)$/i, // เพิ่มกฎสำหรับไฟล์ฟอนต์
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[hash].[ext]',
      //     outputPath: 'assets/fonts', // กำหนดตำแหน่งการเก็บฟอนต์
      //   }
      // }
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/, // รองรับไฟล์ฟอนต์ต่าง ๆ
        type: 'asset/resource',  // จัดการฟอนต์เป็น resource
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // สำหรับไฟล์ภาพและไอคอน SVG
        type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // กำหนดตัวแปร process.env
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // ใช้ `static` แทน `contentBase`
    },
    compress: true,
    port: 8080,
    hot: true
  }
};
