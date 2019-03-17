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
    message,
    notification
} from 'antd';
import axios from "Utils/axios";
import restUrl from 'RestUrl';
import util from "Utils/util";
import {Upload} from 'Comps/zui';
import assign from 'lodash/assign';
import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            fileList: [],
            confirmDirty: false,
            roleList: [],
            loading: false,
            roleLoading: false,
            submitLoading: false
        };
    }

    componentDidMount = () => {
        this.queryDetail();
        this.queryRole();
    }

    queryDetail = () => {
        const id = this.props.params.id;
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
                this.setFields(backData);
                this.setState({
                    data: backData,
                    fileList: backData.avatarSrc
                });
            } else {
                Message.error('用户信息查询失败');
            }
            this.setState({
                loading: false
            });
        });
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
                        url: restUrl.ADDR + '/public/' + `${item.id + item.fileType}`,
                        thumbUrl: restUrl.ADDR + '/public/' + `${item.id + item.fileType}`,
                        response: {
                            id: item.id
                        }
                    });
                });
            } else {
                values[key] = val[key];
            }
        }
        values.created_at = util.FormatDate(values.created_at);
        this.props.form.setFieldsValue(values);
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
                Message.error(data.backMsg);
            }
            this.setState({roleLoading: false});
        });
    }

    handleChange = ({fileList}) => {
        console.log(fileList)
        this.setState({fileList})
    }

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
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
                values.id = this.props.params.id;
                values.update_by = sessionStorage.getItem('userName');

                values.avatarSrc = values.avatarSrc.map(item => item.response.id).join(',');

                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                axios.post('admin/updateUser', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '用户信息保存成功！'
                        });

                        return this.context.router.push('/frame/user/list');
                    } else {
                        Message.error(data.backMsg);
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
        const {data, fileList, roleList, loading, roleLoading, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                            <Breadcrumb.Item>用户列表</Breadcrumb.Item>
                            <Breadcrumb.Item>更新用户信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>更新用户信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Spin spinning={loading} size='large'>
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            label="头像"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('avatarSrc', {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.normFile,
                                                rules: [{required: false, message: '头像不能为空!'}]
                                            })(
                                                <Upload
                                                    listType={'picture'}
                                                    onChange={this.handleChange}
                                                >
                                                    {fileList.length >= 1 ? null :
                                                        <Button><Icon type="upload"/>上传</Button>}
                                                </Upload>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
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
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="用户编码"
                                        >
                                            {getFieldDecorator('id', {
                                                rules: [{required: true, message: '请输入用户编码'}]
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="用户名"
                                        >
                                            {getFieldDecorator('userName', {
                                                rules: [{required: true, message: '请输入用户名'}]
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="真实姓名"
                                        >
                                            {getFieldDecorator('realName', {
                                                rules: [{required: true, message: '请输入真实姓名'}]
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="个人电话"
                                        >
                                            {getFieldDecorator('phone', {
                                                rules: [{required: true, message: '请输入个人电话'}, {
                                                    validator: this.validatePhone
                                                }]
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="创建时间"
                                        >
                                            {getFieldDecorator('created_at', {
                                                rules: [{required: false}]
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="创建时间"
                                        >
                                            {getFieldDecorator('updated_at', {
                                                rules: [{required: false}]
                                            })(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" style={{marginTop: 40}}>
                                    <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                            loading={submitLoading}>保存</Button>
                                </Row>
                            </Form>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}

const userEdit = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default userEdit;
