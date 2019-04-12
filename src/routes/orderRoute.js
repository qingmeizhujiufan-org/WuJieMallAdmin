import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 订单管理 */
const OrderList = Loadable({
    loader: () => import("../modules/order/component/orderList"),
    loading: Loading
});
const OrderAdd = Loadable({
    loader: () => import("../modules/order/component/orderAdd"),
    loading: Loading
});
const OrderEdit = Loadable({
    loader: () => import("../modules/order/component/orderEdit"),
    loading: Loading
});

module.exports = (
<Route path="order" component={App}>
    <IndexRoute component={OrderList}/>
    <Route path="list" component={OrderList}/>
    <Route path="add" component={OrderAdd}/>
    <Route path="list/edit/:id" component={OrderEdit}/>
</Route>
);
