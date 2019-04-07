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
    Button, Badge
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
                    <Tag color={text === 1 ? 'green' : 'red'}>{text === 1 ? '是' : '否'}</Tag></span>
                )
            }, {
                title: '可否加床',
                align: 'center',
                width: 100,
                dataIndex: 'canAddbed',
                key: 'canAddbed',
                render: (text, record, index) => (
                    <span>
                    <Tag color={text === 1 ? 'green' : 'red'}>{text === 1 ? '是' : '否'}</Tag></span>
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
                title: '状态',
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

    componentDidMount = () => {
        this.queryList();
    }

    queryList = () => {
        const {params, keyWords} = this.state;
        const hotelId = this.props.params.id;
        const param = assign({
            hotelId
        }, params, {keyWords});
        this.setState({loading: true});
        axios.get('room/queryAdminList', {
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

    onEdit = id => {
        return `/frame/hotel/roomList/edit/${id}`;
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
