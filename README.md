download you can see simple leaflet setting,comment area need backend setting

example:https://monkeychen528.github.io/ramen/public

the file public is bundled for static website.

### About this project

This is a site for Ramen (ラーメン)　 in Taiwan where i had eatten.
I'm going todo is

1.build the ramen data and record my thought (working, need node.js to connect database)
2.set the map to show the ramen store (working)
3.set the comment system (just simple separate room by socket.io)
after database was built maybe will upload node.js about route setting

## welcome to discuss new technique or give me more info about ramen(lol)

### 關於這個專案

之前有段時間蠻喜歡吃拉麵的，所以想記錄下來，並慢慢增加資料
目前想做的事有

1.建立拉麵的資料及之前吃完後的一些感想(資料創建目前只有幾筆 json-server 可應付，之後考慮換成資料庫) 2.創建一個地圖並顯示拉麵店的資料(目前研究 puppeteer，須資料庫) 3.搞一個討論系統(簡單分流有完成用 socket.io)，已部屬(待確認穩定性)
後端因為資料的關係，之後才考慮上傳關於連接資料庫跟 socket 等設定，留言板上到 heroku(暫記錄睡眠問題)

有新技術或是願意技術指導的高人們歡迎留言，也歡迎提供關於拉麵的資訊

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app),but i want to test webpack setting
so now this project have been ejected.

## you can check the file webpack.config for compiler setting

中文: 原本用 create-react-app 建置的環境，但想測試關於 webpack 等架設方法及 create-react-app 裏頭設置的掛件，故 eject 並重新下載 babel 轉譯掛件(2020 年初配置，非 webpack5 配置)
