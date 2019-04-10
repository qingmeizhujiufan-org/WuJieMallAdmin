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

class FoodList extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '食品名称',
                width: 200,
                align: 'center',
                dataIndex: 'foodName',
                key: 'foodName',
                render: (text, record, index) => (
                    <Link to={this.onEdit(record.id)}>{text}</Link>
                )
            }, {
                title: '店家名称',
                dataIndex: 'shopName',
                width: 150,
                align: 'center',
                key: 'shopName'
            }, {
                title: '食品分类',
                dataIndex: 'foodCategoryName',
                width: 150,
                align: 'center',
                key: 'foodCategoryName'
            }, {
                title: '售价',
                width: 100,
                align: 'right',
                dataIndex: 'foodSellingprice',
                key: 'foodSellingprice',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '成本价格',
                width: 100,
                align: 'right',
                dataIndex: 'foodCostprice',
                key: 'foodCostprice',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '食品编码',
                align: 'center',
                width: 100,
                dataIndex: 'foodCode',
                key: 'foodCode'
            }, {
                title: '食品规格',
                align: 'center',
                width: 100,
                dataIndex: 'foodSpec',
                key: 'foodSpec'
            }, {
                title: '品牌',
                align: 'center',
                width: 100,
                dataIndex: 'foodBrand',
                key: 'foodBrand'
            }, {
                title: '食品产地',
                align: 'center',
                width: 100,
                dataIndex: 'foodOrigin',
                key: 'foodOrigin'
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
        axios.get('food/queryList', {
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

    addFood = () => {
        return this.context.router.push('/frame/food/add');
    }

    onDetail = id => {
        return `/frame/food/list/detail/${id}`
    }

    onEdit = id => {
        return `/frame/food/list/edit/${id}`
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
                axios.post('food/delete', param).then(res => res.data).then(data => {
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
                            <Breadcrumb.Item>食品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>食品列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>食品列表</h1>
                    <div className='search-area'>
                        <Row type='flex' justify="center" align="middle">
                            <Col span={8}>
                                <Search
                                    placeholder="食品名称/品牌/产地"
                                    enterButton='搜索'
                                    size="large"
                                    onSearch={this.onSearch}
                                />
                            </Col>
                            <Col span={3}>
                                <Button
                                    icon='plus'
                                    size="large"
                                    onClick={this.addFood}
                                    style={{marginLeft: 25}}
                                >新增食品</Button>
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
                            scroll={{x: 2500}}
                            handlePageChange={this.handlePageChange}
                        />
                    </ZZCard>
                </div>
            </div>
        );
    }
}

FoodList.contextTypes = {
    router: PropTypes.object
}

export default FoodList;
