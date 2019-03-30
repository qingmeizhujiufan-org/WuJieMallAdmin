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
  notification,
  message,
  Modal,
  Button
} from 'antd';
import assign from 'lodash/assign';
import axios from "Utils/axios";
import Util from 'Utils/util';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

const Search = Input.Search;

class adminHotelList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '特色民宿名称',
        width: 150,
        align: 'center',
        dataIndex: 'hotelName',
        key: 'hotelName',
        render: (text, record, index) => (
          <Link to={this.onEdit(record.id)}>{text}</Link>
        )
      }, {
        title: '手机电话',
        dataIndex: 'telephone',
        width: 120,
        align: 'center',
        key: 'telephone'
      }, {
        title: '固定电话',
        dataIndex: 'hotelPhone',
        width: 120,
        align: 'center',
        key: 'hotelPhone'
      }, {
        title: '民宿类型',
        width: 100,
        align: 'center',
        dataIndex: 'hotelType',
        key: 'hotelType',
      }, {
        title: '民宿地址',
        width: 180,
        align: 'right',
        dataIndex: 'hotelAddress',
        key: 'hotelAddress',
        render: (text, record, index) => (
          <span>{text}<Link to={this.onAddress(record.id)}></Link></span>
        )
      }, {
        title: '民宿状态',
        align: 'center',
        width: 100,
        dataIndex: 'hotelStatus',
        key: 'hotelStatus'
      }, {
        title: '创建时间',
        align: 'right',
        width: 150,
        dataIndex: 'created_at',
        key: 'created_at'
      }, {
        title: '修改时间',
        align: 'center',
        width: 150,
        dataIndex: 'updated_at',
        key: 'updated_at'
      }, {
        title: '备注',
        align: 'center',
        dataIndex: 'mark',
        key: 'mark'
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
    const createBy = sessionStorage.getItem('userName');
    const param = assign({
      createBy
    }, params, {keyWords});
    this.setState({loading: true});
    axios.get('hotel/queryList', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        if (data.backData) {
          const backData = data.backData;
          const dataSource = backData.content;
          const total = backData.totalElements;

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
        message.error('查询列表失败');
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

  addHotel = () => {
    return this.context.router.push('/frame/hotel/add');
  }

  onDetail = id => {
    return `/frame/hotel/detail/${id}`
  }

  onEdit = id => {
    return `/frame/hotel/edit/${id}`
  }

  onAddress = id => {
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
        axios.post('hotel/delete', param).then(res => res.data).then(data => {
          if (data.success) {
            notification.success({
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
            message.error(data.backMsg);
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
              <Breadcrumb.Item>特色民宿管理</Breadcrumb.Item>
              <Breadcrumb.Item>特色民宿列表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>特色民宿列表</h1>
          <div className='search-area'>
            <Row type='flex' justify="center" align="middle">
              <Col span={8}>
                <Search
                  placeholder="民宿名称"
                  enterButton='搜索'
                  size="large"
                  onSearch={this.onSearch}
                />
              </Col>
              <Col span={3}>
                <Button
                  icon='plus'
                  size="large"
                  onClick={this.addHotel}
                  style={{marginLeft: 25}}
                >新增特色民宿</Button>
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
              handlePageChange={this.handlePageChange}
            />
          </ZZCard>
        </div>
      </div>
    );
  }
}

adminHotelList.contextTypes = {
  router: PropTypes.object
}

export default adminHotelList;
