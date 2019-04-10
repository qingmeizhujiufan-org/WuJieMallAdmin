import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    Select,
    Breadcrumb,
    Button,
    notification,
    message,
    Divider,
    Icon
} from 'antd';
import {Upload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import axios from "Utils/axios";
import restUrl from "RestUrl"
import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
    state = {
        data: {},
        fileList: [],
        submitLoading: false,
        categoryList: [],
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
        axios.get('room/queryDetail', {
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
            if (key === 'detailPic') {
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

        this.props.form.setFieldsValue(values);
    }

    submit = val => {
        const data = this.state.data;
        data.state = val;
        const values = {
            id: data.id,
            state: val
        };

        axios.post('room/update', values).then(res => res.data).then(data => {
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

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>特色民宿管理</Breadcrumb.Item>
                            <Breadcrumb.Item>民宿房间管理</Breadcrumb.Item>
                            <Breadcrumb.Item>审核民宿房间信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>审核民宿房间信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>房间描述图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('detailPic', {
                                            rules: [{
                                                required: true, message: '民宿房间描述图片不能为空!'
                                            }],
                                        })(
                                            <Upload
                                                disabled
                                                multiple={false}
                                                onRemove={() => false}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>基本信息</Divider>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="房间名称"
                                    >
                                        {getFieldDecorator('roomName', {
                                            rules: [{required: true, message: '请输入房间名称'}],
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="房间状态"
                                    >
                                        {getFieldDecorator('roomStatus', {
                                            rules: [{required: true, message: '请选择房间状态'}],
                                            initialValue: 0
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value={0}>可预订</Option>
                                                <Option value={1}>已满房</Option>
                                                <Option value={2}>已下架</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="床型"
                                    >
                                        {getFieldDecorator('bedModel', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value='1.5米单人床'>1.5米单人床</Option>
                                                <Option value='1.8米双人床'>1.8米双人床</Option>
                                                <Option value='2米圆床'>2米圆床</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="房间价格"
                                    >
                                        {getFieldDecorator('roomPrice', {
                                            rules: [{required: true, message: '请输入房间价格'}],
                                        })(
                                            <InputNumber min={1} disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="房间大小"
                                    >
                                        {getFieldDecorator('roomSize', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                        })(
                                            <InputNumber min={1} disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="可住人数"
                                    >
                                        {getFieldDecorator('stayPersonNum', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                        })(
                                            <InputNumber min={1} disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="网络"
                                    >
                                        {getFieldDecorator('internet', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                            initialValue: '免费WIFI'
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value='免费WIFI'>免费WIFI</Option>
                                                <Option value='有线网络'>有线网络</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="窗景"
                                    >
                                        {getFieldDecorator('windowScenery', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                            initialValue: '无'
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="窗户"
                                    >
                                        {getFieldDecorator('window', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                            initialValue: '有窗'
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value='有窗'>有窗</Option>
                                                <Option value='无床'>无窗</Option>
                                                <Option value='部分有窗'>部分有窗</Option>
                                                <Option value='内窗'>内窗</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="卫浴"
                                    >
                                        {getFieldDecorator('bathroom', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                            initialValue: '独立卫浴免费洗浴用品'
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="早餐"
                                    >
                                        {getFieldDecorator('breakfast', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                            initialValue: '含双早'
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value='含双早'>含双早</Option>
                                                <Option value='含单早'>含单早</Option>
                                                <Option value='不含'>不含</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="饮品"
                                    >
                                        {getFieldDecorator('drink', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                            initialValue: '矿泉水两瓶'
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="其他设施"
                                    >
                                        {getFieldDecorator('facilities', {
                                            rules: [{required: true, message: '请输入房间类型'}],
                                            initialValue: '无'
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="支付方式"
                                    >
                                        {getFieldDecorator('payType', {
                                            initialValue: '到店支付'
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value='在线支付'>在线支付</Option>
                                                <Option value='到店支付'>到店支付</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="可否取消"
                                    >
                                        {getFieldDecorator('canCancel', {
                                            initialValue: '您在下单后变更或取消收取全额的定金。'
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value='支持取消'>支持取消</Option>
                                                <Option value='您在下单后变更或取消收取全额的定金。'>您在下单后变更或取消收取全额的定金。</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="可否加床"
                                    >
                                        {getFieldDecorator('canAddbed', {
                                            initialValue: '不可加床'
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value='不可加床'>不可加床</Option>
                                                <Option value='可以加床'>可以加床</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="内宾"
                                    >
                                        {getFieldDecorator('innerNeed', {
                                            rules: [{
                                                required: true, message: '请输入手机号码',
                                            }],
                                            initialValue: '须大陆身份证入住'
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="优惠政策"
                                    >
                                        {getFieldDecorator('sale', {
                                            rules: [{
                                                required: false,
                                            }],
                                            initialValue: 'VIP可享受全额房价9折优惠'
                                        })(
                                            <TextArea disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" style={{marginTop: 40}}>
                                <Button size='large' style={{width: 120, marginRight: 40}} onClick={() => this.submit(1)}>不通过</Button>
                                <Button type="primary" size='large' style={{width: 120}} onClick={() => this.submit(2)}>通过</Button>
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

const roomEdit = Form.create({name: 'roomEdit'})(Index);

export default roomEdit;
