import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 食品商店管理 */
const shopList = Loadable({
  loader: () => import("../modules/food/component/foodShopList"),
  loading: Loading
});
const shopEdit = Loadable({
  loader: () => import("../modules/food/component/foodShopEdit"),
  loading: Loading
});

/* 食品管理 */
const FoodList = Loadable({
    loader: () => import("../modules/food/component/foodList"),
    loading: Loading
});
const FoodEdit = Loadable({
    loader: () => import("../modules/food/component/foodEdit"),
    loading: Loading
});

module.exports = (
    <Route path="food" component={App}>
        <IndexRoute component={FoodList}/>
        <Route path="shopList" component={shopList}/>
        <Route path="shopList/edit/:id" component={shopEdit}/>
        <Route path="list" component={FoodList}/>
        <Route path="list/edit/:id" component={FoodEdit}/>
    </Route>
);
