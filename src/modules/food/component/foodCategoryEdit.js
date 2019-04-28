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
      loading: false,
      submitLoading: false,
      fileList: []
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
          data: backData,
          fileList: backData.foodCategoryPic
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
      if (key === 'foodCategoryPic') {
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
    this.props.form.setFieldsValue(values);
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
        values.id = this.props.params.id;
        values.updateBy = sessionStorage.userName;
        this.setState({
          submitLoading: true
        });
        axios.post('food/categoryUpdate', values).then(res => res.data).then(data => {
          if (data.success) {
            notification.success({
              message: '提示',
              description: '食品分类更新成功！'
            });
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

const foodCategoryEdit = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default foodCategoryEdit;
