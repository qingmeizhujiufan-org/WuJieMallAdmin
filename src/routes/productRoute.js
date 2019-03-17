import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 商品管理 */
const ProductList = Loadable({
    loader: () => import("../modules/product/component/productList"),
    loading: Loading
});
const ProductDetail = Loadable({
    loader: () => import("../modules/product/component/productDetail"),
    loading: Loading
});
const ProductEdit = Loadable({
    loader: () => import("../modules/product/component/productEdit"),
    loading: Loading
});
const ProductAdd = Loadable({
    loader: () => import("../modules/product/component/productAdd"),
    loading: Loading
});
/*  分类管理*/
const ProductCategoryList = Loadable({
    loader: () => import("../modules/product/component/productCategory"),
    loading: Loading
});
const ProductCategoryAdd = Loadable({
    loader: () => import("../modules/product/component/productCategoryAdd"),
    loading: Loading
});
const ProductCategoryDetail = Loadable({
    loader: () => import("../modules/product/component/productCategoryDetail"),
    loading: Loading
});
const ProductCategoryEdit = Loadable({
    loader: () => import("../modules/product/component/productCategoryEdit"),
    loading: Loading
});

module.exports = (
    <Route path="product" component={App}>
        <IndexRoute component={ProductList}/>
        <Route path="list" component={ProductList}/>
        <Route path="add" component={ProductAdd}/>
        <Route path="list/detail/:id" component={ProductDetail}/>
        <Route path="list/edit/:id" component={ProductEdit}/>
        <Route path="category/list" component={ProductCategoryList}/>
        <Route path="category/add" component={ProductCategoryAdd}/>
        <Route path="category/detail/:id" component={ProductCategoryDetail}/>
        <Route path="category/edit/:id" component={ProductCategoryEdit}/>
    </Route>
);
