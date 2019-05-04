import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Input,
    Icon,
    Badge,
    Menu,
    Form,
    DatePicker,
    Breadcrumb,
    Dropdown,
    notification,
    Select,
    message,
    Modal,
    Button,
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import assign from 'lodash/assign';

import restUrl from 'RestUrl';
import axios from 'Utils/axios';
import '../../foodkeeper/index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from 'Utils/util';
import {formItemLayout} from "Utils/formItemGrid";

const Search = Input.Search;

class OrderList extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '订单编号',
                align: 'center',
                dataIndex: 'orderId',
                key: 'orderId'
            }, {
                title: '住店人',
                align: 'center',
                dataIndex: 'person',
                key: 'person'
            }, {
                title: '住店人电话',
                align: 'center',
                dataIndex: 'telephone',
                key: 'telephone'
            }, {
                title: '起始日期',
                width: 150,
                align: 'center',
                dataIndex: 'beginDate',
                key: 'beginDate'
            }, {
                title: '结束日期',
                width: 150,
                align: 'center',
                dataIndex: 'endDate',
                key: 'endDate'
            }, {
                title: '天数',
                align: 'right',
                dataIndex: 'days',
                key: 'days'
            }, {
                title: '总金额',
                align: 'right',
                dataIndex: 'totalMoney',
                key: 'totalMoney',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '预定时间',
                align: 'center',
                dataIndex: 'created_at',
                key: 'created_at'
            }, {
                title: '订单状态',
                width: 150,
                fixed: 'right',
                align: 'center',
                dataIndex: 'status',
                key: 'status',
                render: text => {
                    if (text === 1) {
                        return <Badge status="error" text="已取消"/>;
                    } else if (text === 2) {
                        return <Badge status="info" text="已确认"/>;
                    } else if (text === 3) {
                        return <Badge status="success" text="已完成"/>;
                    } else {
                        return <Badge status="processing" text="待确认"/>;
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
                                    {/*<Menu.Item>*/}
                                        {/*<a onClick={() => this.onCheck(record, 2)}>确认</a>*/}
                                    {/*</Menu.Item>*/}
                                    {/*<Menu.Item>*/}
                                        {/*<a onClick={() => this.onCheck(record, 1)}>拒绝</a>*/}
                                    {/*</Menu.Item>*/}
                                    <Menu.Item>
                                        <a onClick={() => this.onCheck(record, 3)}>完成</a>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <a className="ant-dropdown-link">操作</a>
                        </Dropdown>
                    }
                }
            }];

        this.state = {
            loading: false,
            showUpload: false,
            warehouse: 0,
            fileList: [],
            dataSource: [],
            pagination: {},
            params: {
                pageNumber: 1,
                pageSize: 10
            },
            keyWords: '',
            searchKey: {},
            drawerVisible: false,
            showExportOrderModal: false,
            exportOrderDate: null
        };
    }

    componentDidMount = () => {
        this.queryList();
    }

    queryList = () => {
        const {params, searchKey} = this.state;
        const hotelkeeperId = sessionStorage.userId;
        const param = assign({hotelkeeperId}, params, searchKey);
        this.setState({loading: true});
        axios.get('hotelKeeper/queryOrderList', {
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

//简单搜索
    onSearch = (val) => {
        this.setState({
            searchKey: {
                keyWords: val
            }
        }, () => {
            this.queryList();
        });
    }

    onCheck = (record, status) => {
        Modal.confirm({
            title: '提示',
            content: '此操作将改变订单状态，是否确认？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let param = {};
                param.id = record.id;
                param.status = status;
                axios.post('hotelKeeper/orderCheck', param).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '订单状态更新成功！'
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

    render() {

        const {dataSource, pagination, loading, keyWords} = this.state;

        return (
            <div className="zui-content page-orderList">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>订单列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>订单列表</h1>
                    <div className='search-area'>
                        <Row type='flex' justify="center" align="middle">
                            <Col span={8}>
                                <Search
                                    placeholder="请输入订单编号查询"
                                    enterButton='搜索'
                                    size="large"
                                    value={keyWords}
                                    onChange={e => this.setState({keyWords: e.target.value})}
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

const orderList = Form.create()(OrderList);

OrderList.contextTypes = {
    router: PropTypes.object
}

export default orderList;
