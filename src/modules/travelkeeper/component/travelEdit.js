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
} from 'antd';
import {DatePicker, Upload, Editor} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";
import moment from 'moment';

import '../index.less';
import assign from "lodash/assign";
import {EditorState, convertFromRaw, convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

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
        axios.get('travel/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;
                if (backData.expenseDesc && backData.expenseDesc !== '') {
                    let expenseDesc = backData.expenseDesc;
                    expenseDesc = draftToHtml(JSON.parse(expenseDesc));
                    const contentBlock = htmlToDraft(expenseDesc);
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);

                    this.setState({expenseDesc: editorState});
                }
                if (backData.lineInfo && backData.lineInfo !== '') {
                    let lineInfo = backData.lineInfo;
                    lineInfo = draftToHtml(JSON.parse(lineInfo));
                    const contentBlock = htmlToDraft(lineInfo);
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);

                    this.setState({lineInfo: editorState});
                }
                this.setFields(backData);
                this.setState({travelDays: backData.TravelDays});
            } else {
                message.error('旅游信息查询失败');
            }
            this.setState({
                loading: false
            });
        });
    }

    setFields = val => {
        const {getFieldsValue} = this.props.form;
        const values = getFieldsValue();

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
            } else if (key === 'travelRegionTime') {
                values[key] = [new moment(val['travelBeginTime']), new moment(val['travelEndTime'])];
            } else {
                values[key] = val[key];
            }
        }
        console.log('values == ', values);
        this.props.form.setFieldsValue(values);
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
                const {expenseDesc, lineInfo} = this.state;
                values.id = this.props.params.id;
                values.travelkeeperId = sessionStorage.userId;
                values.thumbnail = values.headerPic[0].response.id;
                values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');
                values.expenseDesc = JSON.stringify(convertToRaw(expenseDesc.getCurrentContent()));
                values.lineInfo = JSON.stringify(convertToRaw(lineInfo.getCurrentContent()));
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                axios.post('travel/update', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '更新主题旅游信息成功！'
                        });
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
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const {submitLoading, travelDays, expenseDesc, lineInfo} = this.state;
        const dayFormItems = (travelDays || []).map((item, index) => (
            <div key={index}>
                <Card title={item.dayTime}>
                    <Row>
                        <Col {...itemGrid} className='zui-hidden'>
                            <FormItem
                                {...formItemLayout}
                                label="id"
                            >
                                {getFieldDecorator(`travelDay[${index}].id`, {
                                    initialValue: item.id
                                })(
                                    <Input disabled className='zui-hidden'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...itemGrid} className='zui-hidden'>
                            <FormItem
                                {...formItemLayout}
                                label="travelId"
                            >
                                {getFieldDecorator(`travelDay[${index}].travelId`, {
                                    initialValue: item.travelId
                                })(
                                    <Input disabled className='zui-hidden'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...itemGrid}>
                            <FormItem
                                {...formItemLayout}
                                label="起点"
                            >
                                {getFieldDecorator(`travelDay[${index}].dayFrom`, {
                                    rules: [{
                                        required: true, message: '请输入起点',
                                    }],
                                    initialValue: item.dayFrom
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
                                    }],
                                    initialValue: item.dayTo
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
                                    }],
                                    initialValue: item.dayDrive
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
                                    }],
                                    initialValue: item.dayStay
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
                                    }],
                                    initialValue: item.dayDinner
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
                                    }],
                                    initialValue: item.dayPlay
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
                <br/>
            </div>
        ));

        return (

            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>主题旅游管理</Breadcrumb.Item>
                            <Breadcrumb.Item>更新旅游</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>更新旅游信息</h1>
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
                                                disabled
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
                                                required: false, message: '请输入食品简介',
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
                            {dayFormItems}
                            <Divider>旅游须知</Divider>
                            <Row gutter={48}>
                                <Col span={12}>
                                    <Divider>费用说明</Divider>
                                    <Editor editorState={expenseDesc} onEditorStateChange={this.onExpenseDescChange}/>
                                </Col>
                                <Col span={12}>
                                    <Divider>路线说明</Divider>
                                    <Editor editorState={lineInfo} onEditorStateChange={this.onLineInfoChange}/>
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

const TravelEdit = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default TravelEdit;
