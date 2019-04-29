import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Icon,
    Breadcrumb,
    notification,
    message,
    Modal,
    Button,
    Card
} from 'antd';
import assign from 'lodash/assign';
import axios from "Utils/axios";
import Util from 'Utils/util';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import restUrl from "RestUrl";

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
        this.queryList();
    }

    queryList = () => {
        this.setState({loading: true});
        axios.get('app/queryTopSliderList').then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    backData.map(item => {
                        if (item.File) {
                            item.imgSrc = restUrl.FILE_ASSET + `${item.File.id + item.File.fileType}`;
                        }
                    });

                    this.setState({
                        dataSource: backData
                    });
                } else {
                    this.setState({
                        dataSource: []
                    });
                }
            } else {
                message.error('查询列表失败');
            }
            this.setState({loading: false});
        });
    }

    add = () => {
        this.context.router.push('/frame/mobile/topSlider/add');
    }

    onEdit = id => {
        this.context.router.push(`/frame/mobile/topSlider/list/edit/${id}`);
    }

    onDelete = id => {
        Modal.confirm({
            title: '提示',
            content: '确认要删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let param = {};
                param.id = id;
                axios.post('app/delTopSlider', param).then(res => res.data).then(data => {
                    if (data.success) {
                        notification.success({
                            message: '提示',
                            description: '删除成功！'
                        });

                        this.queryList();
                    } else {
                        message.error(data.backMsg);
                    }
                });
            }
        });
    }

    render() {
        const {dataSource, loading} = this.state;

        return (
            <div className="zui-content page-topslider">
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
                                dataSource.map((item, index) => {
                                    return (
                                        <Col span={6} key={index} style={{marginBottom: 15}}>
                                            <Card
                                                hoverable
                                                cover={<img src={item.imgSrc}/>}
                                                actions={[
                                                    <Icon type="edit" onClick={() => this.onEdit(item.id)}/>,
                                                    <Icon type="delete" onClick={() => this.onDelete(item.id)}/>
                                                ]}
                                            >
                                                <Card.Meta
                                                    title={item.desc}
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
