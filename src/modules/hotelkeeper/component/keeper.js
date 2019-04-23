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
    param.id = sessionStorage.userId;
    this.setState({
      loading: true
    });
    axios.get('hotel/queryDetail', {
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

  validateID = (rule, value, callback) => {
    const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (value && value !== '' && !reg.test(value)) {
      callback(new Error('身份证格式不正确'));
    } else {
      callback();
    }
  }

  validatePhone = (rule, value, callback) => {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (value && value !== '' && !reg.test(value)) {
      callback(new Error('手机号格式不正确'));
    } else {
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = this.state.data;
        const typeList = ['经济型', '舒适型', '豪华型', '特色型'];
        const statusList = ['营业中', '休息中', '下架中'];
        values.id = sessionStorage.userId;
        values.thumbnail = values.headerPic[0].response.id;
        values.headerPic = values.headerPic && values.headerPic.map(item => item.response.id).join(',');
        values.detailPic = values.detailPic && values.detailPic.map(item => item.response.id).join(',');
        values.hotelType = values.hotelType;
        values.hotelTypeText = typeList[values.hotelType];
        values.hotelStatus = values.hotelStatus;
        values.hotelStatusText = statusList[values.hotelStatus];
        values.id = sessionStorage.userId;
        values.createBy = sessionStorage.userName;

        this.setState({
          submitLoading: true
        });
        axios.post(data.id ? 'hotel/update' : 'hotel/add', values).then(res => res.data).then(data => {
          if (data.success) {
            notification.success({
              message: '提示',
              description: '认证信息更新成功，请等待审核！'
            });
            this.queryDetail();
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
    const {fileList, loading, submitLoading, data} = this.state;

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
                <Divider>民宿描述图</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem
                    >
                      {getFieldDecorator('headerPic', {
                        rules: [{required: true, message: '民宿店铺描述图片不能为空!'}],
                      })(
                        <Upload/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Divider>基本信息</Divider>
                <Row>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="民宿名称"
                    >
                      {getFieldDecorator('hotelName', {
                        rules: [{
                          required: true, message: '请输入民宿名称',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="民宿地址"
                    >
                      {getFieldDecorator('hotelAddress', {
                        rules: [{required: true, message: '请输入民宿地址'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="民宿类型"
                    >
                      {getFieldDecorator('hotelType', {
                        rules: [{
                          required: true, message: '请输入民宿持有人',
                        }],
                      })(
                        <Select placeholder="请选择">
                          <Option value={0}>经济型</Option>
                          <Option value={1}>舒适型</Option>
                          <Option value={2}>豪华型</Option>
                          <Option value={3}>特色型</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="负责人姓名"
                    >
                      {getFieldDecorator('keeperName', {
                        rules: [{required: true, message: '请输入负责人姓名'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="身份证号"
                    >
                      {getFieldDecorator('IDNumber', {
                        rules: [{
                          required: true, message: '请输入身份证号',
                        }, {
                          validator: this.validateID,
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="手机号码"
                    >
                      {getFieldDecorator('telephone', {
                        rules: [{
                          required: true, message: '请输入手机号码',
                        }, {
                          validator: this.validatePhone,
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="固定号码"
                    >
                      {getFieldDecorator('hotelPhone', {
                        rules: [{
                          required: false,
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="起步价"
                    >
                      {getFieldDecorator('initialCharge', {
                        rules: [{
                          required: true, message: '请输入起步价',
                        }],
                      })(
                        <InputNumber
                          min={0}
                          precision={2}
                          step={1}
                          style={{width: '100%'}}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="民宿状态"
                    >
                      {getFieldDecorator('hotelStatus', {
                        rules: [{
                          required: false, message: '请输入食品状态',
                        }],
                        initialValue: 0
                      })(
                        <Select placeholder="请选择">
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
                      label="备注"
                    >
                      {getFieldDecorator('mark', {
                        rules: [{
                          required: false
                        }],
                      })(
                        <TextArea/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Divider>民宿营业证件相关图</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem
                    >
                      {getFieldDecorator('detailPic', {
                        rules: [{required: true, message: '民宿营业证件相关图片不能为空!'}],
                      })(
                        <Upload/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" justify="center" style={{marginTop: 40}}>
                  <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                          loading={submitLoading}>保存</Button>
                  {
                    data.hotelStatus === 2 ?
                      <Button type="danger" size='large'
                              style={{width: 120, marginLeft: 20}}>删除</Button> :
                      null
                  }
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

const hotelAdd = Form.create({name: 'hotelAdd'})(Index);

export default hotelAdd;
