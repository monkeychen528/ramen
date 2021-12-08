import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import websocket from 'socket.io-client';
import Navbar from './Navbar';
import '../asset/comment.css';

const Comment = () => {
  const [ws, setWs] = useState(null);
  const [connect, setConnect] = useState(false);
  const [room, setRoom] = useState('hole');
  const [name, setName] = useState('');
  const msg = useRef(null);
  const user = useRef(null);
  const port = 'https://ramen-chatroom.herokuapp.com';
  // const port = 'localhost:3080';
  // process.env.NODE_ENV === 'production' ?: 'localhost:3050';
  const connectWebSocket = () => {
    // 伺服器目前是local所以別台電腦無法連接
    // console.log(port, 'kjhgjfj');
    // if (room) setWs(websocket(port, { path: room }));
    // const initUser = document.querySelector('#user');
    const wsConfig = {
      transports: ['websocket'],
      withCredentials: true,
      id: room,
    };
    console.log(user.current.value);
    const wsRequest = websocket(`${port}?name=${user.current.value}`, wsConfig);
    // console.log(user);

    setWs(wsRequest);
    console.log(ws);
    return setConnect(true);
  };

  // 監聽送回的訊息
  const initWebSocket = () => {
    // const 放裡面是要讓每次接收訊息時重新建新的
    ws.on('getMessage', (getMsg) => {
      const showText = document.querySelector('#textBlock');
      console.log(showText);
      const block = document.createElement('p');
      block.innerHTML = `${name} : ${getMsg}`;
      showText.append(block);
    });
  };

  // 送出訊息到websocket
  const sendMessage = () => {
    // 清空textarea 恢復原本高度
    console.log(msg.current.value);
    ws.emit('message', { id: room, msg: msg.current.value });
    msg.current.style.height = '41px';
    msg.current.value = '';
  };

  // 更換房間
  const changeRoom = (e) => {
    const roomName = e.target.innerHTML;
    e.target.style.listStyle = 'unset';
    $(e.target).siblings().css('list-style', 'none');
    ws.emit('changeroom', { nowRoom: roomName });
    setRoom(roomName);
  };
  // 暱稱輸入、送出處理
  const handleName = (e) => {
    // e.persist();
    const userLabelText = document.querySelector('.user_label_text');
    userLabelText.style.opacity = 0;
  };
  // const nameCheck = () => {
  //   if(connect)
  // };
  const controlPlaceHolder = () => {
    const userLabelText = document.querySelector('.user_label_text');
    userLabelText.style.opacity = '';
    userLabelText.innerText = `暱稱:${user.current.value}` || '您的暱稱是?';
    setName(user.current.value);
    connectWebSocket();
  };
  const noOnline = () => ws.emit('disconnected');
  // 畫面進入的時候重新連接socket
  useEffect(() => {
    // if (connect) {
    // }
    if (ws) {
      ws.on('connect_error', (err) => {
        if (err) {
          alert('名字有人用了喔');
          setName('');
          return ws.disconnect();
        }
        // return setConnect(true);
      });

      ws.on('connect', () => {
        initWebSocket();
      });
    }
    // else {
    //   connectWebSocket();
    // }
    // 監聽如果離開頁面則發送disconnect
    window.addEventListener('popstate', noOnline);
    return () => {
      console.log('remove event');
      window.removeEventListener('popstate', noOnline);
    };
  }, [ws]);

  // type留言的時候更改textarea高度
  const adjustHeight = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
      return;
    }
    const grow = Math.ceil(msg.current.clientHeight);
    const checkHeight = e.target.scrollHeight;
    // 拆開寫,grow取得網頁中的高度，checkoutHeight是換行時就會出現scrollHeight
    // css樣式內部高度預設35px，如果出現scrollHeight代表換行，把text高度設為一樣scroll高度
    // todo bug刪除文字時需要多刪3~6個字才會縮排
    // if (checkHeight >= grow) {
    //   msg.style.height = `${checkHeight}px`;
    // } else {
    //   msg.style.height = `${grow - 35}px`;
    // }
  };

  return (
    <>
      <Navbar />
      <div className="roomBody">
        {name ? null : (
          <div className="nameBg">
            <div className="name_input">
              <label htmlFor="user" className="user_label">
                <input
                  type="text"
                  id="user"
                  placeholder=""
                  onChange={handleName}
                  onBlur={controlPlaceHolder}
                  ref={user}
                // value={name}
                />
                <span className="user_label_text">您的暱稱是?</span>
              </label>
              <button type="button" disabled={!connect}>送出</button>
            </div>
          </div>
        )}
        {name && (
          <div className="roomContainer" style={{ display: 'flex' }}>
            <aside>
              <div className="roomWrap">
                <ul>
                  <li
                    className="room"
                    style={{ listStyle: 'unset' }}
                    onClick={changeRoom}
                    role="presentation"
                  >
                    大廳
                  </li>
                  <li className="room" onClick={changeRoom} role="presentation">
                    房間一
                  </li>
                  <li className="room" onClick={changeRoom} role="presentation">
                    房間二
                  </li>
                  <li className="room" onClick={changeRoom} role="presentation">
                    房間三
                  </li>
                </ul>
              </div>
            </aside>
            <div>
              <div className="textWrap">
                <div id="textBlock">文字訊息</div>
              </div>
              <div className="typeWrap">
                <textarea
                  placeholder="輸入文字"
                  id="msg"
                  onKeyDown={adjustHeight}
                  ref={msg}
                />
                <input type="button" onClick={sendMessage} value="送出" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Comment;
