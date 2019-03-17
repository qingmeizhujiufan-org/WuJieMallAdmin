import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 商户管理 */
const ShopList = Loadable({
    loader: () => import("../modules/shop/component/shopList"),
    loading: Loading
});
const ShopAdd = Loadable({
    loader: () => import("../modules/shop/component/shopAdd"),
    loading: Loading
});
const ShopEdit = Loadable({
    loader: () => import("../modules/shop/component/shopEdit"),
    loading: Loading
});

module.exports = (
    <Route path="shop" component={App}>
        <IndexRoute component={ShopList}/>
        <Route path="list" component={ShopList}/>
        <Route path="add" component={ShopAdd}/>
        <Route path="list/edit/:id" component={ShopEdit}/>
    </Route>
);
