import React from 'react';
import {Route, IndexRoute, hashHistory, Router} from 'react-router';
import {Icon} from 'antd';
import Loadable from 'react-loadable';

function Loading(props) {
    if (props.error) {
        return <div>错误! <button onClick={props.retry}>点击重试</button></div>;
    } else if (props.timedOut) {
        return <div>已经超时加载... <button onClick={props.retry}>点击重试</button></div>;
    } else if (props.pastDelay) {
        return (
            <div style={{
                padding: '30px 0',
                textAlign: 'center'
            }}>
                <Icon type="loading" style={{fontSize: 24}}/>
            </div>
        );
    } else {
        return null;
    }
}

const App = Loadable({
    loader: () => import('../modules/App'),
    loading: Loading
});
const Frame = Loadable({
    loader: () => import('../modules/Frame'),
    loading: Loading
});

/* 登录 */
const Login = Loadable({
    loader: () => import('../modules/login/component/login'),
    loading: Loading
});

/* APP管理 */
const APPSlider = Loadable({
    loader: () => import('../modules/mobile/component/topSlider'),
    loading: Loading
});
const APPSliderAdd = Loadable({
    loader: () => import('../modules/mobile/component/topSliderAdd'),
    loading: Loading
});
const APPSliderEdit = Loadable({
    loader: () => import('../modules/mobile/component/topSliderEdit'),
    loading: Loading
});

/* 用户管理 */
const UserList = Loadable({
    loader: () => import("../modules/user/component/userList"),
    loading: Loading
});
const UserDetail = Loadable({
    loader: () => import("../modules/user/component/userDetail"),
    loading: Loading
});
const UserEdit = Loadable({
    loader: () => import("../modules/user/component/userEdit"),
    loading: Loading
});
const UserAdd = Loadable({
    loader: () => import("../modules/user/component/userAdd"),
    loading: Loading
});
const UserResource = Loadable({
    loader: () => import("../modules/user/component/userResource"),
    loading: Loading
});

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
const SenderList = Loadable({
    loader: () => import("../modules/order/component/sender"),
    loading: Loading
});
/* 报表管理 */
const ReportList = Loadable({
    loader: () => import("../modules/report/component/reportList"),
    loading: Loading
});
const ReportHChart = Loadable({
    loader: () => import("../modules/report/component/reportHChart"),
    loading: Loading
});

/* 个人设置 */
const SettingList = Loadable({
    loader: () => import("../modules/setting/component/userCenter"),
    loading: Loading
});
const ResourceList = Loadable({
    loader: () => import("../modules/setting/component/resourceInfo"),
    loading: Loading
});

const requireAuth = (nextState, replace) => {
    // if (!sessionStorage.expireDate || new Date(sessionStorage.expireDate).getTime() <= new Date().getTime()) {
    //     replace({pathname: '/'})
    // }
}

class PageRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount = () => {

    }

    componentDidMount = () => {
    }

    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Login}/>
                    <Route path="login" component={Login}/>
                    <Route path="frame(/*)" component={Frame} onEnter={requireAuth}>
                        <IndexRoute component={APPSlider}/>
                        {/* APP管理 */}
                        <Route path="mobile" component={App}>
                            <IndexRoute component={APPSlider}/>
                            <Route path="topSlider/list" component={APPSlider}/>
                            <Route path="topSlider/add" component={APPSliderAdd}/>
                            <Route path="topSlider/list/edit/:id" component={APPSliderEdit}/>
                        </Route>
                        {/* 用户管理 */}
                        <Route path="user" component={App}>
                            <IndexRoute component={UserList}/>
                            <Route path="list" component={UserList}/>
                            <Route path="add" component={UserAdd}/>
                            <Route path="resource" component={UserResource}/>
                            <Route path="list/detail/:id" component={UserDetail}/>
                            <Route path="list/edit/:id" component={UserEdit}/>
                        </Route>
                        {/* 店铺管理 */}
                        <Route path="shop" component={App}>
                            <IndexRoute component={ShopList}/>
                            <Route path="list" component={ShopList}/>
                            <Route path="add" component={ShopAdd}/>
                            {/*<Route path="resource" component={UserResource}/>*/}
                            {/*<Route path="list/detail/:id" component={UserDetail}/>*/}
                            <Route path="list/edit/:id" component={ShopEdit}/>
                        </Route>
                        {/* 产品管理 */}
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
                        {/* 订单管理 */}
                        <Route path="order" component={App}>
                            <IndexRoute component={OrderList}/>
                            <Route path="list" component={OrderList}/>
                            <Route path="add" component={OrderAdd}/>
                            <Route path="list/edit/:id" component={OrderEdit}/>
                            <Route path="sender" component={SenderList}/>
                        </Route>
                        <Route path="report" component={App}>
                            <IndexRoute component={ReportList}/>
                            <Route path="list" component={ReportList}/>
                            <Route path="chart" component={ReportHChart}/>
                        </Route>
                        {/* 个人设置 */}
                        <Route path="setting" component={App}>
                            <IndexRoute component={SettingList}/>
                            <Route path="list" component={SettingList}/>
                            <Route path="resource" component={ResourceList}/>
                        </Route>
                    </Route>
                </Route>
            </Router>
        )
    }
}

export default PageRouter;
