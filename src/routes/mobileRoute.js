import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Loadable from 'react-loadable';
import Loading from './loading';

import App from '../modules/App';

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
/* 首页推荐管理 */
const Recommend = Loadable({
    loader: () => import('../modules/mobile/component/recommend'),
    loading: Loading
});

module.exports = (
    <Route path="mobile" component={App}>
        <IndexRoute component={APPSlider}/>
        <Route path="topSlider/list" component={APPSlider}/>
        <Route path="topSlider/add" component={APPSliderAdd}/>
        <Route path="topSlider/list/edit/:id" component={APPSliderEdit}/>
        <Route path="recommend/list" component={Recommend}/>
    </Route>
);
