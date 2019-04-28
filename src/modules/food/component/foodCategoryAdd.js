import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Form,
    Input,
    Breadcrumb,
    Button,
    Modal,
    Icon,
    message,
    notification
} from 'antd';
import axios from "Utils/axios";
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import {Upload} from 'Comps/zui/index';

import '../index.less';
import restUrl from "RestUrl";

const FormItem = Form.Item;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            previewVisible: false,
            previewImage: '',
            submitLoading: false,
            fileList: []
        };
    }

    componentDidMount = () => {

    }

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = (fileList) => {
        this.setState({fileList})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.foodCategoryPic) {
                    values.foodCategoryPic = values.foodCategoryPic.map(item => item.response.id).join(',');
                }
                values.createBy = sessionStorage.userName;
                this.setState({
                    submitLoading: true
                });
                axios.post('food/categoryAdd', values).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '食品分类添加成功！'
                        });

                        return this.context.router.push('/frame/food/categoryList');
                    } else {
                        message.error(data.backMsg);
                    }
                }).finally(() => {
                    this.setState({
                        submitLoading: false
                    });
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {fileList, submitLoading, previewImage, previewVisible} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>食品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>食品类别</Breadcrumb.Item>
                            <Breadcrumb.Item>新增类别</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增类别</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        label="类别图"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('foodCategoryPic', {
                                            rules: [{required: true, message: '类别图片不能为空!'}],
                                        })(
                                            <Upload
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChange}
                                            >
                                                {fileList.length >= 1 ? null : uploadButton}
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="类别名称"
                                    >
                                        {getFieldDecorator('foodCategoryName', {
                                            rules: [{required: true, message: '请输入类别名称'}]
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="类别编码"
                                    >
                                        {getFieldDecorator('foodCategoryCode', {
                                            rules: [{required: true, message: '请输入食品类别条码'}]
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" style={{marginTop: 40}}>
                                <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                        loading={submitLoading}>保存</Button>
                            </Row>
                        </Form>
                    </div>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </div>
            </div>
        );
    }
}

const foodCategoryAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default foodCategoryAdd;
