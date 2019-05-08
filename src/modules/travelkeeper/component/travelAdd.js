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
    Card,
    Empty,
    Alert, Modal
} from 'antd';
import {DatePicker, Upload, Editor} from 'Comps/zui';
import {EditorState, convertToRaw} from 'draft-js';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";
import moment from 'moment';

import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

class Index extends React.Component {
    state = {
        submitLoading: false,
        categoryList: [],
        travelDays: [],
        expenseDesc: EditorState.createEmpty(),
        lineInfo: EditorState.createEmpty(),
        checkStatus: 0
    };

    componentDidMount = () => {
        this.queryDetail();
    }

    disabledDate = current => {
        return current && current < moment().endOf('day');
    }

    queryDetail = () => {
        const _this = this;
        const param = {};
        param.id = sessionStorage.userId;
        this.setState({
            loading: true
        });
        axios.get('travelKeeper/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;
                if (backData.state !== 2) {
                    Modal.info({
                        title: '提示',
                        content: '认证通过前暂不能添加旅游信息，请耐心等待审核结果！',
                        onOk() {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve();
                                    _this.context.router.push('/frame/travelkeeper/keeper');
                                }, 1000);
                            }).catch(() => {
                            });
                        }
                    });
                }
            } else {
                message.error('获取商家信息失败，将自动跳转到认证信息页');
                setTimeout(() => {
                    this.context.router.push('/frame/travelkeeper/keeper');
                }, 1000);
            }
        });
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

    onExpenseDescChange = value => {
        this.setState({expenseDesc: value});
    }

    onLineInfoChange = value => {
        this.setState({lineInfo: value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {travelDays, expenseDesc, lineInfo} = this.state;
                values.travelkeeperId = sessionStorage.userId;
                values.thumbnail = values.headerPic[0].response.id;
                values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');
                values.travelBeginTime = values.travelRegionTime[0].format('YYYY-MM-DD');
                values.travelEndTime = values.travelRegionTime[1].format('YYYY-MM-DD');
                values.travelDay.map((item, index) => {
                    values.travelDay[index].dayTime = travelDays[index].dayTime;
                });
                delete values.travelRegionTime;
                values.expenseDesc = JSON.stringify(convertToRaw(expenseDesc.getCurrentContent()));
                values.lineInfo = JSON.stringify(convertToRaw(lineInfo.getCurrentContent()));
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                axios.post('travel/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '新增主题旅游成功！'
                        });

                        return this.context.router.push('/frame/travelkeeper/travelList');
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
        const {submitLoading, travelDays, checkStatus} = this.state;

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
                                                required: true, message: '请输入时间区间',
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
                                                required: false, message: '请输入旅游时间',
                                            }],
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="成年人价格"
                                    >
                                        {getFieldDecorator('manPrice', {
                                            rules: [{
                                                required: false, message: '请输入成年人价格',
                                            }],
                                        })(
                                            <InputNumber
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
                                        label="未成年人价格"
                                    >
                                        {getFieldDecorator('childPrice', {
                                            rules: [{
                                                required: false, message: '请输入未成年人价格',
                                            }],
                                        })(
                                            <InputNumber
                                                min={0}
                                                precision={2}
                                                step={1}
                                                style={{width: '100%'}}
                                            />
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
                                        label="线路玩法"
                                    >
                                        {getFieldDecorator('linePlay', {
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
                                            <Upload/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>行程详情</Divider>
                            {
                                travelDays.length > 0 ? travelDays.map((item, index) => {
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
                                }) : (<div><Empty description='请选择时间区间'/></div>)
                            }
                            <Divider>旅游须知</Divider>
                            <Row gutter={48}>
                                <Col span={12}>
                                    <Divider>费用说明</Divider>
                                    <Editor onEditorStateChange={this.onExpenseDescChange}/>
                                </Col>
                                <Col span={12}>
                                    <Divider>路线说明</Divider>
                                    <Editor onEditorStateChange={this.onLineInfoChange}/>
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

const TravelAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default TravelAdd;
