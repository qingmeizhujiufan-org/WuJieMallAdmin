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
    Modal
} from 'antd';
import {Upload, InputNumber} from 'Comps/zui';
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
        this.queryDetail();
    }

    queryDetail = () => {
        const _this = this;
        const param = {};
        param.id = sessionStorage.userId;

        axios.get('hotel/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;
                if (backData.state !== 2) {
                    Modal.info({
                        title: '提示',
                        content: '认证通过前暂不能添加房间信息，请耐心等待审核结果！',
                        onOk() {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve();
                                    _this.context.router.push('/frame/hotelkeeper/keeper');
                                }, 1000);
                            }).catch(() => {
                            });
                        }
                    });
                }
            } else {
                message.error('获取商家信息失败，将自动跳转到认证信息页');
                setTimeout(() => {
                    this.context.router.push('/frame/hotelkeeper/keeper');
                }, 1000);
            }
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

    handleChange = fileList => {
        this.setState({fileList});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.thumbnail = values.detailPic[0].response.id;
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');
                values.hotelId = sessionStorage.userId;

                this.setState({
                    submitLoading: true
                });
                axios.post('room/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '新增房间成功！'
                        });

                        return this.context.router.goBack();
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
                            <Breadcrumb.Item>民宿房间管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增民宿房间</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增民宿房间</h1>
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
                                                required: true
                                                , message: '民宿房间描述图片不能为空!'
                                            }],
                                        })(
                                            <Upload
                                                multiple={false}
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
                                        label="房间名称"
                                    >
                                        {getFieldDecorator('roomName', {
                                            rules: [{required: true, message: '请输入房间名称'}],
                                        })(
                                            <Input/>
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
                                            <Input/>
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
                                            <InputNumber min={1}/>
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
                                            <InputNumber min={1}/>
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
                                            initialValue: 1
                                        })(
                                            <InputNumber min={1}/>
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
                                            <Select placeholder="请选择">
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
                                            <Input/>
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
                                            <Select placeholder="请选择">
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
                                            <Input/>
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
                                            <Select placeholder="请选择">
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
                                            <Input/>
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
                                            <Input/>
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
                                            initialValue: '无'
                                        })(
                                            <TextArea/>
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

const roomAdd = Form.create({name: 'roomAdd'})(Index);

export default roomAdd;
