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
  Message,
  Notification
} from 'antd';
import axios from "Utils/axios";
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import {ZZUpload} from 'Comps/zui';

import '../index.less';
import restUrl from "RestUrl";

const FormItem = Form.Item;

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      loading: false,
      previewImage: ''
    };
  }

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
    axios.get('food/categoryDetail', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        let backData = data.backData;
        this.setFields(backData);
        this.setState({
          data: backData
        });
      } else {
        Message.error('产品信息查询失败');
      }
      this.setState({
        loading: false
      });
    });
  }

  setFields = val => {
    const values = this.props.form.getFieldsValue();
    for (let key in values) {
      if (key === 'productCategoryPic') {
        values[key] = [];
        val[key].map((item, index) => {
          values[key].push({
            uid: index,
            name: item.fileTame,
            status: 'done',
            url: restUrl.ADDR + '/public/' + `${item.id + item.fileType}`,
            thumbUrl: restUrl.ADDR + '/public/' + `${item.id + item.fileType}`,
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

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const { previewImage, previewVisible} = this.state;

    return (
      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>产品管理</Breadcrumb.Item>
              <Breadcrumb.Item>产品类别</Breadcrumb.Item>
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
                    label="头像"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('productCategoryPic', {
                      rules: [{required: true, message: '类别图片不能为空!'}],
                    })(
                      <ZZUpload
                        disabled={true}
                        onPreview={this.handlePreview}
                        onRemove={() => false}
                      >
                        {null}
                      </ZZUpload>
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="类别名称"
                  >
                    {getFieldDecorator('productCategoryName', {
                      rules: [{required: true, message: '请输入类别名称'}]
                    })(
                      <Input disabled/>
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="类别编码"
                  >
                    {getFieldDecorator('productCategoryCode', {
                      rules: [{required: true, message: '请输入产品类别条码'}]
                    })(
                      <Input disabled/>
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="创建人"
                  >
                    {getFieldDecorator('createBy', {
                      rules: [{required: true, message: '请输入产品名称'}],
                      initialValue: sessionStorage.getItem('userName')
                    })(
                      <Input disabled/>
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="修改人"
                  >
                    {getFieldDecorator('updateBy', {
                      rules: [{required: false}]
                    })(
                      <Input disabled/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </div>
    );
  }
}

const foodCategoryDetail = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default foodCategoryDetail;
