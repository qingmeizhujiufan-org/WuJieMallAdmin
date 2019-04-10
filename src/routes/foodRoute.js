import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 食品管理 */
const FoodList = Loadable({
    loader: () => import("../modules/food/component/foodList"),
    loading: Loading
});
const FoodDetail = Loadable({
    loader: () => import("../modules/food/component/foodDetail"),
    loading: Loading
});
const FoodEdit = Loadable({
    loader: () => import("../modules/food/component/foodEdit"),
    loading: Loading
});
const FoodAdd = Loadable({
    loader: () => import("../modules/food/component/foodAdd"),
    loading: Loading
});

module.exports = (
    <Route path="food" component={App}>
        <IndexRoute component={FoodList}/>
        <Route path="list" component={FoodList}/>
        <Route path="add" component={FoodAdd}/>
        <Route path="list/detail/:id" component={FoodDetail}/>
        <Route path="list/edit/:id" component={FoodEdit}/>
    </Route>
);
