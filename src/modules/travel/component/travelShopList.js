import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Input,
    Breadcrumb,
    notification,
    message,
    Modal,
    Badge
} from 'antd';
import assign from 'lodash/assign';
import axios from "Utils/axios";
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

const Search = Input.Search;

class TravelList extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '商家名称',
                width: 150,
                align: 'center',
                dataIndex: 'travelKeeperName',
                key: 'travelKeeperName',
                render: (text, record, index) => (
                    <Link to={this.onEdit(record.id)}>{text}</Link>
                )
            }, {
                title: '负责人姓名',
                dataIndex: 'keeperName',
                width: 120,
                align: 'center',
                key: 'keeperName'
            }, {
                title: '身份证号码',
                dataIndex: 'IDNumber',
                width: 120,
                align: 'center',
                key: 'IDNumber'
            }, {
                title: '手机电话',
                dataIndex: 'telephone',
                width: 120,
                align: 'center',
                key: 'telephone'
            }, {
                title: '固定电话',
                dataIndex: 'phone',
                width: 120,
                align: 'center',
                key: 'phone'
            }, {
                title: '商家地址',
                width: 180,
                align: 'right',
                dataIndex: 'travelKeeperAddress',
                key: 'travelKeeperAddress',
                render: (text, record, index) => (
                    <span><Link to={this.onAddress(record.id)}>{text}</Link></span>
                )
            }, {
                title: '营业状态',
                align: 'center',
                width: 100,
                dataIndex: 'businessStatus',
                key: 'businessStatus',
                render: (text) => {
                    if (text === 0) {
                        return <Badge status="error" text="休息中"/>;
                    } else if (text === 1) {
                        return <Badge status="success" text="营业中"/>;
                    } else {
                        return <Badge status="processing" text="下架中"/>;
                    }
                }
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
        // const createBy = sessionStorage.getItem('userName');
        const param = assign({}, params, {keyWords});
        this.setState({loading: true});
        axios.get('travelKeeper/queryList', {
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
        return `/frame/travel/shopList/edit/${id}`;
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

TravelList.contextTypes = {
    router: PropTypes.object
}

export default TravelList;
