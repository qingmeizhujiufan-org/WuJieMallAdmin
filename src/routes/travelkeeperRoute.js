import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 旅游列表 */
const TravelList = Loadable({
    loader: () => import("../modules/travelkeeper/component/travelList"),
    loading: Loading
});

/* 添加旅游 */
const TravelAdd = Loadable({
    loader: () => import("../modules/travelkeeper/component/travelAdd"),
    loading: Loading
});

/* 旅游信息更新 */
const TravelEdit = Loadable({
    loader: () => import("../modules/travelkeeper/component/travelEdit"),
    loading: Loading
});

/* 订单管理 */
const OrderList = Loadable({
    loader: () => import("../modules/travelkeeper/component/orderList"),
    loading: Loading
});

/* 认证信息 */
const Keeper = Loadable({
    loader: () => import("../modules/travelkeeper/component/keeper"),
    loading: Loading
});

module.exports = (
    <Route path="travelkeeper" component={App}>
        <IndexRoute component={TravelList}/>
        <Route path="travelList" component={TravelList}/>
        <Route path="travelList/edit/:id" component={TravelEdit}/>
        <Route path="addTravel" component={TravelAdd}/>
        <Route path="orderList" component={OrderList}/>
        <Route path="keeper" component={Keeper}/>
    </Route>
);
