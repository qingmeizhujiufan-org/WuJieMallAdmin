import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Input,
  Icon,
  Menu,
  Breadcrumb,
  Dropdown,
  Notification,
  Message,
  Modal,
  Button
} from 'antd';
import assign from 'lodash/assign';
import axios from "Utils/axios";
import Util from 'Utils/util';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

const Search = Input.Search;

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '店铺ID',
        dataIndex: 'shopId',
        width: 150,
        align: 'center',
        key: 'shopId'
      }, {
        title: '店铺名称',
        dataIndex: 'productCategoryId',
        width: 150,
        align: 'center',
        key: 'productCategoryId'
      }, {
        title: '店铺地址',
        width: 300,
        align: 'center',
        dataIndex: 'productName',
        key: 'productName'
      }, {
        title: '单位',
        width: 150,
        align: 'center',
        dataIndex: 'productUnit',
        key: 'productUnit',
      }, {
        title: '成本价格',
        width: 150,
        align: 'right',
        dataIndex: 'productCostprice',
        key: 'productCostprice',
        render: (text, record, index) => (
          <span>{Util.shiftThousands(text)}</span>
        )
      }, {
        title: '产品条码',
        align: 'center',
        dataIndex: 'barCode',
        key: 'barCode'
      }, {
        title: '备注',
        width: 120,
        dataIndex: 'memo',
        key: 'memo'
      }, {
        title: '更新时间',
        width: 200,
        align: 'center',
        dataIndex: 'updated_at',
        key: 'updated_at'
      }, {
        title: '创建时间',
        width: 200,
        align: 'center',
        dataIndex: 'created_at',
        key: 'created_at'
      }, {
        title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
        key: 'operation',
        fixed: 'right',
        width: 120,
        align: 'center',
        render: (text, record, index) => (
          <Dropdown
            placement="bottomCenter"
            overlay={
              <Menu>
                <Menu.Item>
                  <Link to={this.onEdit(record.id)}>编辑</Link>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={() => this.onDelete(record.id)}>删除</a>
                </Menu.Item>
              </Menu>
            }
          >
            <a className="ant-dropdown-link">操作</a>
          </Dropdown>
        )
      }];

    this.state = {
      loading: false,
      dataSource: [],
      pagination: {},
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      keyWords: ''
    };
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.queryList();
  }

  queryList = () => {
    const {params, keyWords} = this.state;
    const param = assign({}, params, {keyWords});
    this.setState({loading: true});
    axios.get('shop/queryList', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        if (data.backData) {
          const backData = data.backData;
          const dataSource = backData.content;
          const total = backData.totalElements;
          dataSource.map(item => {
            item.key = item.id;
          });

          this.setState({
            dataSource,
            pagination: {total}
          });
        } else {
          this.setState({
            dataSource: [],
            pagination: {total: 0}
          });
        }
      } else {
        Message.error('查询列表失败');
      }
      this.setState({loading: false});
    });
  }

  // 处理分页变化
  handlePageChange = param => {
    const params = assign({}, this.state.params, param);
    this.setState({params}, () => {
      this.queryList();
    });
  }

  // 搜索
  onSearch = (value, event) => {
    console.log('onsearch value == ', value);
    this.setState({
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      keyWords: value
    }, () => {
      this.queryList();
    });
  }

  addProduct = () => {
    return this.context.router.push('/frame/shop/add');
  }

  onDetail = id => {
    return `/frame/shop/list/detail/${id}`
  }

  onEdit = id => {
    return `/frame/shop/list/edit/${id}`
  }

  onDelete = (key) => {
    Modal.confirm({
      title: '提示',
      content: '确认要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let param = {};
        param.id = key;
        axios.post('shop/delete', param).then(res => res.data).then(data => {
          if (data.success) {
            Notification.success({
              message: '提示',
              description: '删除成功！'
            });

            this.setState({
              params: {
                pageNumber: 1
              },
            }, () => {
              this.queryList();
            });
          } else {
            Message.error(data.backMsg);
          }
        });
      }
    });
  }

  render() {
    const {dataSource, pagination, loading} = this.state;

    return (
      <div className="zui-content page-newsList">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>店铺管理</Breadcrumb.Item>
              <Breadcrumb.Item>店铺列表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>店铺列表</h1>
          <div className='search-area'>
            <Row type='flex' justify="center" align="middle">
              <Col span={8}>
                <Search
                  placeholder="搜索店铺关键字"
                  enterButton='搜索'
                  size="large"
                  onSearch={this.onSearch}
                />
              </Col>
              <Col span={3}>
                <Button
                  icon='plus'
                  size="large"
                  onClick={this.addProduct}
                  style={{marginLeft: 25}}
                >新增店铺</Button>
              </Col>
            </Row>
          </div>
        </div>
        <div className='pageContent'>
          <ZZCard>
            <ZZTable
              columns={this.columns}
              dataSource={dataSource}
              pagination={pagination}
              loading={loading}
              scroll={{x: 1500}}
              handlePageChange={this.handlePageChange.bind(this)}
            />
          </ZZCard>
        </div>
      </div>
    );
  }
}

ProductList.contextTypes = {
  router: PropTypes.object
}

export default ProductList;