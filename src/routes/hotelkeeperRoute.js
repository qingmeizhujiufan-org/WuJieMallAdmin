import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 房间列表 */
const RoomList = Loadable({
    loader: () => import("../modules/hotelkeeper/component/roomList"),
    loading: Loading
});

/* 房间添加 */
const RoomAdd = Loadable({
    loader: () => import("../modules/hotelkeeper/component/roomAdd"),
    loading: Loading
});

/* 房间更新 */
const RoomEdit = Loadable({
    loader: () => import("../modules/hotelkeeper/component/roomEdit"),
    loading: Loading
});

/* 订单管理 */
const OrderList = Loadable({
    loader: () => import("../modules/hotelkeeper/component/orderList"),
    loading: Loading
});

/* 认证信息 */
const Keeper = Loadable({
    loader: () => import("../modules/hotelkeeper/component/keeper"),
    loading: Loading
});

module.exports = (
    <Route path="hotelkeeper" component={App}>
        <IndexRoute component={RoomList}/>
        <Route path="roomList" component={RoomList}/>
        <Route path="roomList/edit/:id" component={RoomEdit}/>
        <Route path="addRoom" component={RoomAdd}/>
        <Route path="orderList" component={OrderList}/>
        <Route path="keeper" component={Keeper}/>
    </Route>
);
