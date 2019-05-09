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
    Divider, Modal,
} from 'antd';
import {DatePicker, Upload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";

import '../index.less';
import assign from "lodash/assign";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
    state = {
        submitLoading: false,
        categoryList: []
    };

    componentDidMount = () => {
        this.queryDetail();
        this.queryAllCategoryList();
    }

    queryDetail = () => {
        const _this = this;
        const param = {};
        param.id = sessionStorage.userId;

        axios.get('foodKeeper/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;
                if(backData.state !== 2) {
                    Modal.info({
                        title: '提示',
                        content: '认证通过前暂不能添加食品信息，请耐心等待审核结果！',
                        onOk() {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve();
                                    _this.context.router.push('/frame/foodkeeper/keeper');
                                }, 1000);
                            }).catch(() => {});
                        }
                    });
                }
            } else {
                message.error('获取商家信息失败，将自动跳转到认证信息页');
                setTimeout(() => {
                    this.context.router.push('/frame/foodkeeper/keeper');
                }, 1000);
            }
        });
    }

    queryAllCategoryList = () => {
        const {params, keyWords} = this.state;
        const param = assign({}, params, {keyWords});
        axios.get('food/queryAllCategoryList', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData && data.backData.length !== 0) {
                    const categoryList = data.backData;
                    this.setState({
                        categoryList: categoryList
                    })
                } else {
                    message.error('当前没有食品分类，请先添加食品分类');
                }
            } else {
                message.error('查询列表失败');
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('handleSubmit  param === ', values);
                values.foodkeeperId = sessionStorage.userId;
                values.thumbnail = values.headerPic[0].response.id;
                values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
                values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');

                this.setState({
                    submitLoading: true
                });
                axios.post('food/add', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '新增食品成功！'
                        });

                        return this.context.router.push('/frame/foodkeeper/foodList');
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
        const {submitLoading, categoryList} = this.state;

        return (

            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>食品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增食品</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增食品</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>食品示意图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('headerPic', {
                                            rules: [{required: true, message: '头像不能为空!'}],
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
                                        label="食品分类"
                                    >
                                        {getFieldDecorator('foodCategoryId', {
                                            rules: [{
                                                required: true, message: '请选择分类',
                                            }],
                                        })(
                                            <Select placeholder="请选择">
                                                {
                                                    categoryList.map(item => {
                                                        return (<Option key={item.id}
                                                                        value={item.id}>{item.foodCategoryName}</Option>)
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="食品许可证"
                                    >
                                        {getFieldDecorator('foodCode', {
                                            rules: [{required: true, message: '请输入食品许可证'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="食品名称"
                                    >
                                        {getFieldDecorator('foodName', {
                                            rules: [{
                                                required: true, message: '请输入食品名称',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="食品简介"
                                    >
                                        {getFieldDecorator('foodSummary', {
                                            rules: [{
                                                required: false, message: '请输入食品简介',
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
                                        {getFieldDecorator('foodSellingprice', {
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
                                        {getFieldDecorator('foodCostprice', {
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
                                        label="厂名"
                                    >
                                        {getFieldDecorator('foodUnit', {
                                            rules: [{
                                                required: false, message: '请输入厂名',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="食品规格"
                                    >
                                        {getFieldDecorator('foodSpec', {
                                            rules: [{
                                                required: false, message: '请输入食品规格',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="食品型号"
                                    >
                                        {getFieldDecorator('foodModel', {
                                            rules: [{
                                                required: false, message: '请输入食品型号',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="食品状态"
                                    >
                                        {getFieldDecorator('foodState', {
                                            rules: [{
                                                required: false, message: '请输入食品状态',
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
                                        label="无介评语"
                                    >
                                        {getFieldDecorator('mark', {
                                            rules: [{
                                                required: true, message: '请填写无介评语'
                                            }],
                                        })(
                                            <TextArea/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>食品参数</Divider>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="产地"
                                    >
                                        {getFieldDecorator('foodOrigin', {
                                            rules: [{
                                                required: false, message: '请输入食品产地',
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
                                        {getFieldDecorator('foodUsage', {
                                            rules: [{
                                                required: false, message: '请输入食品食用办法',
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
                                        {getFieldDecorator('foodStorage', {
                                            rules: [{
                                                required: false, message: '请输入食品贮藏办法',
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
                                        {getFieldDecorator('foodTaste', {
                                            rules: [{
                                                required: false, message: '请输入食品口味',
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
                                        {getFieldDecorator('foodBrand', {
                                            rules: [{
                                                required: false, message: '请输入食品品牌',
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
                                        {getFieldDecorator('foodBatching', {
                                            rules: [{
                                                required: false, message: '请输入食品配料',
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
                                        {getFieldDecorator('foodDate', {
                                            rules: [{
                                                required: false, message: '请输入食品保质期',
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="净含量"
                                    >
                                        {getFieldDecorator('foodNetWeight', {
                                            rules: [{
                                                required: false, message: '请输入食品净含量',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="淘宝链接"
                                    >
                                        {getFieldDecorator('taobaoUrl', {
                                            rules: [{
                                                required: true, message: '请填写淘宝链接'
                                            }],
                                        })(
                                            <TextArea/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Divider>食品详情图</Divider>
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
};

const foodAdd = Form.create()(Index);

export default foodAdd;
