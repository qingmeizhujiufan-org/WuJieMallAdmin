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
    Rate
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
        const id = this.props.params.id;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        axios.get('hotel/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setFields(backData);
                this.setState({
                    data: backData
                });
            } else {
                message.error('食品信息查询失败');
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
            } else {
                values[key] = val[key];
            }
        }

        this.props.form.setFieldsValue(values);
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
                this.setState({
                    submitLoading: true
                });
                axios.post('hotel/update', {
                    id: this.state.data.id,
                    grade: values.grade
                }).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '保存成功！'
                        });

                        this.queryDetail();
                    } else {
                        message.error(data.backMsg);
                    }
                }).finally(() => this.setState({submitLoading: false}));
            }
        });
    }

    submit = val => {
        const data = this.state.data;
        data.state = val;
        const values = {
            id: data.id,
            state: val
        };

        axios.post('hotel/update', values).then(res => res.data).then(data => {
            if (data.success) {
                notification.success({
                    message: '提示',
                    description: '审核房间信息成功！'
                });

                return this.context.router.goBack();
            } else {
                message.error('审核失败，请重试！');
            }
            this.setState({
                submitLoading: false
            });
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {fileList, loading, submitLoading, data} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>特色民宿管理</Breadcrumb.Item>
                            <Breadcrumb.Item>民宿列表</Breadcrumb.Item>
                            <Breadcrumb.Item>审核民宿信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>审核民宿信息</h1>
                </div>
                <div className='pageContent'>
                    <Form onSubmit={this.handleSubmit}>
                        <div className='ibox-content'>
                            <Divider>评分</Divider>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="商家评分"
                                    >
                                        {getFieldDecorator('grade', {
                                            rules: [{required: true, message: '商家评分不能为空!'}],
                                        })(
                                            <Rate/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <Button type="primary" htmlType="submit">确定</Button>
                                </Col>
                            </Row>
                        </div>
                        <br/>
                        <div className='ibox-content'>
                            <Divider>民宿描述图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('headerPic', {
                                            rules: [{required: true, message: '民宿店铺描述图片不能为空!'}],
                                        })(
                                            <Upload disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>基本信息</Divider>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="民宿名称"
                                    >
                                        {getFieldDecorator('hotelName', {
                                            rules: [{
                                                required: true, message: '请输入民宿名称',
                                            }],
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="民宿地址"
                                    >
                                        {getFieldDecorator('hotelAddress', {
                                            rules: [{required: true, message: '请输入民宿地址'}],
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="民宿类型"
                                    >
                                        {getFieldDecorator('hotelType', {
                                            rules: [{
                                                required: true, message: '请输入民宿持有人',
                                            }],
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value={0}>经济型</Option>
                                                <Option value={1}>舒适型</Option>
                                                <Option value={2}>豪华型</Option>
                                                <Option value={3}>特色型</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="负责人姓名"
                                    >
                                        {getFieldDecorator('keeperName')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="身份证号码"
                                    >
                                        {getFieldDecorator('IDNumber')(
                                            <Input disabled/>
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
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="固定号码"
                                    >
                                        {getFieldDecorator('hotelPhone', {
                                            rules: [{
                                                required: false,
                                            }],
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="起步价"
                                    >
                                        {getFieldDecorator('initialCharge', {
                                            rules: [{
                                                required: true, message: '请输入起步价',
                                            }],
                                        })(
                                            <InputNumber
                                                disabled
                                                min={0}
                                                precision={2}
                                                step={1}
                                                style={{width: '100%'}}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="店铺创建人"
                                    >
                                        {getFieldDecorator('createBy', {
                                            rules: [{
                                                required: false,
                                            }],
                                            initialValue: sessionStorage.getItem('userName')
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="民宿状态"
                                    >
                                        {getFieldDecorator('hotelStatus', {
                                            rules: [{
                                                required: false, message: '请输入食品状态',
                                            }],
                                            initialValue: 0
                                        })(
                                            <Select placeholder="请选择" disabled>
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
                                            <TextArea disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>民宿营业证件相关图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('detailPic', {
                                            rules: [{required: true, message: '民宿营业证件相关图片不能为空!'}],
                                        })(
                                            <Upload disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" style={{marginTop: 40}}>
                                <Button size='large' style={{width: 120, marginRight: 40}}
                                        onClick={() => this.submit(1)}>不通过</Button>
                                <Button type="primary" size='large' style={{width: 120}}
                                        onClick={() => this.submit(2)}>通过</Button>
                            </Row>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

const hotelAdd = Form.create({name: 'hotelAdd'})(Index);

export default hotelAdd;
