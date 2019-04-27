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
    Tabs,
    Switch,

} from 'antd';
import assign from 'lodash/assign';
import axios from "Utils/axios";
import Util from 'Utils/util';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

class TravelList extends React.Component {
    constructor(props) {
        super(props);

        this.columns_food = [
            {
                title: '食品名称',
                width: 200,
                align: 'center',
                dataIndex: 'foodName',
                key: 'foodName'
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
                dataIndex: 'foodCode',
                key: 'foodCode'
            }, {
                title: '食品品牌',
                align: 'center',
                dataIndex: 'foodBrand',
                key: 'foodBrand'
            }, {
                title: '是否推荐',
                align: 'center',
                dataIndex: 'isRecommend',
                key: 'isRecommend',
                render: (text, record) => (
                    <Switch checked={!!text} onChange={() => this.onFoodChange(record.id, text)}/>
                )
            }
        ];

        this.columns_travel = [
            {
                title: '旅游主题名称',
                width: 200,
                align: 'center',
                dataIndex: 'travelTheme',
                key: 'travelTheme'
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
                dataIndex: 'manPrice',
                key: 'manPrice',
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
                title: '是否推荐',
                align: 'center',
                dataIndex: 'isRecommend',
                key: 'isRecommend',
                render: (text, record) => (
                    <Switch checked={!!text} onChange={() => this.onTravelChange(record.id, text)}/>
                )
            }
        ];

        this.columns_hotel = [
            {
                title: '房间名称',
                align: 'center',
                dataIndex: 'roomName',
                key: 'roomName'
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
                title: '是否推荐',
                align: 'center',
                dataIndex: 'isRecommend',
                key: 'isRecommend',
                render: (text, record) => (
                    <Switch checked={!!text} onChange={() => this.onHotelChange(record.id, text)}/>
                )
            }];

        this.state = {
            loading_1: false,
            loading_2: false,
            loading_3: false,
            dataSource_1: [],
            dataSource_2: [],
            dataSource_3: [],
            pagination_1: {},
            pagination_2: {},
            pagination_3: {},
            params_1: {
                pageNumber: 1,
                pageSize: 10,
                state: 2
            },
            params_2: {
                pageNumber: 1,
                pageSize: 10,
                state: 2
            },
            params_3: {
                pageNumber: 1,
                pageSize: 10,
                state: 2
            },
            keyWords_1: '',
            keyWords_2: '',
            keyWords_3: ''
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryFoodList();
        this.queryTravelList();
        this.queryHotelList();
    }

    queryFoodList = () => {
        const {params_1, keyWords_1} = this.state;
        const param = assign({}, {params: params_1}, {keyWords: keyWords_1});
        this.setState({loading_1: true});
        axios.get('food/queryAdminList', param).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    const dataSource = backData.content;
                    const total = backData.totalElements;

                    this.setState({
                        dataSource_1: dataSource,
                        pagination_1: {total}
                    });
                } else {
                    this.setState({
                        dataSource_1: [],
                        pagination_1: {total: 0}
                    });
                }
            } else {
                message.error('查询列表失败');
            }
            this.setState({loading_1: false});
        });
    }

    queryTravelList = () => {
        const {params_2, keyWords_2} = this.state;
        const param = assign({}, {params: params_2}, {keyWords: keyWords_2});
        this.setState({loading_2: true});
        axios.get('travel/queryAdminList', param).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    const dataSource = backData.content;
                    const total = backData.totalElements;

                    this.setState({
                        dataSource_2: dataSource,
                        pagination_2: {total}
                    });
                } else {
                    this.setState({
                        dataSource_2: [],
                        pagination_2: {total: 0}
                    });
                }
            } else {
                message.error('查询列表失败');
            }
            this.setState({loading_2: false});
        });
    }

    queryHotelList = () => {
        const {params_3, keyWords_3} = this.state;
        const hotelId = this.props.params.id;
        const param = assign({hotelId}, {params: params_3}, {keyWords: keyWords_3});
        this.setState({loading_3: true});
        axios.get('room/queryAdminList', param).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    const dataSource = backData.content;
                    const total = backData.totalElements;

                    this.setState({
                        dataSource_3: dataSource,
                        pagination_3: {total}
                    });
                } else {
                    this.setState({
                        dataSource_3: [],
                        pagination_3: {total: 0}
                    });
                }
            } else {
                message.error('查询列表失败');
            }
            this.setState({loading_3: false});
        });
    }

    // 处理分页变化
    handlePageChange_1 = param => {
        const params = assign({}, this.state.params_1, param);
        this.setState({params_1: params}, () => {
            this.queryFoodList();
        });
    }

    handlePageChange_2 = param => {
        const params = assign({}, this.state.params_2, param);
        this.setState({params_2: params}, () => {
            this.queryTravelList();
        });
    }

    handlePageChange_3 = param => {
        const params = assign({}, this.state.params_3, param);
        this.setState({params_3: params}, () => {
            this.queryHotelList();
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

    onFoodChange = (id, value) => {
        axios.post('food/recommend', {
            id,
            isRecommend: !!value ? 0 : 1
        }).then(res => res.data).then(data => {
            if (data.success) {
                this.setState({
                    params: {
                        pageNumber: 1,
                        pageSize: 10,
                    }
                }, () => {
                    this.queryFoodList();
                });

                notification.success({
                    message: '提示',
                    description: '操作成功！'
                });
            } else {
                message.error(data.backMsg);
            }
        });
    }

    onTravelChange = (id, value) => {
        axios.post('travel/recommend', {
            id,
            isRecommend: !!value ? 0 : 1
        }).then(res => res.data).then(data => {
            if (data.success) {
                this.setState({
                    params: {
                        pageNumber: 1,
                        pageSize: 10,
                    }
                }, () => {
                    this.queryTravelList();
                });

                notification.success({
                    message: '提示',
                    description: '操作成功！'
                });
            } else {
                message.error(data.backMsg);
            }
        });
    }

    onHotelChange = (id, value) => {
        axios.post('room/recommend', {
            id,
            isRecommend: !!value ? 0 : 1
        }).then(res => res.data).then(data => {
            if (data.success) {
                this.setState({
                    params: {
                        pageNumber: 1,
                        pageSize: 10,
                    }
                }, () => {
                    this.queryHotelList();
                });

                notification.success({
                    message: '提示',
                    description: '操作成功！'
                });
            } else {
                message.error(data.backMsg);
            }
        });
    }

    render() {
        const {
            dataSource_1,
            dataSource_2,
            dataSource_3,
            pagination_1,
            pagination_2,
            pagination_3,
            loading_1,
            loading_2,
            loading_3,
        } = this.state;

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
                    {/*<div className='search-area'>*/}
                        {/*<Row type='flex' justify="center" align="middle">*/}
                            {/*<Col span={8}>*/}
                                {/*<Search*/}
                                    {/*placeholder="主题名称"*/}
                                    {/*enterButton='搜索'*/}
                                    {/*size="large"*/}
                                    {/*onSearch={this.onSearch}*/}
                                {/*/>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    {/*</div>*/}
                </div>
                <div className='pageContent'>
                    <ZZCard>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<Badge
                                count={dataSource_1.filter(item => item.isRecommend === 1).length}>特色食品推荐</Badge>}
                                     key="1">
                                <ZZCard>
                                    <ZZTable
                                        columns={this.columns_food}
                                        dataSource={dataSource_1}
                                        pagination={pagination_1}
                                        loading={loading_1}
                                        handlePageChange={this.handlePageChange_1}
                                    />
                                </ZZCard>
                            </TabPane>
                            <TabPane tab={<Badge
                                count={dataSource_2.filter(item => item.isRecommend === 1).length}>主题旅游推荐</Badge>}
                                     key="2">
                                <ZZCard>
                                    <ZZTable
                                        columns={this.columns_travel}
                                        dataSource={dataSource_2}
                                        pagination={pagination_2}
                                        loading={loading_2}
                                        handlePageChange={this.handlePageChange_2}
                                    />
                                </ZZCard>
                            </TabPane>
                            <TabPane tab={<Badge
                                count={dataSource_3.filter(item => item.isRecommend === 1).length}>特色民宿推荐</Badge>}
                                     key="3">
                                <ZZCard>
                                    <ZZTable
                                        columns={this.columns_hotel}
                                        dataSource={dataSource_3}
                                        pagination={pagination_3}
                                        loading={loading_3}
                                        handlePageChange={this.handlePageChange_3}
                                    />
                                </ZZCard></TabPane>
                        </Tabs>
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
