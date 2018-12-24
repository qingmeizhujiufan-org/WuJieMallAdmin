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
  Button,
  Card,
  List
} from 'antd';
import assign from 'lodash/assign';
import axios from "Utils/axios";
import Util from 'Utils/util';
import '../index.less';
import restUrl from "RestUrl";

const Search = Input.Search;

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '仓库地址',
        dataIndex: 'wareHouse',
        width: 150,
        align: 'center',
        key: 'wareHouse',
        render: (text, record, index) => (
          <span>{text === '0' ? '武汉' : '北京'}</span>
        )
      }, {
        title: '产品名称',
        width: 300,
        align: 'center',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '单位',
        width: 150,
        align: 'center',
        dataIndex: 'unit',
        key: 'unit',
      }, {
        title: '成本价格',
        width: 150,
        align: 'right',
        dataIndex: 'costPrice',
        key: 'costPrice',
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
        dataIndex: 'updateTime',
        key: 'updateTime',
      }, {
        title: '创建时间',
        width: 200,
        align: 'center',
        dataIndex: 'createTime',
        key: 'createTime',
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
      initLoading: true,
      loading: false,
      data: [],
      list: [],
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
    this.queryList(res => {
      this.setState({
        data: res,
        list: res,
        loading: res.length <= this.state.params.pageSize || false,
      });
    });
  }

  queryList = (callback) => {
    const {params, keyWords} = this.state;
    const param = assign({}, params, {keyWords});
    axios.get('product/queryCategoryList', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        if (data.backData && data.backData.content) {
          const backData = data.backData;
          const dataSource = backData.content;
          dataSource.map(item => {
            item.key = item.id;
            item.url = restUrl.ADDR + '/public/' + `${item.productCategoryPic[0].id + item.productCategoryPic[0].fileType}`
          });

          callback(dataSource)
        } else {
          callback([])
        }
      } else {
        Message.error('查询列表失败');
      }
      this.setState({initLoading: false});
    });
  }


  onLoadMore = () => {
    const curPageNum = this.state.params.pageNumber + 1;
    this.setState({
      loading: true,
      params: {
        pageNumber: curPageNum,
        pageSize: 10,
      }
    }, () => {
      this.queryList((res) => {
        const data = this.state.data.concat(res);
        this.setState({
          data,
          list: data,
          loading: res.length <= this.state.params.pageSize || false,
        }, () => {
          window.dispatchEvent(new Event('resize'));
        });
      });
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
      this.queryList((res) => {
        this.setState({
          data: res,
          list: res,
          loading: res.length <= this.state.params.pageSize || false,
        }, () => {
          window.dispatchEvent(new Event('resize'));
        });
      });
    });
  }

  addProductCategory = () => {
    return this.context.router.push('/frame/product/category/add');
  }

  onDetail = id => {
    return `/frame/product/list/detail/${id}`
  }

  onEdit = id => {
    return `/frame/product/list/edit/${id}`
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
        axios.post('product/delete', param).then(res => res.data).then(data => {
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
    const {data, list, loading, initLoading} = this.state;
    const CardItem = ({data}) => (
      <div className='card-box'>
        <div className='card-title'>{data.productCategoryName}</div>
        <div className='img-box'>
          <img src={data.url} alt=""/>
        </div>
      </div>
    )

    const loadMore = !initLoading && !loading ? (
      <div style={{
        textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
      }}
      >
        <Button onClick={this.onLoadMore}>加载更多</Button>
      </div>
    ) : null;

    return (
      <div className="zui-content" id="product">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>产品管理</Breadcrumb.Item>
              <Breadcrumb.Item>产品类别</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>产品类别</h1>
          <div className='search-area'>
            <Row type='flex' justify="center" align="middle">
              <Col span={8}>
                <Search
                  placeholder="搜索类别关键字"
                  enterButton='搜索'
                  size="large"
                  onSearch={this.onSearch}
                />
              </Col>
              <Col span={3}>
                <Button
                  icon='plus'
                  size="large"
                  onClick={this.addProductCategory}
                  style={{marginLeft: 25}}
                >新增产品类别</Button>
              </Col>
            </Row>
          </div>
        </div>
        <div className='pageContent'>
          <div className='ibox-content'>
            <List
              grid={{
                gutter: 16, xs: 2, sm: 3, md: 4, lg: 6, xl: 6, xxl: 6,
              }}
              loading={initLoading}
              dataSource={data}
              loadMore={loadMore}
              renderItem={item => (
                <List.Item>
                  <CardItem data={item}/>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

ProductList.contextTypes = {
  router: PropTypes.object
}

export default ProductList;