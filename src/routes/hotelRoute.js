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

/* 特色民宿添加 */
const HotelEdit = Loadable({
  loader: () => import("../modules/hotel/component/hotelEdit"),
  loading: Loading
});

module.exports = (
  <Route path="hotel" component={App}>
    <IndexRoute component={HotelList}/>
    <Route path="list" component={HotelList}/>
    <Route path="add" component={HotelAdd}/>
    <Route path="edit/:id" component={HotelEdit}/>
  </Route>
);
