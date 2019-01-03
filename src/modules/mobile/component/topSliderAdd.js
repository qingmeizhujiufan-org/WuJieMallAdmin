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
    Divider, Icon, Spin, Tooltip,
} from 'antd';
import {ZZDatePicker, ZZUpload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";

import '../index.less';
import assign from "lodash/assign";
import productAdd from "../../product/component/productAdd";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
    state = {
        fileList: [],
        submitLoading: false
    };

    componentDidMount = () => {
        this.queryAllCategoryList();
    }

    queryAllCategoryList = () => {
        const {params, keyWords} = this.state;
        const param = assign({}, params, {keyWords});
        axios.get('product/queryAllCategoryList', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData && data.backData.length !== 0) {
                    const categoryList = data.backData;
                    this.setState({
                        categoryList: categoryList
                    })
                } else {
                    Message.error('当前没有产品分类，请先添加产品分类');
                }
            } else {
                Message.error('查询列表失败');
            }
        });
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
                            <Breadcrumb.Item>APP管理</Breadcrumb.Item>
                            <Breadcrumb.Item>顶部轮播图列表</Breadcrumb.Item>
                            <Breadcrumb.Item>添加顶部轮播图</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>添加顶部轮播图</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        label="图片"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('avatarSrc', {
                                            rules: [{required: false, message: '图片不能为空!'}],
                                        })(
                                            <ZZUpload
                                                listType={'picture'}
                                                onChange={this.handleChange}
                                            >
                                                {fileList.length >= 1 ? null :
                                                    <Button><Icon type="upload"/> 上传</Button>}
                                            </ZZUpload>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户名"
                                    >
                                        {getFieldDecorator('userName', {
                                            rules: [{
                                                required: true, message: '请输入用户名',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="真实姓名"
                                    >
                                        {getFieldDecorator('realName', {
                                            rules: [{
                                                required: true, message: '请输入真实姓名'
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="个人电话"
                                    >
                                        {getFieldDecorator('phone', {
                                            rules: [{required: true, message: '请输入个人电话'}, {
                                                validator: this.validatePhone,
                                            }],
                                        })(
                                            <Input/>
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

const TopSliderAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default TopSliderAdd;