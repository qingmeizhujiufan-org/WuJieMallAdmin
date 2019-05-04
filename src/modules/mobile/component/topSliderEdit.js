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
    Icon,
    Spin,
    AutoComplete, Select
} from 'antd';
import {DatePicker, Upload} from 'Comps/zui';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import restUrl from 'RestUrl';
import axios from "Utils/axios";

import '../index.less';
import _assign from "lodash/assign";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            dataSource: [],
            loading: false,
            foodLoading: false,
            submitLoading: false
        };
    }

    componentDidMount = () => {
        this.queryDetail();
        this.queryFoodList();
    }

    queryFoodList = () => {
        const param = {
            pageNumber: 1,
            pageSize: 9999,
            state: 2
        };
        this.setState({foodLoading: true});
        axios.get('food/queryAdminList', {params: param}).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    const dataSource = backData.content;
                    dataSource.map(item => item.key = item.id);

                    this.setState({
                        dataSource: dataSource
                    });
                } else {
                    this.setState({
                        dataSource: []
                    });
                }
            } else {
                message.error('查询列表失败');
            }
        }).finally(() => {
            this.setState({foodLoading: false});
        });
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
        const {fileList, dataSource, foodLoading, submitLoading} = this.state;
        const children = dataSource.map(item => <Option key={item.id}>{item.foodName}</Option>);
        console.log('children == ', children);

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
                                        label="食品链接"
                                    >
                                        <Spin spinning={foodLoading} indicator={<Icon type="loading" spin />}>
                                            {getFieldDecorator('foodLink', {
                                                rules: [{
                                                    required: true, message: '请选择食品',
                                                }],
                                            })(
                                                <AutoComplete>{children}</AutoComplete>
                                            )}
                                        </Spin>
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
