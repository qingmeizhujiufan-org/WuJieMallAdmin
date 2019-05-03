import axios from 'axios';
import {message} from 'antd';
import restUrl from 'RestUrl';

axios.defaults.baseURL = restUrl.BASE_HOST;
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';

// 添加请求拦截器
axios.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    // 对响应错误做点什么
    const response = error.response;
    if(response) {
        const data = response.data || {};
        if (response.status === 401 || response.status === 403) {
            message.error(data.message);
            window.location.hash = `/login?back_url=${window.location.href}`;
        }
    }else {
        message.error('服务异常');
    }

    return Promise.reject(error);
});

export default axios;
