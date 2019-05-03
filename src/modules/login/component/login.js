import React from 'react';
import PropTypes from 'prop-types';
import {Form, Icon, Row, Col, Input, Button, message} from 'antd';
import restUrl from 'RestUrl';
import axios from 'Utils/axios';
import '../login.less';

import loginBg from 'Img/login-bg.jpg';
import Logo from 'Img/logo.png';

const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    componentDidMount = () => {
        sessionStorage.clear();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                axios.post('admin/login', JSON.stringify(values)).then(res => {
                    console.log('res cookie == ', res.headers);
                    return res.data;
                }).then(data => {
                    if (data.success) {
                        const backData = data.backData;

                        sessionStorage.setItem('userId', backData.id);
                        sessionStorage.setItem('userName', backData.userName);
                        sessionStorage.setItem('realName', backData.realName);
                        if(backData.File){
                            sessionStorage.setItem('avatar', restUrl.FILE_ASSET + `${backData.File.id + backData.File.fileType}`);
                        }

                        let initUrl = null;
                        // 管理员
                        if (backData.roleId === '000') {
                            initUrl = '/frame/food/list';
                        }
                        // 管理员
                        else if (backData.roleId === '001') {
                            initUrl = '/frame/food/list';
                        }
                        // 民宿店家
                        else if (backData.roleId === '003') {
                            initUrl = '/frame/hotelkeeper/roomList';
                        }
                        // 旅游店家
                        else if (backData.roleId === '004') {
                            initUrl = '/frame/travelkeeper/travelList';
                        } else if (backData.roleId === '005') {
                            initUrl = '/frame/foodkeeper/foodList';
                        } else {
                            this.setState({loading: false});
                            message.error('角色不存在，请与管理员联系！');
                            return;
                        }
                        sessionStorage.setItem('type', backData.roleId);
                        const back_url = window.location.href.split('back_url=')[1];
                        initUrl = back_url && back_url.split('#')[1] || initUrl;

                        return this.context.router.push(initUrl);
                    } else {
                        this.setState({loading: false});
                        message.error(data.backMsg);
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="login">
                <img src={loginBg} className="login-bg"/>
                <div className="backup"></div>
                <div className="login-box">
                    <Row>
                        <Col span={13} style={{height: '400px', backgroundColor: 'rgba(85, 120, 220, .65)'}}>
                            <div style={{margin: '85px 0 40px', textAlign: 'center'}}>
                                <Icon type="windows" theme='filled' style={{fontSize: 90, color: '#fff'}}/>
                            </div>
                            <div
                                style={{paddingTop: 30, textAlign: 'center', fontSize: 20, color: '#fff'}}>无介商城管理系统
                            </div>
                        </Col>
                        <Col span={11} style={{height: '400px', padding: '20px 35px', backgroundColor: '#fff'}}>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <FormItem>
                                    <h1 style={{margin: '15px 0 0 0'}}>欢迎登录</h1>
                                    <p style={{margin: '0', color: '#999'}}>Welcome!</p>
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('userName', {
                                        rules: [{required: true, message: '请输入您的用户名!'}],
                                    })(
                                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               className="login-input" placeholder="用户编码/手机号"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [{required: true, message: '请输入您的密码!'}],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password" className="login-input" placeholder="密码"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        size='large'
                                        htmlType="submit"
                                        className="login-form-button"
                                        loading={this.state.loading}
                                    >登录</Button>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const WrappedLogin = Form.create()(Login);

Login.contextTypes = {
    router: PropTypes.object
}

export default WrappedLogin;
