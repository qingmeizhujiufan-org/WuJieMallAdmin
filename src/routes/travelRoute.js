import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 主题旅游管理 */
const TravelList = Loadable({
    loader: () => import("../modules/travel/component/travelList"),
    loading: Loading
});
const TravelAdd = Loadable({
    loader: () => import("../modules/travel/component/travelAdd"),
    loading: Loading
});
const TravelEdit = Loadable({
    loader: () => import("../modules/travel/component/travelEdit"),
    loading: Loading
});

module.exports = (
    <Route path="travel" component={App}>
        <IndexRoute component={TravelList}/>
        <Route path="list" component={TravelList}/>
        <Route path="add" component={TravelAdd}/>
        <Route path="list/edit/:id" component={TravelEdit}/>
    </Route>
);
