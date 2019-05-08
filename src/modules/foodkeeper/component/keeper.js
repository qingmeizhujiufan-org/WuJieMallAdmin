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
    notification,
    message,
    Divider,
    Icon,
    InputNumber,
    Spin,
    Alert
} from 'antd';
import {Upload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import axios from "Utils/axios";
import restUrl from "RestUrl";
import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
    state = {
        data: {},
        headerList: [],
        detailList: [],
        loading: false,
        fileList: [],
        canUpdate: false,
        submitLoading: false
    };

    componentDidMount = () => {
        this.queryDetail();
    }

    queryDetail = () => {
        const param = {};
        param.id = sessionStorage.userId;
        this.setState({
            loading: true
        });
        axios.get('foodKeeper/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setFields(backData);
                this.setState({
                    data: backData
                });
            }

            this.setState({
                loading: false
            });
        });
    }

    setFields = val => {
        const values = this.props.form.getFieldsValue();
        for (let key in values) {
            if (key === 'headerPic' || key === 'detailPic') {
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
            } else if (key === 'state') {
                values[key] = values[key] || 0;
            } else {
                values[key] = val[key];
            }
        }

        this.props.form.setFieldsValue(values);
    }

    validateID = (rule, value, callback) => {
        const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('身份证格式不正确'));
        } else {
            callback();
        }
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
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const data = this.state.data;
                const statusList = ['营业中', '休息中', '下架中'];
                values.thumbnail = values.headerPic[0].response.id;
                values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');
                values.businessStatusText = statusList[values.businessStatus];
                values.createBy = sessionStorage.userName;
                values.id = sessionStorage.userId;

                this.setState({
                    submitLoading: true
                });
                axios.post(data.id ? 'foodKeeper/update' : 'foodKeeper/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '认证信息更新成功！'
                        });
                        this.queryDetail();
                    } else {
                        message.error('认证信息更新失败!');
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
        const {fileList, loading, submitLoading, data} = this.state;
        const info = (data.state === 0 && {type: 'warning', message: '信息已提交，请耐心等待审核！'})
            || (data.state === 1 && {type: 'error', message: '审核不通过，请重新填写资料并提交审核！'})
            || (data.state === 2 && {type: 'success', message: '恭喜！审核已通过~'});

        return (
            <div className="zui-content">
                {
                    data.state >= 0 ? (
                        <Alert type={info.type} message={info.message} banner closable/>
                    ) : null
                }
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>认证管理</Breadcrumb.Item>
                            <Breadcrumb.Item>认证信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>认证信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Spin spinning={loading}>
                            <Form onSubmit={this.handleSubmit}>
                                <Divider>商家描述图</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                        >
                                            {getFieldDecorator('headerPic', {
                                                rules: [{required: true, message: '商家描述图片不能为空!'}],
                                            })(
                                                <Upload/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>基本信息</Divider>
                                <Row>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="商家名称"
                                        >
                                            {getFieldDecorator('foodKeeperName', {
                                                rules: [{
                                                    required: true, message: '请输入商家名称',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="商家地址"
                                        >
                                            {getFieldDecorator('foodKeeperAddress', {
                                                rules: [{required: true, message: '请输入商家地址'}],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="店主姓名"
                                        >
                                            {getFieldDecorator('keeperName', {
                                                rules: [{required: true, message: '请输入店主姓名'}],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="身份证号"
                                        >
                                            {getFieldDecorator('IDNumber', {
                                                rules: [{
                                                    required: true, message: '请输入身份证号',
                                                }, {
                                                    validator: this.validateID,
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="手机号码"
                                        >
                                            {getFieldDecorator('telephone', {
                                                rules: [{
                                                    required: true, message: '请输入手机号码',
                                                }, {
                                                    validator: this.validatePhone,
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="固定号码"
                                        >
                                            {getFieldDecorator('phone', {
                                                rules: [{
                                                    required: false,
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="营业状态"
                                        >
                                            {getFieldDecorator('businessStatus', {
                                                rules: [{
                                                    required: false, message: '请输入营业状态',
                                                }]
                                            })(
                                                <Select placeholder="请选择">
                                                    <Option value={0}>休息中</Option>
                                                    <Option value={1}>营业中</Option>
                                                    <Option value={2}>下架中</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="备注"
                                        >
                                            {getFieldDecorator('mark', {
                                                rules: [{
                                                    required: false
                                                }],
                                            })(
                                                <TextArea/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>商家详情图</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                        >
                                            {getFieldDecorator('detailPic', {
                                                rules: [{required: true, message: '旅游商家详情图片不能为空!'}],
                                            })(
                                                <Upload/>
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

Index.contextTypes = {
    router: PropTypes.object
}

const travelKeeper = Form.create({name: 'travelKeeper'})(Index);

export default travelKeeper;
