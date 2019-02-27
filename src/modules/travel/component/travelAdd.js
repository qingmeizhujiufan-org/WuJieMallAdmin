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
    InputNumber,
    Divider,
    DatePicker,
    Card,
} from 'antd';
import {ZZDatePicker, ZZUpload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";
import moment from 'moment';

import '../index.less';
import assign from "lodash/assign";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

class Index extends React.Component {
    state = {
        submitLoading: false,
        categoryList: [],
        travelDays: [],
    };

    componentDidMount = () => {
    }

    disabledDate = current => {
        return current && current < moment().endOf('day');
    }

    onRangeChange = date => {
        const diffDays = date[1].diff(date[0], 'day');
        console.log('date === ', date);
        console.log('diffDays === ', diffDays);
        this.props.form.setFieldsValue({
            travelRegionTime: date,
            travelLastTime: `${diffDays + 1}天${diffDays}晚`
        });
        console.log('values === ', this.props.form.getFieldsValue());
        const travelDays = [];
        for (let i = 0; i <= diffDays; i++) {
            let beginDate = new moment(date[0]);
            travelDays.push({
                dayTime: beginDate.add(i, 'days').format('YYYY-MM-DD')
            });
        }

        this.setState({travelDays});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.thumbnail = values.headerPic[0].response.id;
                values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');
                values.travelBeginTime = values.travelRegionTime[0].format('YYYY-MM-DD');
                values.travelEndTime = values.travelRegionTime[1].format('YYYY-MM-DD');
                delete values.travelRegionTime;
                console.log('handleSubmit  param === ', values);
                // return;
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
        const {submitLoading, travelDays} = this.state;

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
                                        label="时间区间"
                                    >
                                        {getFieldDecorator('travelRegionTime', {
                                            rules: [{
                                                required: false, message: '请输入时间区间',
                                            }],
                                        })(
                                            <RangePicker
                                                disabledDate={this.disabledDate}
                                                format="YYYY-MM-DD"
                                                onChange={this.onRangeChange}
                                            />
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
                                            <Input disabled/>
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
                            {
                                travelDays.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <Card title={item.dayTime}>
                                                <Row>
                                                    <Col {...itemGrid}>
                                                        <FormItem
                                                            {...formItemLayout}
                                                            label="起点"
                                                        >
                                                            {getFieldDecorator(`travelDay[${index}].dayFrom`, {
                                                                rules: [{
                                                                    required: true, message: '请输入起点',
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
                                                            {getFieldDecorator(`travelDay[${index}].dayTo`, {
                                                                rules: [{
                                                                    required: true, message: '请输入目的地',
                                                                }]
                                                            })(
                                                                <Input/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col {...itemGrid}>
                                                        <FormItem
                                                            {...formItemLayout}
                                                            label="当日车程"
                                                        >
                                                            {getFieldDecorator(`travelDay[${index}].dayDrive`, {
                                                                rules: [{
                                                                    required: true, message: '请输入当日车程',
                                                                }]
                                                            })(
                                                                <Input/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col {...itemGrid}>
                                                        <FormItem
                                                            {...formItemLayout}
                                                            label="住宿"
                                                        >
                                                            {getFieldDecorator(`travelDay[${index}].dayStay`, {
                                                                rules: [{
                                                                    required: true, message: '请输入住宿',
                                                                }]
                                                            })(
                                                                <Input/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col {...itemGrid}>
                                                        <FormItem
                                                            {...formItemLayout}
                                                            label="包含用餐"
                                                        >
                                                            {getFieldDecorator(`travelDay[${index}].dayDinner`, {
                                                                rules: [{
                                                                    required: true, message: '请输入包含用餐',
                                                                }]
                                                            })(
                                                                <Input/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col {...itemGrid}>
                                                        <FormItem
                                                            {...formItemLayout}
                                                            label="游玩内容"
                                                        >
                                                            {getFieldDecorator(`travelDay[${index}].dayPlay`, {
                                                                rules: [{
                                                                    required: true, message: '请输入游玩内容',
                                                                }]
                                                            })(
                                                                <Input/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            </Card>
                                            <br/>
                                        </div>
                                    )
                                })
                            }
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