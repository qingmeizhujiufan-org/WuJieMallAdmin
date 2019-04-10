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
    Icon
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
                values.shopPic = values.shopPic && values.shopPic.map(item => item.response.id).join(',');
                values.shopCertificate = values.shopCertificate && values.shopCertificate.map(item => item.response.id).join(',');

                this.setState({
                    submitLoading: true
                });
                axios.post('shop/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '新增店铺成功！'
                        });

                        return this.context.router.push('/frame/shop/list');
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
        const {fileList, submitLoading} = this.state;

        return (

            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>店铺管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增店铺</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增店铺</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>店铺描述图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('shopPic', {
                                            rules: [{required: false, message: '店铺描述图片不能为空!'}],
                                        })(
                                            <Upload
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChange}
                                            >
                                                {fileList.length >= 5 ? null : <div><Icon type="plus" /> 添加</div>}
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
                                        label="店铺名称"
                                    >
                                        {getFieldDecorator('shopName', {
                                            rules: [{
                                                required: true, message: '请输入店铺名称',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="店铺地址"
                                    >
                                        {getFieldDecorator('shopAddress', {
                                            rules: [{required: true, message: '请输入店铺地址'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="店铺持有人"
                                    >
                                        {getFieldDecorator('shopOwner', {
                                            rules: [{
                                                required: true, message: '请输入店铺持有人',
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
                                        {getFieldDecorator('shopTelephone', {
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
                                        {getFieldDecorator('shopPhone', {
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
                                        label="微信号"
                                    >
                                        {getFieldDecorator('shopWeixin', {
                                            rules: [{
                                                required: true, message: '请输入微信号',
                                            }],
                                        })(
                                            <Input/>
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
                                        label="店铺修改人"
                                    >
                                        {getFieldDecorator('updateBy', {
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
                                        label="店铺状态"
                                    >
                                        {getFieldDecorator('shopStatus', {
                                            rules: [{
                                                required: false, message: '请输入食品状态',
                                            }],
                                            initialValue: 0
                                        })(
                                            <Select placeholder="请选择" disabled>
                                                <Option value={0}>未审核</Option>
                                                <Option value={1}>已审核</Option>
                                                <Option value={2}>已上线</Option>
                                                <Option value={3}>已退回</Option>
                                                <Option value={4}>已下线</Option>
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
                            <Divider>店铺证书详情图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('shopCertificate')(
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
const foodAdd = Form.create()(Index);

export default foodAdd;
