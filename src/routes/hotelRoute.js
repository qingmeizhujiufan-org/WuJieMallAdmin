import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 特色民宿管理 */
const HotelList = Loadable({
  loader: () => import("../modules/hotel/component/hotelList"),
  loading: Loading
});

/* 特色民宿添加 */
const HotelAdd = Loadable({
  loader: () => import("../modules/hotel/component/hotelAdd"),
  loading: Loading
});

/* 特色民宿更新 */
const HotelEdit = Loadable({
  loader: () => import("../modules/hotel/component/hotelEdit"),
  loading: Loading
});

/* 房间列表 */
const RoomList = Loadable({
  loader: () => import("../modules/hotel/component/roomList"),
  loading: Loading
});

/* 房间添加 */
const RoomAdd = Loadable({
  loader: () => import("../modules/hotel/component/roomAdd"),
  loading: Loading
});

/* 房间更新 */
const RoomEdit = Loadable({
  loader: () => import("../modules/hotel/component/roomEdit"),
  loading: Loading
});

module.exports = (
  <Route path="hotel" component={App}>
    <IndexRoute component={HotelList}/>
    <Route path="list" component={HotelList}/>
    <Route path="add" component={HotelAdd}/>
    <Route path="edit/:id" component={HotelEdit}/>
    <Route path="room/list/:id" component={RoomList}/>
    <Route path="room/add/:id" component={RoomAdd}/>
    <Route path="room/edit/:id" component={RoomEdit}/>
  </Route>
);
