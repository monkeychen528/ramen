
import React, {
  useState, useEffect, useCallback, useReducer,
} from 'react';

import $ from 'jquery';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Article from './Article';
import '../asset/content.css';

const initialState = { num: 0 };

const Content = () => {
  const [rwdWidth, setRwdWidth] = useState(0);
  // const [num, setNum] = useState(0);
  const [stnum, setStnum] = useState(0);
  const [lesson, setLesson] = useState([]);

  // 分隔線
  const [state, dispatch] = useReducer(reducer, initialState);
  const body = document.querySelector('body');

  // 大版面跑馬燈
  const bigCarousel = (i = state.num) => {
    // console.log(i);
    const carouselImg = document.querySelectorAll('.carousel-img');
    const circle = document.querySelectorAll('.circle');
    $(circle[i])
      .addClass('circleActive')
      .siblings()
      .removeClass('circleActive');
    $(carouselImg[i]).css({
      opacity: 1,
    });
    $('.carousel').css(
      'transform', `translateX(${-i * carouselImg[i].offsetWidth}px)`, // 圖片疊圖片
    );
    if (i === carouselImg[i].length) return;
    $(carouselImg[i]).siblings().css({
      opacity: 0,
    }, 1000);
  };
  // 嘗試使用reducer,分離每秒換下一張跟滑鼠點擊更動state動作
  function reducer(state, action) {
    // action會去接disatch出來的東西
    switch (action.type) {
      case 'tick': {
        // num 元件正在跑的位置
        // todo 呼叫跑馬燈的fn
        return {
          num: action.num,
          todo: action.todo(action.num),
        };
      }
      case 'jumpTo': {
        return {
          num: action.jump,
        };
      }
      default:
        return console.log('no');
    }
  }

  // requst API
  useEffect(() => {
    if (lesson.length === 0) {
      try {
        fetch('https://my-json-server.typicode.com/monkeychen528/demo/star')
          .then((res) => res.json())
          .then((json) => {
            console.log(json);
            setLesson(json);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [lesson]);


  const resizeWindow = useCallback(() => {
    setRwdWidth(window.innerWidth);
    bigCarousel();
  }, [stnum, rwdWidth]);

  const scrollWindow = () => {
    // todo 改為IO的方式
    const top = 0 || $(window).scrollTop();

    switch (top > 0) {
      case (top < 300 && top > 150): {
        return $('.imgWrap').eq(0).addClass('leftIn');
      }
      case (top < 500 && top > 300): {
        return $('.imgWrap').eq(1).addClass('rightIn');
      }
      case (top > 500): {
        return $('.imgWrap').eq(2).addClass('leftIn');
      }
      default:
        break;
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', scrollWindow);
    return () => {
      window.removeEventListener('scroll', scrollWindow);
    };
  }, []);

  useEffect(() => {
    const { num } = state;
    // console.log(`out:${num}`);
    // interval裡面有自己的區塊外面值傳不到裡面，todo像官網的payload定義一個function，之後reducer呼叫
    // dispatch介紹發出去的動作到reducer裡面是確保靜態的狀態(也就是更改狀態)
    // num判斷state現在元件的位置
    const interval = setInterval(() => {
      dispatch({ type: 'tick', todo: bigCarousel, num: num === 3 ? 0 : num + 1 });
    }, 5000);
    // 這邊每次在更改狀態後把舊的計數器清掉
    // ex:今天記數+1，清舊的計時器，在生成畫面時啟動新的計時器，若此時用滑鼠點擊更動state，這邊depend知道num更動了，故清舊的計時器在產生新的
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, state.num, state.jump]);


  useEffect(() => {
    window.addEventListener('resize', resizeWindow);

    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, [stnum, resizeWindow]);


  // console.log(state);
  const tempData = ['山頭火', '鷹流', '凪', '鳥人'];
  return (
    <>
      <main>
        <div className="carousel-wrap position-relative">
          <ul className="d-flex m-0 p-0">
            <li
              className="circle circleActive"
              onClick={
                () => {
                  dispatch({
                    jump: 0,
                    type: 'jumpTo',
                  });
                  bigCarousel(0);
                }
              }
              role="presentation"
            />

            <li
              className="circle"
              onClick={() => {
                dispatch({
                  jump: 1,
                  type: 'jumpTo',
                  // function: bigCarousel,
                });
                bigCarousel(1);
              }}
              role="presentation"
            />
            <li
              className="circle"
              onClick={() => {
                dispatch({
                  jump: 2,
                  type: 'jumpTo',
                  // function: bigCarousel,
                });
                bigCarousel(2);
              }}
              role="presentation"
            />
            <li
              className="circle"
              onClick={() => {
                dispatch({
                  jump: 3,
                  type: 'jumpTo',
                  // function: bigCarousel,
                });
                bigCarousel(3);
              }}
              role="presentation"
            />
          </ul>
          <div className="carousel d-flex">
            <Link to="./" className="carousel-img">
              <img src="./images/ramen1.jpg" alt="山頭火" />
            </Link>
            <Link to="./" className="carousel-img">
              <img src="./images/ramen2.jpg" alt="鷹流" />
            </Link>
            <Link to="./" className="carousel-img">
              <img src="./images/ramen3.jpg" alt="凪" />
            </Link>
            <Link to="./" className="carousel-img">
              <img src="./images/ramen5.jpg" alt="鳥人" />
            </Link>
          </div>
        </div>
        <h2 className="title title-color">
          今天想吃
          {tempData[state.num]}
        </h2>
        <div className="chopstickWrap">
          <img src="images/chopstick.png" alt="" />
        </div>
        <section className="about">
          <h2 className="title">關於拉麵</h2>
          <div className="container-fluid">
            <figure className="d-flex">
              <div className=" imgWrap">
                <img src="images/soup.jpg" alt="" />
                <h4>
                  湯底
                </h4>
              </div>
              <div className="rightIn">
                <p>
                  拉麵的湯底大多有基本的調味材料，再添加不同的額外材料，成為各式各樣的湯頭。此外使用各地區不同的食材，也產生當地獨特的口味，使拉麵成為深入日本各地的普遍食物。
                  湯底的常見原料包括：雞肉、豬骨、牛骨、柴魚乾（鰹節）、青花魚乾、小魚乾、海帶、炒黃豆、香菇、洋蔥、蔥等等。拉麵湯通常需要連續燉煮數小時甚至數天。
                  有些拉麵店使用或混用成桶買進的商業拉麵湯，這種做法方便且可以降低成本，但專門的拉麵饕客可以吃出其中的區別。
                  湯底的口味一般來說可分為醬油味、豚骨（豬骨）味、鹽味、味噌味。
                  此外，也有像擔擔麵一般使用唐辛子（辣椒）的辣味和芝麻口味的湯底、類似生馬麵（日本一種地方麵食）的醋味湯底，以及歐式風味的番茄湯底，甚至也有咖哩的口味。
                  亦有不同味道的演變，例如魚介味，主要用作混搭雞、豚湯底，配以昆布能更有效帶出鮮味。
                  由於穆斯林等因宗教信仰而不能食用含有豬肉的任何食品，因此也有店家開發完全不使用豚骨湯底及豬肉的拉麵
                </p>
              </div>
            </figure>
            <figure className="d-flex">
              <div className="leftIn">
                <p>
                  早期最普遍的拉麵是加上日式叉燒、筍子的醬油口味，但現在拉麵的口味也越來越多樣化。
                  將使用手工或機械製作的麵條煮好，加上利用豬骨（日文：豚骨）或雞肉、蔬菜、小魚乾等熬煮的湯頭，大多都會再搭配日式叉燒、筍子、蔥花等配料。
                  大部分的麵條都是使用麵粉（小麥粉、強力粉）、水、鹽，以及「鹼水」（日語：かんすい，又被音譯為「甘素」）為原料，顏色大多是黃色。
                  鹼水是指碳酸鉀和碳酸鈉的混合物（有時也會加入磷酸）。這是由於曾有人使用內蒙古的湖水來製作麵條，
                  結果發現麵條變得更加好吃，因此研究了湖水的成份之後，發展出了這樣的配方。
                  鹼水是屬於鹼性，會讓麵粉中的穀蛋白黏膠質產生性質變化，讓麵條具有光澤感和增加彈性，也會讓麵粉中的黃酮類變成黃色，讓麵條具有獨特的顏色。
                </p>
              </div>
              <div className="imgWrap">
                <img src="images/namamen1.png" alt="" />
                <h4>
                  麵條
                </h4>
              </div>
            </figure>
            <figure className="d-flex">
              <div className="imgWrap">
                <img src="images/dish.jpg" alt="" />
                <h4>配料</h4>
              </div>
              <p>
                麵上通常會放上的配料包括：叉燒肉、海苔、豆芽、白菜、雞蛋、蒜末、筍、魚板、玉米粒、雪菜、土豆、燉肉、酸梅等等。最後可以再加一些香油或者香辛料。
              </p>
            </figure>
          </div>
        </section>
        <div className="content container">
          <h2 className="title title-color"> 拉麵星星推薦</h2>
          <div className="cardwrap ">
            {/* if (lesson.length === 0) return; */}
            {lesson.length === 0 ? '...載入中'
              : lesson.map((el) => (
                <Link key={el.id} to="./" className="myCard">
                  <div className="cardCap">
                    <img src={`images/${el.img}`} alt="" />
                  </div>
                  <div className="cardContent">
                    <h5>{el.title}</h5>
                    <p>{el.time}</p>
                    分數:
                    {el.point}
                  </div>
                </Link>
              ))}
          </div>
          <Link to="./" className="lessonLink">
            看更多推薦
          </Link>
        </div>
      </main>
      <article>
        <section className="container">
          <h2 className="title">食記文章</h2>
          <div className=" d-flex justify-content-between">
            <Article />
          </div>
          <Link className="font-color" to="./">
            ...更多文章
          </Link>
        </section>
      </article>
      <div className="contact container my-5">
        <h5>想更瞭解我們嗎？</h5>
        <p>
          您可以看看
          <span>
            <Link className="font-color" to="/contacts">
              常見問題
            </Link>
          </span>
          或者直接
          <span>
            <Link className="font-color" to="/contacts">
              線上洽詢
            </Link>
          </span>
          ，也可以透過社群網站隨時關注我們的動態。
        </p>
        <Link to="/contacts" className="m-2">
          <i className="fab fa-facebook" />
        </Link>
        <Link to="/contacts" className="m-2">
          <i className="fab fa-twitter" />
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default Content;
