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
    Notification,
    Message,
    InputNumber,
    Divider,
} from 'antd';
import {ZZDatePicker, ZZUpload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";

import '../index.less';
import assign from "lodash/assign";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
    state = {
        submitLoading: false,
        categoryList: []
    };

    componentDidMount = () => {
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('handleSubmit  param === ', values);
                values.thumbnail = values.headerPic[0].response.id;
                values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');

                this.setState({
                    submitLoading: true
                });
                axios.post('travel/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '新增主题旅游成功！'
                        });

                        return this.context.router.push('/frame/travel/list');
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
        const {submitLoading} = this.state;

        return (

            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>主题旅游管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增旅游</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增旅游</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>旅游示意图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('headerPic', {
                                            rules: [{required: true, message: '示意图不能为空!'}],
                                        })(
                                            <ZZUpload/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>基本信息</Divider>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="旅游主题名称"
                                    >
                                        {getFieldDecorator('travelTheme', {
                                            rules: [{
                                                required: true, message: '请输入主题名称',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="咨询电话"
                                    >
                                        {getFieldDecorator('telephone', {
                                            rules: [{
                                                required: true, message: '请输入咨询电话',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="限制人数"
                                    >
                                        {getFieldDecorator('travelLimiteNumber', {
                                            rules: [{
                                                required: true, message: '请输入限制人数',
                                            }],
                                        })(
                                            <InputNumber
                                                min={1}
                                                precision={0}
                                                step={1}
                                                style={{width: '100%'}}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="旅游开始时间"
                                    >
                                        {getFieldDecorator('travelBeginTime', {
                                            rules: [{
                                                required: false, message: '请输入旅游开始时间',
                                            }],
                                        })(
                                            <ZZDatePicker/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="旅游结束时间"
                                    >
                                        {getFieldDecorator('travelEndTime', {
                                            rules: [{
                                                required: false, message: '请输入旅游结束时间',
                                            }],
                                        })(
                                            <ZZDatePicker/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="旅游价格"
                                    >
                                        {getFieldDecorator('travelPrice', {
                                            rules: [{
                                                required: false, message: '请输入旅游价格',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>行程介绍</Divider>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="出发地"
                                    >
                                        {getFieldDecorator('travelFrom', {
                                            rules: [{
                                                required: false, message: '请输入出发地',
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="目的地"
                                    >
                                        {getFieldDecorator('travelTo', {
                                            rules: [{
                                                required: false, message: '请输入目的地',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="旅游用车"
                                    >
                                        {getFieldDecorator('travelUsecar', {
                                            rules: [{
                                                required: false
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="旅游时间"
                                    >
                                        {getFieldDecorator('travelLastTime', {
                                            rules: [{
                                                required: false, message: '请输入产品简介',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="包含元素"
                                    >
                                        {getFieldDecorator('travelHas', {
                                            rules: [{
                                                required: false, message: '请输入包含元素',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="旅游详情介绍"
                                    >
                                        {getFieldDecorator('travelDesc', {
                                            rules: [{
                                                required: false
                                            }],
                                        })(
                                            <TextArea/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>图文介绍</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('detailPic')(
                                            <ZZUpload/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>行程详情</Divider>
                            <Divider>旅游须知</Divider>
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

const TravelAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default TravelAdd;