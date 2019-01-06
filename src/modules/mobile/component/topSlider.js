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
    Card
} from 'antd';
import assign from 'lodash/assign';
import axios from "Utils/axios";
import Util from 'Utils/util';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

class Index extends React.Component {
    constructor(props) {
        super(props);

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
        // this.queryList();
    }

    queryList = () => {
        const {params, keyWords} = this.state;
        const param = assign({}, params, {keyWords});
        this.setState({loading: true});
        axios.get('product/queryList', {
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

    add = () => {
        return this.context.router.push('/frame/mobile/topSlider/add');
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
        const {dataSource, pagination, loading} = this.state;

        return (
            <div className="zui-content page-newsList">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>APP管理</Breadcrumb.Item>
                            <Breadcrumb.Item>顶部滚动图列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>顶部滚动图列表</h1>
                </div>
                <div className='pageContent'>
                    <Card title={<Button type='primary' onClick={this.add}>添加滚动图</Button>}>
                        <Row gutter={24}>
                            {
                                [1, 2, 3, 4, 5, 6].map((item, index) => {
                                    return (
                                        <Col span={6} key={index}>
                                            <Card
                                                hoverable
                                                cover={<img alt="example"
                                                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"/>}
                                                actions={[<Icon type="edit"/>, <Icon type="delete"/>]}
                                            >
                                                <Card.Meta
                                                    title="Card title"
                                                    description="This is the description"
                                                />
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </Card>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
