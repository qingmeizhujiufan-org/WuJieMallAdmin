import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Breadcrumb,
    Button,
    Icon,
    Spin,
    notification,
    message,
    Tooltip
} from 'antd';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import axios from "Utils/axios";
import {Upload} from 'Comps/zui';
import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            confirmDirty: false,
            roleList: [],
            roleLoading: false,
            submitLoading: false
        };
    }

    componentDidMount = () => {
        this.queryRole();
    }

    queryRole = () => {
        this.setState({roleLoading: true});
        axios.get('role/queryList').then(res => res.data).then(data => {
            if (data.success) {
                let roleList = data.backData;
                this.setState({
                    roleList: roleList
                });
            } else {
                message.error(data.backMsg);
            }
            this.setState({roleLoading: false});
        });
    }

    handleChange = (fileList) => {
        this.setState({fileList})
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    validatePhone = (rule, value, callback) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.avatarSrc) {
                    values.avatarSrc = values.avatarSrc.map(item => item.response.id).join(',');
                }
                delete values.confirm;
                values.createBy = sessionStorage.getItem('userName');
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                axios.post('admin/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '新增用户成功！'
                        });

                        return this.context.router.push('/frame/user/list');
                    } else {
                        message.error(data.backMsg);
                    }

                    this.setState({
                        submitLoading: false
                    });
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {fileList, roleList, roleLoading, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增人员</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增人员</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        label="头像"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('avatarSrc', {
                                            rules: [{required: false, message: '头像不能为空!'}],
                                        })(
                                            <Upload
                                                listType={'picture'}
                                                onChange={this.handleChange}
                                            >
                                                {fileList.length >= 1 ? null :
                                                    <Button><Icon type="upload"/> 上传</Button>}
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        label="角色选择"
                                        {...formItemLayout}
                                    >
                                        <Spin spinning={roleLoading} indicator={<Icon type="loading"/>}>
                                            {getFieldDecorator('roleId', {
                                                rules: [{required: true, message: '角色不能为空!'}]
                                            })(
                                                <Select>
                                                    {
                                                        roleList.map(item => {
                                                            return (<Option key={item.roleId}
                                                                            value={item.roleId}>{item.roleName}</Option>)
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Spin>
                                    </FormItem>
                                </Col>

                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户名"
                                    >
                                        {getFieldDecorator('userName', {
                                            rules: [{
                                                required: true, message: '请输入用户名',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="真实姓名"
                                    >
                                        {getFieldDecorator('realName', {
                                            rules: [{
                                                required: true, message: '请输入真实姓名'
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label={(
                                            <span>密码&nbsp;
                                                <Tooltip title="初始密码为：000000">
                            <Icon type="question-circle-o"/>
                        </Tooltip>
                    </span>
                                        )}
                                    >
                                        {getFieldDecorator('password', {
                                            rules: [{
                                                required: true, message: '请输入密码',
                                            }, {
                                                validator: this.validateToNextPassword,
                                            }],
                                            initialValue: '000000'
                                        })(
                                            <Input type="password"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="确认密码"
                                    >
                                        {getFieldDecorator('confirm', {
                                            rules: [{
                                                required: true, message: '请确认密码',
                                            }, {
                                                validator: this.compareToFirstPassword,
                                            }],
                                            initialValue: '000000'
                                        })(
                                            <Input type="password" onBlur={this.handleConfirmBlur}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="个人电话"
                                    >
                                        {getFieldDecorator('phone', {
                                            rules: [{required: true, message: '请输入个人电话'}, {
                                                validator: this.validatePhone,
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" style={{marginTop: 40}}>
                                <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                        loading={submitLoading}>提交</Button>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

const userAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default userAdd;
