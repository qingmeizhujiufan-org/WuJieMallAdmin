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

/*  分类管理*/
const FoodCategoryList = Loadable({
  loader: () => import("../modules/food/component/foodCategory"),
  loading: Loading
});
const FoodCategoryAdd = Loadable({
  loader: () => import("../modules/food/component/foodCategoryAdd"),
  loading: Loading
});
const FoodCategoryEdit = Loadable({
  loader: () => import("../modules/food/component/foodCategoryEdit"),
  loading: Loading
});


module.exports = (
  <Route path="food" component={App}>
    <IndexRoute component={FoodList}/>
    <Route path="shopList" component={shopList}/>
    <Route path="shopList/edit/:id" component={shopEdit}/>
    <Route path="list" component={FoodList}/>
    <Route path="list/edit/:id" component={FoodEdit}/>
    <Route path="categoryList" component={FoodCategoryList}/>
    <Route path="category/add" component={FoodCategoryAdd}/>
    <Route path="categoryList/edit/:id" component={FoodCategoryEdit}/>
  </Route>
);
