import React from 'react';
import Navbar from '../components/Navbar';
import Content from '../components/Content';
// todo拆出nav位置&地圖導入資料
const ContentIndex = () => (
  <>
    {/* Navbar特別獨立出去避免RamenMap 裡面改變state時影響而重複render */}
    <Navbar page="content" />
    <Content />
  </>
);

export default ContentIndex;
