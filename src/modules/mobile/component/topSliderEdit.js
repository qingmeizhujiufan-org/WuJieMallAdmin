import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Form,
    Input,
    Breadcrumb,
    Button,
    notification,
    message,
    Icon
} from 'antd';
import {DatePicker, Upload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";

import '../index.less';
import _assign from "lodash/assign";

const FormItem = Form.Item;
const {TextArea} = Input;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
        axios.get('app/queryTopSliderDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;

                this.setFields(backData);
                this.setState({
                    data: backData
                });
            } else {
                message.error('产品信息查询失败');
            }
            this.setState({
                loading: false
            });
        });
    }

    setFields = val => {
        const values = this.props.form.getFieldsValue();
        for (let key in values) {
            if (key === 'imgId') {
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('handleSubmit  param === ', values);
                values.id = this.props.params.id;
                values.imgId = values.imgId && values.imgId.map(item => item.response.id).join(',');

                this.setState({
                    submitLoading: true
                });
                axios.post('app/updateTopSlider', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: data.backMsg
                        });

                        // return this.context.router.push('/frame/food/list');
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
                            <Breadcrumb.Item>APP管理</Breadcrumb.Item>
                            <Breadcrumb.Item>顶部轮播图列表</Breadcrumb.Item>
                            <Breadcrumb.Item>修改顶部轮播图</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>修改顶部轮播图</h1>
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
                                        {getFieldDecorator('imgId', {
                                            rules: [{required: false, message: '图片不能为空!'}],
                                        })(
                                            <Upload
                                                listType={'picture'}
                                                onChange={this.handleChange}
                                            >
                                                {fileList.length >= 1 ? null :
                                                    <Button><Icon type="upload"/> 上传</Button>}
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="产品链接"
                                    >
                                        {getFieldDecorator('productLink', {
                                            rules: [{
                                                required: true, message: '请选择商品',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="描述"
                                    >
                                        {getFieldDecorator('desc', {
                                            rules: [{
                                                required: false, message: '请输入真实姓名'
                                            }]
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

const TopSliderAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default TopSliderAdd;
