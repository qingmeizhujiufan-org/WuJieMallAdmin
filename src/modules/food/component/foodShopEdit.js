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
    InputNumber,
    Spin
} from 'antd';
import {Upload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import axios from "Utils/axios";
import restUrl from "RestUrl";
import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
    state = {
        data: {},
        headerList: [],
        detailList: [],
        loading: false,
        fileList: [],
        canUpdate: false,
        submitLoading: false
    };

    componentDidMount = () => {
        this.queryDetail();
    }

    queryDetail = () => {
        const param = {};
        param.id = this.props.params.id;
        this.setState({
            loading: true
        });
        axios.get('foodKeeper/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setFields(backData);
                this.setState({
                    data: backData
                });
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

    validatePhone = (rule, value, callback) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    submit = val => {
        const values = {
            id: this.state.data.id,
            state: val
        };

        axios.post('foodKeeper/check', values).then(res => res.data).then(data => {
            if (data.success) {
                notification.success({
                    message: '提示',
                    description: '审核食品商家成功！'
                });

                return this.context.router.goBack();
            } else {
                message.error('审核失败，请重试！');
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {loading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>认证管理</Breadcrumb.Item>
                            <Breadcrumb.Item>认证信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>认证信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Spin spinning={loading}>
                            <Form onSubmit={this.handleSubmit}>
                                <Divider>商家描述图</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                        >
                                            {getFieldDecorator('headerPic')(
                                                <Upload disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>基本信息</Divider>
                                <Row>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="商家名称"
                                        >
                                            {getFieldDecorator('foodKeeperName')(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="商家地址"
                                        >
                                            {getFieldDecorator('foodKeeperAddress')(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="负责人姓名"
                                        >
                                            {getFieldDecorator('keeperName')(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="身份证号"
                                        >
                                            {getFieldDecorator('IDNumber')(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="手机号码"
                                        >
                                            {getFieldDecorator('telephone')(
                                                <Input disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="固定号码"
                                        >
                                            {getFieldDecorator('phone', {
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
                                            label="营业状态"
                                        >
                                            {getFieldDecorator('businessStatus')(
                                                <Select disabled>
                                                    <Option value={0}>休息中</Option>
                                                    <Option value={1}>营业中</Option>
                                                    <Option value={2}>下架中</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="审核状态"

                                        >
                                            {getFieldDecorator('state')(
                                                <Select disabled>
                                                    <Option value={0}>未审核</Option>
                                                    <Option value={1}>审核不通过</Option>
                                                    <Option value={2}>审核通过</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="备注"
                                        >
                                            {getFieldDecorator('mark')(
                                                <TextArea disabled/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>旅游商家详情图</Divider>
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

Index.contextTypes = {
    router: PropTypes.object
}

const foodKeeperEdit = Form.create({name: 'foodKeeper'})(Index);

export default foodKeeperEdit;
