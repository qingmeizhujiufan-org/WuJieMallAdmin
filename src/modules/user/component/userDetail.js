import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Breadcrumb, Icon, Button, Modal, Upload, Row, Col, Message} from 'antd';
import {ZZCard} from 'Comps/zz-antD';
import {formItemLayout} from 'Utils/formItemGrid';
import axios from "Utils/axios";
import util from "Utils/util";
import restUrl from 'RestUrl';
import assign from "lodash/assign";
import '../index.less';

const FormItem = Form.Item;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      userInfo: {}
    };
  }

  componentWillMount = () => {
    this.getUserDetail(this.props.params.id)
  }

  //获取用户详细信息
  getUserDetail = (id) => {
    this.setState({
      loading: true
    });
    let param = {};
    param.id = id;
    axios.get('admin/qureyOneUser', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        let backData = data.backData;
        this.setFields(backData);
        this.setState({
          userInfo: backData
        });
      } else {
        Message.error('信息查询失败');
      }
      this.setState({
        loading: false
      });
    })
  }

  setFields = val => {
    const values = this.props.form.getFieldsValue();
    for (let key in values) {
      if (key === 'avatarSrc') {
        values[key] = [];
        if (val[key]) {
          val[key].map((item, index) => {
            values[key].push({
              uid: index,
              name: item.file_name,
              status: 'done',
              url: restUrl.ADDR + '/public/' + `${item.id + item.fileType}`,
              thumbUrl: restUrl.ADDR + '/public/' + `${item.id + item.fileType}`,
              response: {
                id: item.id
              }
            });
          });
        }

      } else {
        values[key] = val[key];
      }
    }
    values.created_at = util.FormatDate(values.created_at);
    values.updated_at = util.FormatDate(values.updated_at);

    this.props.form.setFieldsValue(values);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const mainForm = (
        <Form>
          <Row type='flex' justify='center'>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="用户ID"
              >
                {getFieldDecorator('id')(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户名"
              >
                {getFieldDecorator('userName')(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="真实姓名"
              >
                {getFieldDecorator('realName')(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="密码"
              >
                {getFieldDecorator('password')(
                  <Input type="password" disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="个人电话"
              >
                {getFieldDecorator('phone')(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="创建时间"
              >
                {getFieldDecorator('created_at')(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="更新时间"
              >
                {getFieldDecorator('updated_at')(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="头像"
              >
                {getFieldDecorator('avatarSrc', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  rules: [{required: false, message: '头像不能为空!'}]
                })(
                  <Upload
                    disabled={true}
                    listType="picture-card"
                    onRemove={() => false}
                  >
                  </Upload>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      )
    ;

    return (
      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>用户管理</Breadcrumb.Item>
              <Breadcrumb.Item>用户详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>用户详情</h1>
        </div>
        <div className='pageContent'>
          <ZZCard>
            {mainForm}
          </ZZCard>
        </div>
      </div>
    );
  }
}

const userAdd = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default userAdd;