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
    Upload,
    Icon
} from 'antd';
import {ZZDatePicker} from 'Comps/zzLib';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";

import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

const uploadUrl = restUrl.BASE_HOST + 'attachment/upload';

class Index extends React.Component {
    state = {
        headerList: [],
        detailList: [],
        submitLoading: false,
    };

    onHeaderChange = ({fileList}) => this.setState({headerList: fileList})

    onDetailChange = ({fileList}) => this.setState({detailList: fileList})

    normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e && e.fileList;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('handleSubmit  param === ', values);
                values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');

                this.setState({
                    submitLoading: true
                });
                axios.post('product/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '新增产品成功！'
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
        const {fileList, submitLoading} = this.state;

        return (

            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增产品</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增产品</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>产品示意图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('headerPic', {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile,
                                            rules: [{required: false, message: '头像不能为空!'}],
                                        })(
                                            <Upload
                                                action={uploadUrl}
                                                listType="picture-card"
                                                multiple
                                                onChange={this.onHeaderChange}
                                            >
                                                <div><Icon type="plus"/> 上传</div>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>基本信息</Divider>
                            <Row>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="商家ID"
                                    >
                                        {getFieldDecorator('shopId', {initialValue: '123456789'})(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="产品分类"
                                    >
                                        {getFieldDecorator('productCategoryId', {
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
                                        {getFieldDecorator('productCode', {
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
                                        {getFieldDecorator('productName', {
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
                                        {getFieldDecorator('productSummary', {
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
                                        {getFieldDecorator('productSellingprice', {
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
                                        {getFieldDecorator('productCostprice', {
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
                                        {getFieldDecorator('product_spec', {
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
                                        {getFieldDecorator('distributionScope', {
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
                            <Divider>产品参数</Divider>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="产地"
                                    >
                                        {getFieldDecorator('productOrigin', {
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
                                        {getFieldDecorator('productUsage', {
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
                                        {getFieldDecorator('productStorage', {
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
                                        {getFieldDecorator('productTaste', {
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
                                        {getFieldDecorator('productBrand', {
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
                                        {getFieldDecorator('productBatching', {
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
                                        {getFieldDecorator('productDate', {
                                            rules: [{
                                                required: false, message: '请输入产品保质期',
                                            }],
                                        })(
                                            <ZZDatePicker/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="净含量"
                                    >
                                        {getFieldDecorator('productNetWeight', {
                                            rules: [{
                                                required: false, message: '请输入产品净含量',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>产品详情图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('detailPic', {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile
                                        })(
                                            <Upload
                                                action={uploadUrl}
                                                listType="picture-card"
                                                multiple
                                                onChange={this.onDetailChange}
                                            >
                                                <div><Icon type="plus"/> 上传</div>
                                            </Upload>
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

const productAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default productAdd;