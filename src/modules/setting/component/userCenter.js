import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Form,
    Input,
    Breadcrumb,
    Button,
    Icon,
    Tabs,
    message,
    notification
} from 'antd';
import {Upload} from 'Comps/zui';
import restUrl from 'RestUrl';
import '../index.less';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import axios from "Utils/axios";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class DetailForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            imageUrl: '',
            fileList: [],
            loading: false,
            roleList: [],
            submitLoading: false,
            init: false,
        };
    }

    componentDidMount = () => {
    }

    componentWillReceiveProps = nextProps => {
        if ('data' in nextProps && nextProps['data'] && !this.state.init) {
            this.setFields(nextProps['data']);
        }
    }

    handleChange = fileList => {
        this.setState({fileList});
    }

    setFields = val => {
        const values = this.props.form.getFieldsValue();
        for (let key in values) {
            if (key === 'avatarSrc') {
                values[key] = [];
                val[key].map((item, index) => {
                    values[key].push({
                        uid: index,
                        name: item.fileName,
                        status: 'done',
                        url: restUrl.FILE_ASSET + `${item.id + item.fileType}`,
                        thumbUrl: restUrl.FILE_ASSET + `${item.id + item.fileType}`,
                        response: {
                            id: item.id
                        }
                    });
                });
                this.setState({fileList: values[key]});
            } else {
                values[key] = val[key];
            }
        }
        this.setState({init: true}, () => {
            this.props.form.setFieldsValue(values);
        });
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
                const avatarSrc = values.avatarSrc;
                values.id = sessionStorage.userId;
                values.avatarSrc = values.avatarSrc && values.avatarSrc.map(item => item.response.id).join(',');
                console.log('avatarSrc == ', avatarSrc);
                this.setState({
                    submitLoading: true
                });
                axios.post('admin/updateUser', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '用户信息保存成功！'
                        });
                        sessionStorage.setItem('avatar', avatarSrc[0].thumbUrl);
                        this.queryDetail();
                    } else {
                        message.error(data.backMsg);
                    }
                }).finally(() => this.setState({submitLoading: false}));
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {fileList, submitLoading} = this.state;
        return (
            <div className='userCenter'>
                <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                    <Row type="flex" justify="center">
                        <Col span={8}>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="用户名"
                                    >
                                        {getFieldDecorator('realName', {
                                            rules: [{required: true, message: '请输入用户名'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="个人电话"
                                    >
                                        {getFieldDecorator('phone', {
                                            rules: [{required: true, message: '请输入个人电话'}, {
                                                validator: this.validatePhone,
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <FormItem
                                        label="创建时间"
                                    >
                                        {getFieldDecorator('created_at')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label="头像"
                            >
                                {getFieldDecorator('avatarSrc', {
                                    rules: [{required: false, message: '头像不能为空!'}]
                                })(
                                    <Upload
                                        listType="picture-card"
                                        onChange={this.handleChange}
                                    >
                                        {fileList.length === 0 ? <Button>
                                            <Icon type="upload"/> 上传头像
                                        </Button> : null}
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" style={{marginTop: 40}}>
                        <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                loading={submitLoading}>保存</Button>
                    </Row>
                </Form>
            </div>
        )
    }
}

DetailForm = Form.create({})(DetailForm);

class PasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false
        };
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
                const data = this.props.data;
                if (values.oldPassword !== data.password) {
                    message.error('旧密码不对，请重新填写');
                    return;
                }
                if (values.newPassword.length < 6) {
                    message.error('新密码位数不能少于6位');
                    return;
                }
                this.setState({
                    submitLoading: true
                });
                axios.post('admin/updateUser', {
                    id: sessionStorage.userId,
                    password: values.newPassword
                }).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '用户密码更新成功！'
                        });
                        sessionStorage.setItem('avatar', avatarSrc[0].thumbUrl);
                        this.queryDetail();
                    } else {
                        message.error(data.backMsg);
                    }
                }).finally(() => this.setState({submitLoading: false}));
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {submitLoading} = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row type="flex" justify="center" style={{marginTop: 40}}>
                    <Col {...itemGrid}>
                        <FormItem
                            {...formItemLayout}
                            label="旧密码"
                        >
                            {getFieldDecorator('oldPassword', {
                                rules: [{required: true, message: '请输入旧密码'}],
                            })(
                                <Input type='password' autoComplete='false'/>
                            )}
                        </FormItem>

                    </Col>
                    <Col {...itemGrid}>
                        <FormItem
                            {...formItemLayout}
                            label="新密码"
                        >
                            {getFieldDecorator('newPassword', {
                                initialValue: '',
                                rules: [{required: true, message: '请输入新密码'}],
                            })(
                                <Input type='password' autoComplete='false'/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="center" style={{marginTop: 40}}>
                    <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                            loading={submitLoading}>保存</Button>
                </Row>
            </Form>
        )
    }
}

PasswordForm = Form.create({})(PasswordForm);

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null
        };
    }

    componentDidMount = () => {
        this.queryDetail();
    }

    queryDetail = () => {
        const id = sessionStorage.userId;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        axios.get('admin/qureyOneUser', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setState({
                    data: backData,
                    loading: false
                });
            } else {
                message.error('用户信息查询失败');
            }
        });
    }

    render() {
        const {data} = this.state;
        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>个人管理</Breadcrumb.Item>
                            <Breadcrumb.Item>个人中心</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>个人中心</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span><Icon type="setting"/>个人信息</span>} key="1">
                                <DetailForm data={data}/>
                            </TabPane>
                            <TabPane tab={<span><Icon type="lock"/>修改密码</span>} key="2">
                                <PasswordForm data={data}/>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
