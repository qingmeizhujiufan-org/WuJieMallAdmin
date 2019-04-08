import React from 'react';
import {Route, IndexRoute, hashHistory, Router} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

/* 引入模块路由 */
import OrderRoute from './orderRoute';
import FoodRoute from './foodRoute';
import FoodkeeperRoute from './foodkeeperRoute';
import ShopRoute from './shopRoute';
import TravelRoute from './travelRoute';
import TravelkeeperRoute from './travelkeeperRoute';
import HotelRoute from './hotelRoute';
import HotelkeeperRoute from './hotelkeeperRoute';
import UserRoute from './userRoute';
import MobileRoute from './mobileRoute';

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

/* 个人设置 */
const SettingList = Loadable({
    loader: () => import("../modules/setting/component/userCenter"),
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
                        {MobileRoute}
                        {/* 用户管理 */}
                        {UserRoute}
                        {/* 店铺管理 */}
                        {ShopRoute}
                        {/* 食品管理 */}
                        {FoodRoute}
                        {/* 食品店家管理 */}
                        {FoodkeeperRoute}
                        {/* 订单管理 */}
                        {OrderRoute}
                        {/* 特色民宿管理 */}
                        {HotelRoute}
                        {/* 民宿店家管理 */}
                        {HotelkeeperRoute}
                        {/* 主题旅游管理 */}
                        {TravelRoute}
                        {/* 旅游店家管理 */}
                        {TravelkeeperRoute}
                        {/* 个人设置 */}
                        <Route path="setting" component={App}>
                            <IndexRoute component={SettingList}/>
                            <Route path="list" component={SettingList}/>
                        </Route>
                    </Route>
                </Route>
            </Router>
        )
    }
}

export default PageRouter;
