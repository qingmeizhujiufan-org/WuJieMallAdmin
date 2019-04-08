import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 商品管理 */
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
/*  分类管理*/
const FoodCategoryList = Loadable({
    loader: () => import("../modules/food/component/foodCategory"),
    loading: Loading
});
const FoodCategoryAdd = Loadable({
    loader: () => import("../modules/food/component/foodCategoryAdd"),
    loading: Loading
});
const FoodCategoryDetail = Loadable({
    loader: () => import("../modules/food/component/foodCategoryDetail"),
    loading: Loading
});
const FoodCategoryEdit = Loadable({
    loader: () => import("../modules/food/component/foodCategoryEdit"),
    loading: Loading
});

module.exports = (
    <Route path="food" component={App}>
        <IndexRoute component={FoodList}/>
        <Route path="list" component={FoodList}/>
        <Route path="add" component={FoodAdd}/>
        <Route path="list/detail/:id" component={FoodDetail}/>
        <Route path="list/edit/:id" component={FoodEdit}/>
        <Route path="category/list" component={FoodCategoryList}/>
        <Route path="category/add" component={FoodCategoryAdd}/>
        <Route path="category/detail/:id" component={FoodCategoryDetail}/>
        <Route path="category/edit/:id" component={FoodCategoryEdit}/>
    </Route>
);
