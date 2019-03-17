import React from "react";
import {Icon} from "antd";

export default function Loading(props) {
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
