import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

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

module.exports = (
    <Route path="user" component={App}>
        <IndexRoute component={UserList}/>
        <Route path="list" component={UserList}/>
        <Route path="add" component={UserAdd}/>
        <Route path="list/detail/:id" component={UserDetail}/>
        <Route path="list/edit/:id" component={UserEdit}/>
    </Route>
);
