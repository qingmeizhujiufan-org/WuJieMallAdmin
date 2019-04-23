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
    Icon,
    notification,
    message,
    Divider,
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
        loading: false,
        submitLoading: false,
        categoryList: [],
        fileList: [],
        certificateFileList: []
    };

    componentDidMount = () => {
        this.queryDetail()
    }

    queryDetail = () => {
        const id = this.props.params.id;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        axios.get('shop/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData;
                this.setFields(backData);
                this.setState({
                    data: backData
                });
            } else {
                Message.error('食品信息查询失败');
            }
            this.setState({
                loading: false
            });
        });
    }

    validatePhone = (rule, value, callback) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    setFields = val => {
        const values = this.props.form.getFieldsValue();
        for (let key in values) {
            if (key === 'shopPic' || key === 'shopCertificate') {
                values[key] = [];
                val[key].map((item, index) => {
                    values[key].push({
                        uid: index,
                        name: item.fileTame,
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
        values['updateBy'] = sessionStorage.getItem('userName');
        this.props.form.setFieldsValue(values);
    }

    handleShopPicChange = (fileList) => {
        this.setState({fileList})
    }

    handleShopCertificateChange = (fileList) => {
        this.setState({certificateFileList: fileList})
    }

  submit = val => {
    const data = this.state.data;
    data.state = val;
    const values = {
      id: data.id,
      state: val
    };

    axios.post('shop/update', values).then(res => res.data).then(data => {
      if (data.success) {
        notification.success({
          message: '提示',
          description: '审核房间信息成功！'
        });

        return this.context.router.goBack();
      } else {
        message.error('审核失败，请重试！');
      }
      this.setState({
        submitLoading: false
      });
    });
  }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('handleSubmit  param === ', values);
                values.id = this.props.params.id;
                values.shopPic = values.shopPic && values.shopPic.map(item => item.response.id).join(',');
                values.shopCertificate = values.shopCertificate && values.shopCertificate.map(item => item.response.id).join(',');

                this.setState({
                    submitLoading: true
                });
                axios.post('shop/update', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '修改店铺成功！'
                        });

                        return this.context.router.push('/frame/shop/list');
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
        const {submitLoading, certificateFileList, fileList} = this.state;
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
                            <Breadcrumb.Item>店铺管理</Breadcrumb.Item>
                            <Breadcrumb.Item>店铺审核</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>店铺审核</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>店铺描述图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('shopPic', {
                                            rules: [{required: false, message: '店铺描述图片不能为空!'}],
                                        })(
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
                                        label="店铺名称"
                                    >
                                        {getFieldDecorator('shopName')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="店铺地址"
                                    >
                                        {getFieldDecorator('shopAddress')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="店铺持有人"
                                    >
                                        {getFieldDecorator('shopOwner')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                              <Col {...itemGrid}>
                                <FormItem
                                  {...formItemLayout}
                                  label="身份证号码"
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
                                        {getFieldDecorator('shopTelephone')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="固定号码"
                                    >
                                        {getFieldDecorator('shopPhone')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="微信号"
                                    >
                                        {getFieldDecorator('shopWeixin')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="店铺创建人"
                                    >
                                        {getFieldDecorator('createBy')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="店铺修改人"
                                    >
                                        {getFieldDecorator('updateBy')(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="店铺状态"
                                    >
                                        {getFieldDecorator('shopStatus')(
                                            <Select placeholder="请选择" disabled>
                                                <Option value={0}>未审核</Option>
                                                <Option value={1}>已审核</Option>
                                                <Option value={2}>已上线</Option>
                                                <Option value={3}>已退回</Option>
                                                <Option value={4}>已下线</Option>
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
                            <Divider>店铺证书详情图</Divider>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('shopCertificate')(
                                            <Upload disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                          <Row type="flex" justify="center" style={{marginTop: 40}}>
                            <Button size='large' style={{width: 120, marginRight: 40}} onClick={() => this.submit(1)}>不通过</Button>
                            <Button type="primary" size='large' style={{width: 120}} onClick={() => this.submit(2)}>通过</Button>
                          </Row>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

const foodAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default foodAdd;
