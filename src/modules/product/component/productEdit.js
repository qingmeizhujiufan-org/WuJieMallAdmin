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
    Spin,
    Message,
    Notification,
    InputNumber, Divider, Upload, Icon
} from 'antd';
import axios from "Utils/axios";
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import '../index.less';
import restUrl from "RestUrl";

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

const uploadUrl = restUrl.BASE_HOST + 'attachment/upload';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            fileList: [],
            loading: false,
            submitLoading: false
        };
    }

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
        axios.get('product/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setFields(backData);
                this.setState({
                    data: backData
                });
            } else {
                Message.error('产品信息查询失败');
            }
            this.setState({
                loading: false
            });
        });
    }

    setFields = value => {
        this.props.form.setFieldsValue(value);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = this.props.params.id;
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                axios.post('product/save', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '产品信息保存成功！'
                        });

                        return this.context.router.push('/frame/product/list');
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
        const {data, fileList, loading, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>产品列表</Breadcrumb.Item>
                            <Breadcrumb.Item>更新产品信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>更新产品信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Spin spinning={loading}>
                            <Form onSubmit={this.handleSubmit}>
                                <Divider>基本信息</Divider>
                                <Row>
                                    <Col {...itemGrid} style={{display: 'none'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="商家ID"
                                        >
                                            {getFieldDecorator('shop_id', {initialValue: '123456789'})(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品分类"
                                        >
                                            {getFieldDecorator('product_category_id', {
                                                rules: [{
                                                    required: false, message: '请选择分类',
                                                }],
                                                initialValue: '123'
                                            })(
                                                <Select placeholder="请选择">
                                                    <Option value='0'>1</Option>
                                                    <Option value='1'>2</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品编码"
                                        >
                                            {getFieldDecorator('product_code', {
                                                rules: [{required: false, message: '请输入产品编码'}],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品名称"
                                        >
                                            {getFieldDecorator('product_name', {
                                                rules: [{
                                                    required: true, message: '请输入产品名称',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品简介"
                                        >
                                            {getFieldDecorator('product_summary', {
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
                                            label="售价"
                                        >
                                            {getFieldDecorator('product_sellingprice', {
                                                rules: [{
                                                    required: false, message: '请输入售价',
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
                                            label="成本价格"
                                        >
                                            {getFieldDecorator('product_costprice', {
                                                rules: [{
                                                    required: true, message: '请输入成本价格',
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
                                            label="产品单位"
                                        >
                                            {getFieldDecorator('product_unit', {
                                                rules: [{
                                                    required: false, message: '请输入产品单位',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品规格"
                                        >
                                            {getFieldDecorator('product_unit', {
                                                rules: [{
                                                    required: false, message: '请输入产品规格',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品型号"
                                        >
                                            {getFieldDecorator('product_model', {
                                                rules: [{
                                                    required: false, message: '请输入产品型号',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产品状态"
                                        >
                                            {getFieldDecorator('product_state', {
                                                rules: [{
                                                    required: false, message: '请输入产品状态',
                                                }],
                                                initialValue: 0
                                            })(
                                                <Select placeholder="请选择" disabled>
                                                    <Option value={0}>未上架</Option>
                                                    <Option value={1}>已上架</Option>
                                                    <Option value={2}>已删除</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="配送范围"
                                        >
                                            {getFieldDecorator('distribution_scope', {
                                                rules: [{
                                                    required: false, message: '请输入配送范围',
                                                }],
                                            })(
                                                <TextArea/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="备注"
                                        >
                                            {getFieldDecorator('memo', {
                                                rules: [{
                                                    required: false
                                                }],
                                            })(
                                                <TextArea/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>产品参数</Divider>
                                <Row>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="产地"
                                        >
                                            {getFieldDecorator('product_origin', {
                                                rules: [{
                                                    required: false, message: '请输入产品产地',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="食用办法"
                                        >
                                            {getFieldDecorator('product_usage', {
                                                rules: [{
                                                    required: false, message: '请输入产品食用办法',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="贮藏办法"
                                        >
                                            {getFieldDecorator('product_storage', {
                                                rules: [{
                                                    required: false, message: '请输入产品贮藏办法',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="口味"
                                        >
                                            {getFieldDecorator('product_taste', {
                                                rules: [{
                                                    required: false, message: '请输入产品口味',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="口味"
                                        >
                                            {getFieldDecorator('product_taste', {
                                                rules: [{
                                                    required: false, message: '请输入产品口味',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="品牌"
                                        >
                                            {getFieldDecorator('product_taste', {
                                                rules: [{
                                                    required: false, message: '请输入产品品牌',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="配料"
                                        >
                                            {getFieldDecorator('product_batching', {
                                                rules: [{
                                                    required: false, message: '请输入产品配料',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="保质期"
                                        >
                                            {getFieldDecorator('product_date', {
                                                rules: [{
                                                    required: false, message: '请输入产品保质期',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="净含量"
                                        >
                                            {getFieldDecorator('product__net_weight', {
                                                rules: [{
                                                    required: false, message: '请输入产品净含量',
                                                }],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>产品详情</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                        >
                                            {getFieldDecorator('picSrc', {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.normFile,
                                                rules: [{required: false, message: '头像不能为空!'}],
                                            })(
                                                <Upload
                                                    // headers={{
                                                    //     'X-Auth-Token': sessionStorage.token
                                                    // }}
                                                    action={uploadUrl}
                                                    listType="picture-card"
                                                    onChange={this.handleChange}
                                                >
                                                    {fileList.length >= 1 ? null :
                                                        <div><Icon type="plus"/> 上传</div>}
                                                </Upload>
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

const productEdit = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default productEdit;