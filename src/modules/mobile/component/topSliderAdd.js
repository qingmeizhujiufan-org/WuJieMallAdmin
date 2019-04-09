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
    Icon
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
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            submitLoading: false
        };
    }

    componentDidMount = () => {
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('handleSubmit  param === ', values);
                values.imgId = values.imgId && values.imgId.map(item => item.response.id).join(',');

                this.setState({
                    submitLoading: true
                });
                axios.post('app/addTopSlider', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: data.backMsg
                        });

                        // return this.context.router.push('/frame/food/list');
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
                                        {getFieldDecorator('foodLink', {
                                            rules: [{
                                                required: true, message: '请选择食品',
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
