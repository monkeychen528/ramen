/** @jsx jsx */
import React, {
  useEffect, useState, useCallback,
} from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import '../asset/mainNav.css';

const show = () => {
  $('#mobilenav').slideToggle();
};

const Navbar = (props) => {
  const [toggleslide, setToggleslide] = useState(true);
  const { page } = props;
  const body = document.querySelector('body');
  window.addEventListener('resize', () => {
    if (body.offsetWidth > 991) {
      $('#mobilenav').hide();
    }
  });
  // Navbar在不同頁面時更換樣式
  const MainNav = styled.div`
  display: flex;
  justify-content: space-between;
  position: ${() => (page === 'content' ? 'fixed' : 'relative')};
  top: 0;
  width:100%;
  box-shadow: 2px 2px 3px rgb(10, 10, 39);
  background: rgb(200, 80, 5);
  z-index: 3;
  transition: 1s;
  animation:${() => (page === 'map' ? 'toggleslide 3s forwards' : '')};
}
`;

  const Header = css`
    background: transparent;
    position: fixed;
    top: 0;
    z-index: 1001;
    width: 100%;
    height: 70px;
      &:hover { 
        #header{
        animation:'slidedown 1s both';
      } 
    }
    `;

  // 在地圖的頁面時
  // 決定是否跑動畫
  const slideAnimate = () => {
    if (toggleslide) {
      $('#header').removeClass('short');
      $('.mynav').css({ display: '' });
    } else {
      $('#header').addClass('short');
      $('.mynav').css({ display: 'none' });
    }
  };

  // 滑鼠滾動事件
  const scrollfn = useCallback(() => {
    const header = document.querySelector('#header');
    // console.log(header.className);
    if ($(window).scrollTop() > header.clientHeight) {
      setToggleslide(false);
    } else if ($(window).scrollTop() < $('#header').height()) {
      setToggleslide(true);
    }
    slideAnimate();
  }, [toggleslide]);
  useEffect(() => {
    window.addEventListener('scroll', scrollfn);
    return () => window.removeEventListener('scroll', scrollfn);
  });

  // 滑鼠移入移出logo事件
  const handleIn = () => {
    setToggleslide(true);
    slideAnimate();
  };
  const handleOut = () => {
    setToggleslide(false);
    slideAnimate();
  };

  return (
    <>
      <header css={page === 'map' ? css`
          ${Header}
          ` : ''}
      >
        <MainNav id="header">
          <div className="logo" onMouseOver={handleIn} onMouseLeave={handleOut} onFocus={() => 0}>
            <Link to="/">
              <img src="./images/logo.svg" alt="ramenLogo" />
            </Link>
          </div>
          <div className="mynav pl-0">
            <li>
              <Link to="/ramenMap">
                拉麵地圖
                <span id="tagEvent"> 新功能</span>
              </Link>
            </li>
            <li>
              <Link to="/contacts">聯絡我們</Link>
            </li>
            <li>
              <Link to="/comment">討論區</Link>
            </li>
          </div>
          <div id="burger" onClick={() => show()} role="presentation">
            <div className="line" />
            <div className="line" />
            <div className="line" />
          </div>
        </MainNav>
      </header>
      <nav className="container-fluid">
        <ul id="mobilenav" className="pl-0">
          <li className="col">
            <Link to="/ramenMap">
              拉麵地圖
              <span id="tagEvent"> 新功能</span>
            </Link>
          </li>
          <li className="col ">
            <Link to="/contacts">聯絡我們</Link>
          </li>
          <li className="col ">
            <Link to="/comment">討論區</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
