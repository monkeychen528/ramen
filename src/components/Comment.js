import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import websocket from 'socket.io-client';
import Navbar from './Navbar';
import '../asset/comment.css';


const Comment = () => {
  const [ws, setWs] = useState(null);
  const [connect, setConnect] = useState(false);
  const [room, setRoom] = useState('hole');
  const msg = document.querySelector('#msg');
  const port = 'https://ramen-chatroom.herokuapp.com';
  // const port = 'localhost:3000';
  // process.env.NODE_ENV === 'production' ?: 'localhost:3050';
  const connectWebSocket = () => {
    // 伺服器目前是local所以別台電腦無法連接
    // console.log(port, 'kjhgjfj');
    if (room) setWs(websocket(port, { path: room }));
    setWs(websocket(port, { transports: ['websocket'], withCredentials: true }));
    setConnect(true);
  };
  // 監聽送回的訊息
  const initWebSocket = () => {
    const showText = document.querySelector('#textBlock');
    // const 放裡面是要讓每次接收訊息時重新建新的
    ws.on('getMessage', (getMsg) => {
      console.log(ws, 'this is ws');
      const block = document.createElement('p');
      block.innerHTML = getMsg;
      showText.append(block);
    });
  };

  // 送出訊息到websocket
  const sendMessage = () => {
    // 清空textarea 恢復原本高度
    ws.emit('message',
      room ? { nowRoom: room, msg: msg.value } : msg.value);
    msg.style.height = '41px';
    msg.value = '';
  };

  // 更換房間
  const changeRoom = (e) => {
    const roomName = e.target.innerHTML;
    e.target.style.listStyle = 'unset';
    $(e.target).siblings().css('list-style', 'none');
    ws.emit('changeroom', { nowRoom: roomName });
    setRoom(roomName);
  };
  const disconnect = () => {
    console.log('will disconnect');
    ws.close();
  };

  // 畫面進入的時候重新連接socket
  useEffect(() => {
    if (connect) {
      console.log('success');
      // ws.emit('disconnected');
      initWebSocket();
    } else {
      console.log('continue connect');
      connectWebSocket();
    }
    // 監聽如果離開頁面則發送disconnect
    window.addEventListener('popstate', disconnect);
    return () => {
      console.log('remove event');
      window.removeEventListener('popstate', disconnect);
    };
  }, [ws]);

  // type留言的時候更改textarea高度
  const adjustHeight = (e) => {
    const grow = Math.ceil(msg.clientHeight);
    const checkHeight = e.target.scrollHeight;
    // 拆開寫,grow取得網頁中的高度，checkoutHeight是換行時就會出現scrollHeight
    // css樣式內部高度預設35px，如果出現scrollHeight代表換行，把text高度設為一樣scroll高度
    // todo bug刪除文字時需要多刪3~6個字才會縮排
    if (checkHeight >= grow) {
      msg.style.height = `${checkHeight}px`;
    } else {
      msg.style.height = `${grow - 35}px`;
    }
  };

  return (
    <>
      <Navbar />
      <div className="roomBody">
        <aside>
          <div className="roomWrap">
            <ul>
              <li className="room" style={{ listStyle: 'unset' }} onClick={changeRoom} role="presentation">hole</li>
              <li className="room" onClick={changeRoom} role="presentation">room1</li>
              <li className="room" onClick={changeRoom} role="presentation">room2</li>
              <li className="room" onClick={changeRoom} role="presentation">room3</li>
            </ul>
          </div>
        </aside>
        <div>
          <div className="textWrap">
            <div id="textBlock">
              文字訊息
            </div>
          </div>
          <div className="typeWrap">
            <textarea placeholder="輸入文字" id="msg" onKeyDown={adjustHeight} />
            <input type="button" onClick={sendMessage} value="送出" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Comment;
