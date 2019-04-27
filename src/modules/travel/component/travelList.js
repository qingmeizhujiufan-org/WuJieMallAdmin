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
    Badge,
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

class TravelList extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '旅游主题名称',
                width: 200,
                align: 'center',
                dataIndex: 'travelTheme',
                key: 'travelTheme',
                render: (text, record, index) => (
                    <Link to={this.onEdit(record.id)}>{text}</Link>
                )
            }, {
                title: '游玩时间',
                dataIndex: 'travelLastTime',
                width: 150,
                align: 'center',
                key: 'travelLastTime'
            }, {
                title: '包含元素',
                dataIndex: 'travelHas',
                width: 150,
                align: 'center',
                key: 'travelHas'
            }, {
                title: '限行人数',
                width: 100,
                align: 'right',
                dataIndex: 'travelLimiteNumber',
                key: 'travelLimiteNumber',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '开始时间',
                width: 100,
                align: 'center',
                dataIndex: 'travelBeginTime',
                key: 'travelBeginTime',
            }, {
                title: '结束时间',
                align: 'center',
                width: 100,
                dataIndex: 'travelEndTime',
                key: 'travelEndTime'
            }, {
                title: '旅游费用',
                align: 'right',
                width: 100,
                dataIndex: 'travelPrice',
                key: 'travelPrice',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '出发地',
                align: 'center',
                width: 100,
                dataIndex: 'travelFrom',
                key: 'travelFrom'
            }, {
                title: '目的地',
                align: 'center',
                width: 100,
                dataIndex: 'travelTo',
                key: 'travelTo'
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

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryList();
    }

    queryList = () => {
        const {params, keyWords} = this.state;
        const param = assign({}, params, {keyWords});
        this.setState({loading: true});
        axios.get('travel/queryList', {
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

    onEdit = id => {
        return `/frame/travel/list/edit/${id}`
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
                axios.post('travel/delete', param).then(res => res.data).then(data => {
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
                            <Breadcrumb.Item>主题旅游管理</Breadcrumb.Item>
                            <Breadcrumb.Item>主题旅游列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>主题旅游列表</h1>
                    <div className='search-area'>
                        <Row type='flex' justify="center" align="middle">
                            <Col span={8}>
                                <Search
                                    placeholder="主题名称"
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
                            scroll={{x: 1600}}
                            handlePageChange={this.handlePageChange}
                        />
                    </ZZCard>
                </div>
            </div>
        );
    }
}

TravelList.contextTypes = {
    router: PropTypes.object
}

export default TravelList;
