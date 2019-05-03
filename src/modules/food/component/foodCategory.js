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
const ButtonGroup = Button.Group;

class FoodList extends React.Component {
    constructor(props) {
        super(props);

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
        axios.get('food/queryCategoryList', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData && data.backData.content) {
                    const backData = data.backData;
                    const dataSource = backData.content;
                    dataSource.map(item => {
                        item.key = item.id;
                        item.url = (item.foodCategoryPic && item.foodCategoryPic[0]) ? (restUrl.FILE_ASSET + `${item.foodCategoryPic[0].id + item.foodCategoryPic[0].fileType}`) : null
                    });

                    callback(dataSource)
                } else {
                    callback([])
                }
            } else {
                message.error('查询列表失败');
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

    addFoodCategory = () => {
        return this.context.router.push('/frame/food/category/add');
    }

    onEdit = id => {
        return this.context.router.push(`/frame/food/categoryList/edit/${id}`);
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
                axios.post('food/categoryDelete', param).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '删除成功！'
                        });

                        this.setState({
                            params: {
                                pageNumber: 1,
                                pageSize: 10
                            },
                        }, () => {
                            this.queryList(res => {
                                this.setState({
                                    data: res,
                                    list: res,
                                    loading: res.length <= this.state.params.pageSize || false,
                                });
                            });
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
                <div className='card-title'>
                    <span>{data.foodCategoryName}</span>
                </div>
                <div className='img-box'>
                    <img src={data.url} alt=""/>
                </div>
                <ButtonGroup className='tool-box'>
                    <Button onClick={() => this.onEdit(data.id)}>编辑</Button>
                    <Button onClick={() => this.onDelete(data.id)}>删除</Button>
                </ButtonGroup>
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
            <div className="zui-content" id="food">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>食品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>食品类别</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>食品类别</h1>
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
                                    onClick={this.addFoodCategory}
                                    style={{marginLeft: 25}}
                                >新增食品类别</Button>
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

FoodList.contextTypes = {
    router: PropTypes.object
}

export default FoodList;
