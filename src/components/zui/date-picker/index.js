/**
 * Created by zhongzheng on 2018/12/15.
 */
import React, {Component} from 'react';
import {DatePicker} from 'antd';
import _isFunction from 'lodash/isFunction';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

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
            <DatePicker
                style={{width: '100%'}}
                value={value && moment(value)}
                onChange={this.onChange}
                {...restProps}
            />
        )
    }
}

Index.defaultProps = {};

Index.RangePicker = DatePicker.RangePicker;

export default Index;
