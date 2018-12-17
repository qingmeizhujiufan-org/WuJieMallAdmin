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
  Spin,
  Message,
  Notification,
  InputNumber,
  Divider,
} from 'antd';
import {ZZDatePicker, ZZUpload} from 'Comps/zzLib';
import axios from "Utils/axios";
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import '../index.less';
import restUrl from "RestUrl";
import assign from "lodash/assign";

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      headerList: [],
      detailList: [],
      categoryList: [],
      loading: false,
      submitLoading: false
    };
  }

  componentDidMount = () => {
    this.queryDetail();
    this.queryAllCategoryList();

  }

  queryAllCategoryList = () => {
    const {params, keyWords} = this.state;
    const param = assign({}, params, {keyWords});
    axios.get('product/queryAllCategoryList', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        if (data.backData && data.backData.length !== 0) {
          const categoryList = data.backData;
          this.setState({
            categoryList: categoryList
          })
        } else {
          Message.error('当前没有产品分类，请先添加产品分类');
        }
      } else {
        Message.error('查询列表失败');
      }
    });
  }

  queryDetail = () => {
    const id = this.props.params.id;
    const param = {};
    param.id = id;
    this.setState({
      loading: true
    });
    axios.get('product/queryDetail', {
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
      if (key === 'headerPic' || key === 'detailPic') {
        values[key] = [];
        val[key].map((item, index) => {
          values[key].push({
            uid: index,
            name: item.file_name,
            status: 'done',
            url: restUrl.ADDR + '/public/' + `${item.id + item.file_type}`,
            thumbUrl: restUrl.ADDR + '/public/' + `${item.id + item.file_type}`,
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('handleSubmit  param === ', values);
        values.id = this.props.params.id;
        values.headerPic = values.headerPic.map(item => item.response.id).join(',');
        values.detailPic = values.detailPic.map(item => item.response.id).join(',');

        this.setState({
          submitLoading: true
        });
        axios.post('product/update', values).then(res => res.data).then(data => {
          if (data.success) {
            Notification.success({
              message: '提示',
              description: data.backMsg
            });
            // this.queryDetail();
            // return this.context.router.push('/frame/product/list');
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
    const {loading, submitLoading, categoryList} = this.state;

    return (
      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>产品管理</Breadcrumb.Item>
              <Breadcrumb.Item>产品列表</Breadcrumb.Item>
              <Breadcrumb.Item>更新产品信息</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>更新产品信息</h1>
        </div>
        <div className='pageContent'>
          <div className='ibox-content'>
            <Spin spinning={loading}>
              <Form onSubmit={this.handleSubmit}>
                <Divider>产品示意图</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem
                    >
                      {getFieldDecorator('headerPic', {
                        rules: [{required: true, message: '头像不能为空!'}],
                      })(
                        <ZZUpload/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Divider>基本信息</Divider>
                <Row>
                  <Col {...itemGrid} style={{display: 'none'}}>
                    <FormItem
                      {...formItemLayout}
                      label="商家ID"
                    >
                      {getFieldDecorator('shopId', {initialValue: '123456789'})(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="产品分类"
                    >
                      {getFieldDecorator('productCategoryId', {
                        rules: [{
                          required: false, message: '请选择分类',
                        }]
                      })(
                        <Select placeholder="请选择">
                          {
                            categoryList.map(item => {
                              return (<Option key={item.productCategoryCode}
                                              value={item.productCategoryCode}>{item.productCategoryName}</Option>)
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="产品编码"
                    >
                      {getFieldDecorator('productCode', {
                        rules: [{required: false, message: '请输入产品编码'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="产品名称"
                    >
                      {getFieldDecorator('productName', {
                        rules: [{
                          required: true, message: '请输入产品名称',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="产品简介"
                    >
                      {getFieldDecorator('productSummary', {
                        rules: [{
                          required: false, message: '请输入产品简介',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="售价"
                    >
                      {getFieldDecorator('productSellingprice', {
                        rules: [{
                          required: false, message: '请输入售价',
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
                      label="成本价格"
                    >
                      {getFieldDecorator('productCostprice', {
                        rules: [{
                          required: true, message: '请输入成本价格',
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
                      label="产品单位"
                    >
                      {getFieldDecorator('product_unit', {
                        rules: [{
                          required: false, message: '请输入产品单位',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="产品规格"
                    >
                      {getFieldDecorator('product_spec', {
                        rules: [{
                          required: false, message: '请输入产品规格',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="产品型号"
                    >
                      {getFieldDecorator('product_model', {
                        rules: [{
                          required: false, message: '请输入产品型号',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="产品状态"
                    >
                      {getFieldDecorator('product_state', {
                        rules: [{
                          required: false, message: '请输入产品状态',
                        }],
                        initialValue: 0
                      })(
                        <Select placeholder="请选择" disabled>
                          <Option value={0}>未上架</Option>
                          <Option value={1}>已上架</Option>
                          <Option value={2}>已删除</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="配送范围"
                    >
                      {getFieldDecorator('distributionScope', {
                        rules: [{
                          required: false, message: '请输入配送范围',
                        }],
                      })(
                        <TextArea/>
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
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="修改时间"
                    >
                      {getFieldDecorator('updated_at')(
                        <Input disabled/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="创建时间"
                    >
                      {getFieldDecorator('created_at')(
                        <Input disabled/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Divider>产品参数</Divider>
                <Row>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="产地"
                    >
                      {getFieldDecorator('productOrigin', {
                        rules: [{
                          required: false, message: '请输入产品产地',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="食用办法"
                    >
                      {getFieldDecorator('productUsage', {
                        rules: [{
                          required: false, message: '请输入产品食用办法',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="贮藏办法"
                    >
                      {getFieldDecorator('productStorage', {
                        rules: [{
                          required: false, message: '请输入产品贮藏办法',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="口味"
                    >
                      {getFieldDecorator('productTaste', {
                        rules: [{
                          required: false, message: '请输入产品口味',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="品牌"
                    >
                      {getFieldDecorator('productBrand', {
                        rules: [{
                          required: false, message: '请输入产品品牌',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="配料"
                    >
                      {getFieldDecorator('productBatching', {
                        rules: [{
                          required: false, message: '请输入产品配料',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="保质期"
                    >
                      {getFieldDecorator('productDate', {
                        rules: [{
                          required: false, message: '请输入产品保质期',
                        }],
                      })(
                        <ZZDatePicker/>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...itemGrid}>
                    <FormItem
                      {...formItemLayout}
                      label="净含量"
                    >
                      {getFieldDecorator('productNetWeight', {
                        rules: [{
                          required: false, message: '请输入产品净含量',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Divider>产品详情图</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem
                    >
                      {getFieldDecorator('detailPic')(
                        <ZZUpload/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" justify="center" style={{marginTop: 40}}>
                  <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                          loading={submitLoading}>保存</Button>
                </Row>
              </Form>
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

const productEdit = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default productEdit;