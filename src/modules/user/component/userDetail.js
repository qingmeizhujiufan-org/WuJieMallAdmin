import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Breadcrumb, Icon, Button, Modal, Upload, Row, Col} from 'antd';
import {ZZCard} from 'Comps/zz-antD';
import {formItemLayout} from 'Utils/formItemGrid';
import axios from "Utils/axios";
import restUrl from 'RestUrl';
import '../index.less';
import assign from "lodash/assign";

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
        if (backData.assessorys) {
          backData.assessorys.map((item, index) => {
            backData.assessorys[index] = assign({}, item, {
              uid: item.id,
              status: 'done',
              url: restUrl.ADDR + item.path + item.name,
              response: {
                data: item
              }
            });
          });
        } else {
          backData.assessorys = [];
        }

        this.setState({
          userInfo: backData,
          loading: false
        });
      }
    })
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
    const {autoCompleteResult, userInfo} = this.state;

    const mainForm = (
        <Form>
          <Row type='flex' justify='center'>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="用户ID"
              >
                {getFieldDecorator('id', {
                  initialValue: userInfo.id
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户名"
              >
                {getFieldDecorator('user_name', {
                  initialValue: userInfo.user_name
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="真实姓名"
              >
                {getFieldDecorator('real_name', {
                  initialValue: userInfo.real_name
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="密码"
              >
                {getFieldDecorator('user_pwd', {
                  initialValue: userInfo.user_pwd
                })(
                  <Input type="password" disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="个人电话"
              >
                {getFieldDecorator('phone', {
                  initialValue: userInfo.phone
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="创建时间"
              >
                {getFieldDecorator('create_time', {
                  initialValue: userInfo.create_time
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="更新时间"
              >
                {getFieldDecorator('update_time', {
                  initialValue: userInfo.update_time
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="头像"
              >
                {getFieldDecorator('assessorys', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  rules: [{required: false, message: '头像不能为空!'}],
                  initialValue: userInfo.assessorys
                })(
                  <Upload
                    disabled={true}
                    listType="picture-card"
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