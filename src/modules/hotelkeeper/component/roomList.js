import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Input,
  Icon,
  Tag,
  Menu,
  Breadcrumb,
  Dropdown,
  notification,
  message,
  Modal,
  Badge,
  Button
} from 'antd';
import assign from 'lodash/assign';
import axios from "Utils/axios";
import Util from 'Utils/util';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

const Search = Input.Search;

class RoomList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '房间名称',
        width: 150,
        align: 'center',
        dataIndex: 'roomName',
        key: 'roomName',
        render: (text, record, index) => (
          <Link to={this.onEdit(record.id)}>{text}</Link>
        )
      }, {
        title: '房间价格',
        width: 120,
        align: 'center',
        key: 'roomPrice',
        dataIndex: 'roomPrice',
        render: (text, record, index) => (
          <span>{text + ' 元'}</span>
        )
      }, {
        title: '房间大小',
        width: 120,
        align: 'center',
        key: 'roomSize',
        dataIndex: 'roomSize',
        render: (text, record, index) => (
          <span>{text + ' 平米'}</span>
        )
      }, {
        title: '床型',
        width: 120,
        align: 'center',
        key: 'bedModel',
        dataIndex: 'bedModel'
      }, {
        title: '可住人数',
        dataIndex: 'stayPersonNum',
        width: 120,
        align: 'center',
        key: 'stayPersonNum',
        render: (text, record, index) => (
          <span>{text + ' 人'}</span>
        )
      }, {
        title: '网络',
        dataIndex: 'internet',
        width: 120,
        align: 'center',
        key: 'internet'
      }, {
        title: '窗景',
        width: 100,
        align: 'center',
        dataIndex: 'windowScenery',
        key: 'windowScenery',
      }, {
        title: '窗户',
        width: 100,
        align: 'center',
        dataIndex: 'window',
        key: 'window'
      }, {
        title: '卫浴',
        align: 'center',
        width: 150,
        dataIndex: 'bathroom',
        key: 'bathroom'
      }, {
        title: '早餐',
        align: 'center',
        width: 100,
        dataIndex: 'breakfast',
        key: 'breakfast'
      }, {
        title: '饮品',
        align: 'center',
        width: 100,
        dataIndex: 'drink',
        key: 'drink'
      }, {
        title: '设施',
        align: 'center',
        width: 120,
        dataIndex: 'facilities',
        key: 'facilities'
      }, {
        title: '支付方式',
        align: 'center',
        width: 120,
        dataIndex: 'payType',
        key: 'payType'
      }, {
        title: '可否取消',
        align: 'center',
        width: 100,
        dataIndex: 'canCancel',
        key: 'canCancel',
        render: (text, record, index) => (
          <span>
                        <Tag color={text === 1 ? 'green' : 'red'}>{text === 1 ? '是' : '否'}</Tag>
                    </span>
        )
      }, {
        title: '可否加床',
        align: 'center',
        width: 100,
        dataIndex: 'canAddbed',
        key: 'canAddbed',
        render: (text, record, index) => (
          <span>
                        <Tag color={text === 1 ? 'green' : 'red'}>{text === 1 ? '是' : '否'}</Tag>
                    </span>
        )
      }, {
        title: '内宾',
        align: 'center',
        width: 150,
        dataIndex: 'innerNeed',
        key: 'innerNeed'
      }, {
        title: '优惠政策',
        align: 'center',
        dataIndex: 'sale',
        key: 'sale'
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
        title: '审核状态',
        align: 'left',
        fixed: 'right',
        width: 110,
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          if (text === 1) {
            return <Badge status="error" text="审核不通过"/>;
          } else if (text === 2) {
            return <Badge status="success" text="审核通过"/>;
          } else {
            return <Badge status="processing" text="待审核"/>;
          }
        }
      }, {
        title: '房间状态',
        align: 'left',
        fixed: 'right',
        width: 110,
        dataIndex: 'roomStatus',
        key: 'roomStatus',
        render: (text) => {
          if (text === 0) {
            return <Badge status="processing" text="可预订"/>;
          } else if (text === 1) {
            return <Badge status="warning" text="已满房"/>;
          } else {
            return <Badge status="error" text="已下架"/>;
          }
        }
      }, {
        title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
        key: 'operation',
        fixed: 'right',
        width: 120,
        align: 'center',
        render: (text, record, index) => {
          if (record.status === 3) {
            return <span>已结束</span>
          } else {
            return <Dropdown
              placement="bottomCenter"
              overlay={
                <Menu>
                  <Menu.Item>
                    <a onClick={() => this.onCheck(record.id, 0)}>可预订</a>
                  </Menu.Item>
                  {/*<Menu.Item>*/}
                    {/*<a onClick={() => this.onCheck(record.id, 1)}>满房</a>*/}
                  {/*</Menu.Item>*/}
                  <Menu.Item>
                    <a onClick={() => this.onCheck(record.id, 2)}>下架</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a onClick={() => this.onDetail(record.id)}>删除</a>
                  </Menu.Item>
                </Menu>
              }
            >
              <a className="ant-dropdown-link">操作</a>
            </Dropdown>
          }
        }
      }
    ];

    this
      .state = {
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
    const hotelkeeperId = sessionStorage.userId;
    const param = assign({
      hotelkeeperId
    }, params, {keyWords});
    this.setState({loading: true});
    axios.get('room/queryList', {
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

  addRoom = () => {
    return this.context.router.push(`/frame/hotelkeeper/addRoom`);
  }

  // 房间状态更新
  onCheck = (id, status) => {
    Modal.confirm({
      title: '提示',
      content: '此操作将改变房间状态，是否确认？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let param = {};
        param.id = id;
        param.roomStatus = status;
        axios.post('room/updateStatus', param).then(res => res.data).then(data => {
          if (data.success) {
            notification.success({
              message: '提示',
              description: '房间状态更新成功！'
            });

            this.setState({
              params: {
                pageNumber: 1,
                pageSize: 10
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

  // 房间删除
  onDetail = id => {
    Modal.confirm({
      title: '提示',
      content: '此操作将删除房间信息，是否确认？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let param = {};
        param.id = id;
        axios.post('room/delete', param).then(res => res.data).then(data => {
          if (data.success) {
            notification.success({
              message: '提示',
              description: '房间信息删除成功！'
            });

            this.setState({
              params: {
                pageNumber: 1,
                pageSize: 10
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

  onEdit = id => {
    return `/frame/hotelkeeper/roomList/edit/${id}`
  }

  render() {
    const {dataSource, pagination, loading} = this.state;

    return (
      <div className="zui-content page-newsList">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>特色民宿管理</Breadcrumb.Item>
              <Breadcrumb.Item>民宿房间列表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>民宿房间列表</h1>
          <div className='search-area'>
            <Row type='flex' justify="center" align="middle">
              <Col span={8}>
                <Search
                  placeholder="房间名称"
                  enterButton='搜索'
                  size="large"
                  onSearch={this.onSearch}
                />
              </Col>
              <Col span={3}>
                <Button
                  icon='plus'
                  size="large"
                  onClick={this.addRoom}
                  style={{marginLeft: 25}}
                >新增房间</Button>
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
              scroll={{x: 2700}}
              handlePageChange={this.handlePageChange}
            />
          </ZZCard>
        </div>
      </div>
    );
  }
}

RoomList.contextTypes = {
  router: PropTypes.object
}

export default RoomList;
