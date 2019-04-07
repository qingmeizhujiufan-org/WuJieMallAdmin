const Menu = [
    {
        key: '000',
        iconType: 'mobile',
        label: 'APP管理',
        children: [
            {
                key: '000_1',
                link: '/frame/mobile/topSlider/list',
                label: '顶部轮播图'
            }
        ]
    }, {
        key: '001',
        iconType: 'file-text',
        label: '订单管理',
        children: [
            {
                key: '001_1',
                link: '/frame/order/list',
                label: '订单列表'
            }, {
                key: '001_2',
                link: '/frame/order/add',
                label: '新增订单'
            }, {
                key: '001_3',
                link: '/frame/order/sender',
                label: '寄件信息列表'
            }
        ]
    }, {
        key: '002',
        iconType: 'area-chart',
        label: '报表管理',
        children: [
            {
                key: '002_1',
                link: '/frame/report/list',
                label: '报表'
            }, {
                key: '002_2',
                link: '/frame/report/chart',
                label: '图表'
            }
        ]
    }, {
        key: '003',
        iconType: 'file-search',
        label: '产品管理',
        children: [
            {
                key: '003_1',
                link: '/frame/product/list',
                label: '产品列表'
            }, {
                key: '003_2',
                link: '/frame/product/add',
                label: '新增产品'
            }, {
                key: '003_3',
                link: '/frame/product/category/list',
                label: '产品类别'
            }, {
                key: '003_4',
                link: '/frame/product/category/add',
                label: '新增类别'
            }
        ]
    }, {
        key: '004',
        iconType: 'idcard',
        label: '人员管理',
        children: [
            {
                key: '004_1',
                link: '/frame/user/list',
                label: '人员列表'
            }, {
                key: '004_2',
                link: '/frame/user/add',
                label: '新增人员'
            }, {
                key: '004_3',
                link: '/frame/user/resource',
                label: '人员资源'
            }
        ]
    }, {
        key: '005',
        iconType: 'setting',
        label: '个人设置',
        children: [
            {
                key: '005_1',
                link: '/frame/setting/list',
                label: '个人中心'
            }, {
                key: '005_2',
                link: '/frame/setting/resource',
                label: '资源信息'
            }
        ]
    }, {
        key: '006',
        iconType: 'shop',
        label: '商户管理',
        children: [
            {
                key: '006_1',
                link: '/frame/shop/list',
                label: '商户列表'
            }, {
                key: '006_2',
                link: '/frame/shop/add',
                label: '新增商户'
            }
        ]
    }, {
        key: '007',
        iconType: 'shop',
        label: '主题旅游管理',
        children: [
            {
                key: '007_1',
                link: '/frame/travel/list',
                label: '主题旅游列表'
            }, {
                key: '007_2',
                link: '/frame/travel/add',
                label: '新增主题旅游'
            }
        ]
    }, {
        key: '008',
        iconType: 'shop',
        label: '特色民宿管理',
        children: [
            {
                key: '008_1',
                link: '/frame/hotel/list',
                label: '特色民宿列表'
            }, {
                key: '008_2',
                link: '/frame/hotel/add',
                label: '新增特色民宿'
            }, {
                key: '008_3',
                link: '/frame/hotel/roomList',
                label: '民宿房间列表'
            }
        ]
    }, {
        key: '300',
        iconType: 'shop',
        label: '房间管理',
        children: [
            {
                key: '300_1',
                link: '/frame/hotelkeeper/roomList',
                label: '房间列表'
            }, {
                key: '300_2',
                link: '/frame/hotelkeeper/addRoom',
                label: '新增房间'
            }
        ]
    }, {
        key: '301',
        iconType: 'shop',
        label: '认证管理',
        children: [
            {
                key: '301_1',
                link: '/frame/hotelkeeper/keeper',
                label: '认证信息'
            }
        ]
    }
];

export default Menu;
