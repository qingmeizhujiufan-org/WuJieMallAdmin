import React from 'react';
import {Route, IndexRoute, hashHistory, Router} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

/* 引入模块路由 */
import OrderRoute from './orderRoute';
import ProductRoute from './productRoute';
import ShopRoute from './shopRoute';
import TravelRoute from './travelRoute';
import HotelRoute from './hotelRoute';
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
                        {MobileRoute}
                        {/* 用户管理 */}
                        {UserRoute}
                        {/* 店铺管理 */}
                        {ShopRoute}
                        {/* 产品管理 */}
                        {ProductRoute}
                        {/* 订单管理 */}
                        {OrderRoute}
                        {/* 特色民宿管理 */}
                        {HotelRoute}
                        {/* 主题旅游管理 */}
                        {TravelRoute}
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
