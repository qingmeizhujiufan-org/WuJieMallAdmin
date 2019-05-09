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
    message,
    notification,
    InputNumber,
    Divider,
} from 'antd';
import {DatePicker, Upload} from 'Comps/zui';
import axios from "Utils/axios";
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import '../index.less';
import restUrl from "RestUrl";
import assign from "lodash/assign";

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            headerList: [],
            detailList: [],
            categoryList: [],
            loading: false,
            submitLoading: false
        };
    }

    componentDidMount = () => {
        this.queryDetail();
        this.queryAllCategoryList();

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

    queryDetail = () => {
        const id = this.props.params.id;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        axios.get('food/queryDetail', {
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
            } else {
                values[key] = val[key];
            }
        }

        this.props.form.setFieldsValue(values);
    }

    submit = val => {
        const values = {
            id: this.props.params.id,
            state: val
        };

        axios.post('food/check', values).then(res => res.data).then(data => {
            if (data.success) {
                notification.success({
                    message: '提示',
                    description: '审核食品信息成功！'
                });

                return this.context.router.goBack();
            } else {
                message.error('审核失败，请重试！');
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {loading, submitLoading, categoryList} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>食品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>食品列表</Breadcrumb.Item>
                            <Breadcrumb.Item>更新食品信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>更新食品信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Spin spinning={loading}>
                            <Form onSubmit={this.handleSubmit}>
                                <Divider>食品示意图</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                        >
                                            {getFieldDecorator('headerPic', {
                                                rules: [{required: true, message: '头像不能为空!'}],
                                            })(
                                                <Upload disabled/>
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
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="食品分类"
                                        >
                                            {getFieldDecorator('foodCategoryId', {
                                                rules: [{
                                                    required: false, message: '请选择分类',
                                                }]
                                            })(
                                                <Select placeholder="请选择" disabled>
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
                                            label="食品编码"
                                        >
                                            {getFieldDecorator('foodCode', {
                                                rules: [{required: false, message: '请输入食品编码'}],
                                            })(
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                    disabled
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
                                                    disabled
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <TextArea disabled/>
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
                                                <TextArea disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="修改时间"
                                        >
                                            {getFieldDecorator('updated_at')(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="创建时间"
                                        >
                                            {getFieldDecorator('created_at')(
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
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
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="淘宝链接"
                                        >
                                            {getFieldDecorator('taobaoUrl')(
                                                <TextArea disabled/>
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
                                                <Upload disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" style={{marginTop: 40}}>
                                    <Button size='large' style={{width: 120, marginRight: 40}}
                                            onClick={() => this.submit(1)}>不通过</Button>
                                    <Button type="primary" size='large' style={{width: 120}}
                                            onClick={() => this.submit(2)}>通过</Button>
                                </Row>
                            </Form>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}

const foodEdit = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default foodEdit;
