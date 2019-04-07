/**
 * Created by zhongzheng on 2019/4/7.
 */
import React, {Component} from 'react';
import {InputNumber} from 'antd';
import _isFunction from 'lodash/isFunction';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    onChange = value => {
        if (_isFunction(this.props.onChange)) this.props.onChange(value);
    }

    render() {
        const {
            value,
            onChange,
            ...restProps
        } = this.props;

        return (
            <InputNumber
                style={{width: '100%'}}
                value={value}
                onChange={this.onChange}
                {...restProps}
            />
        )
    }
}

Index.defaultProps = {};

export default Index;
