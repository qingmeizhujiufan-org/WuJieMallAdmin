import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

/* 特色民宿管理 */
const HotelList = Loadable({
    loader: () => import("../modules/hotel/component/hotelList"),
    loading: Loading
});

module.exports = (
    <Route path="hotel" component={App}>
        <IndexRoute component={HotelList}/>
        <Route path="list" component={HotelList}/>
    </Route>
);
