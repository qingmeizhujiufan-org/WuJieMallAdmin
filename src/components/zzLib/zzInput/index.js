/**
 * Created by zhongzhenga on 2018/8/14.
 */
import React, {Component} from 'react';
import {Input} from 'antd';
import {shiftThousands} from 'Utils/util';
import _isFunction from 'lodash/isFunction';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: undefined,
            inputEdit: false
        };
    }

    onChange = value => {
        let {inputValue} = this.state;
        const {thousandsNumber} = this.props;

        if (thousandsNumber) {
            /* 正则匹配浮点数 */
            const reg = new RegExp("^(-?\\d+)(\\.\\d+)?$");
            if (value !== '' && value.indexOf('.') === value.length - 1) {
                inputValue = value;
            } else if (reg.exec(value)) {
                inputValue = value;
            } else {
                if (value === '') inputValue = undefined;
            }
        } else {
            inputValue = value;
        }

        this.setState({inputValue});

        if (_isFunction(this.props.onChange)) this.props.onChange(thousandsNumber ? (!isNaN(inputValue) ? parseFloat(inputValue) : undefined) : inputValue);
    }

    onFocus = value => {
        let {inputValue} = this.state;
        const {editable} = this.props;
        if (!editable) return;
        this.setState({inputEdit: true});
        if (_isFunction(this.props.onFocus)) this.props.onFocus(inputValue);
    }

    onBlur = value => {
        const {thousandsNumber, maxNumber} = this.props;
        let inputValue = parseFloat(value) <= maxNumber ? parseFloat(value) : maxNumber;
        if (thousandsNumber && value !== '') {
            this.setState({
                inputValue,
                inputEdit: false
            });
        }
        if (_isFunction(this.props.onBlur)) this.props.onBlur(inputValue);
    }

    onKeyPress = (e, val) => {
    }

    onErrorClick = () => {
        if (_isFunction(this.props.onErrorClick)) this.props.onErrorClick();
    }

    render() {
        let {
            name,
            value,
            editable,
            disabled,
            extra,
            placeholder,
            maxLength,
            type,
            label,
            clear,
            error,
            onErrorClick,
            thousandsNumber,
            precision
        } = this.props;
        const {inputValue, inputEdit} = this.state;

        value = inputValue || value;
        if (!isNaN(parseFloat(value)) && thousandsNumber && !inputEdit) {
            value = shiftThousands(parseFloat(value), precision);
        }

        return (
            <Input
                value={value}
                editable={editable}
                disabled={disabled}
                type={type}
                extra={extra}
                name={name}
                clear={clear}
                error={error}
                onErrorClick={onErrorClick}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onKeyPress={this.onKeyPress}
                placeholder={placeholder}
                maxLength={maxLength}
            >
            </Input>
        )
    }
}

Index.defaultProps = {
    label: "",
    name: "",
    type: "text",
    required: false,
    editable: true,
    disabled: false,
    value: null,
    extra: "",
    visible: true,
    clear: true,
    placeholder: "请输入",
    maxLength: 999,
    thousandsNumber: false,
    maxNumber: 9999999999
}
export default Index;
