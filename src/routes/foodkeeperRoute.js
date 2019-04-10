import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 食品列表 */
const FoodList = Loadable({
    loader: () => import("../modules/foodkeeper/component/foodList"),
    loading: Loading
});

/* 食品添加 */
const FoodAdd = Loadable({
    loader: () => import("../modules/foodkeeper/component/foodAdd"),
    loading: Loading
});

/* 食品更新 */
const FoodEdit = Loadable({
    loader: () => import("../modules/foodkeeper/component/foodEdit"),
    loading: Loading
});

/*  分类管理*/
const FoodCategoryList = Loadable({
    loader: () => import("../modules/foodkeeper/component/foodCategory"),
    loading: Loading
});
const FoodCategoryAdd = Loadable({
    loader: () => import("../modules/foodkeeper/component/foodCategoryAdd"),
    loading: Loading
});
const FoodCategoryEdit = Loadable({
    loader: () => import("../modules/foodkeeper/component/foodCategoryEdit"),
    loading: Loading
});

/* 认证信息 */
const Keeper = Loadable({
    loader: () => import("../modules/foodkeeper/component/keeper"),
    loading: Loading
});


module.exports = (
    <Route path="foodkeeper" component={App}>
        <IndexRoute component={FoodList}/>
        <Route path="foodList" component={FoodList}/>
        <Route path="foodList/edit/:id" component={FoodEdit}/>
        <Route path="addFood" component={FoodAdd}/>
        <Route path="keeper" component={Keeper}/>
        <Route path="categoryList" component={FoodCategoryList}/>
        <Route path="category/add" component={FoodCategoryAdd}/>
        <Route path="categoryList/edit/:id" component={FoodCategoryEdit}/>
    </Route>
);
