/**
 * Created by zhongzheng on 2018/12/15.
 */
import React, {Component} from 'react';
import {Icon, Upload} from 'antd';
import _isFunction from 'lodash/isFunction';
import _isArray from 'lodash/isArray';
import restUrl from "RestUrl";

const uploadUrl = restUrl.FILE_UPLOAD_HOST + 'attachment/upload';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: null
        };
    }

    onChange = value => {
        let _value;
        if (_isArray(value)) _value = value;
        else _value = value && value.fileList;
        this.setState({value: _value});
        if (_isFunction(this.props.onChange)) this.props.onChange(_value);
    }

    render() {
        const {
            value,
            fileList,
            onChange,
            children,
            ...restProps
        } = this.props;
        let _value = fileList || value;
        _value = this.state.value || _value;

        return (
            <Upload
                style={{width: '100%'}}
                fileList={_value}
                onChange={this.onChange}
                {...restProps}
            >{children}</Upload>
        )
    }
}

Index.defaultProps = {
    action: uploadUrl,
    listType: "picture-card",
    multiple: true,
    withCredentials: true,
    children: <div><Icon type="plus"/> 上传</div>
}

export default Index;
