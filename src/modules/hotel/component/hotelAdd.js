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
    Icon, InputNumber
} from 'antd';
import {Upload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import axios from "Utils/axios";
import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
    state = {
        fileList: [],
        submitLoading: false,
        categoryList: []
    };

    componentDidMount = () => {

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
                console.log('handleSubmit  param === ', values);
                const typeList = ['经济型', '舒适型', '豪华型', '特色型'];
                const statusList = ['营业中', '休息中', '下架中'];
                values.thumbnail = values.headerPic[0].response.id;
                values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');
                values.hotelType = values.hotelType;
                values.hotelTypeText = typeList[values.hotelType];
                values.hotelStatus = values.hotelStatus;
                values.hotelStatusText = statusList[values.hotelStatus];

                this.setState({
                    submitLoading: true
                });
                axios.post('hotel/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '新增店铺成功！'
                        });

                        return this.context.router.push('/frame/hotel/list');
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
        const {fileList, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>特色民宿管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增民宿店铺</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增民宿店铺</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>民宿描述图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('headerPic', {
                                            rules: [{required: false, message: '民宿店铺描述图片不能为空!'}],
                                        })(
                                            <Upload
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChange}
                                            >
                                                {fileList.length >= 5 ? null : <div><Icon type="plus"/> 添加</div>}
                                            </Upload>
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
                                            <Input/>
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
                                            <Input/>
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
                                            <Select placeholder="请选择">
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
                                        {getFieldDecorator('hotelPhone', {
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
                                        label="起步价"
                                    >
                                        {getFieldDecorator('initialCharge', {
                                            rules: [{
                                                required: true, message: '请输入起步价',
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
                                            <Select placeholder="请选择">
                                                <Option value={0}>营业中</Option>
                                                <Option value={1}>休息中</Option>
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
                            <Divider>民宿详情图</Divider>
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

Index.contextTypes = {
    router: PropTypes.object
}

const hotelAdd = Form.create({name: 'hotelAdd'})(Index);

export default hotelAdd;
