const Menu = [
    {
        key: '0',
        iconType: 'mobile',
        label: 'APP管理',
        children: [
            {
                key: '0_1',
                link: '/frame/mobile/topSlider/list',
                label: '顶部轮播图'
            }
        ]
    }, {
        key: '1',
        iconType: 'file-text',
        label: '订单管理',
        children: [
            {
                key: '1_1',
                link: '/frame/order/list',
                label: '订单列表'
            }, {
                key: '1_2',
                link: '/frame/order/add',
                label: '新增订单'
            }, {
                key: '1_3',
                link: '/frame/order/sender',
                label: '寄件信息列表'
            }
        ]
    }, {
        key: '2',
        iconType: 'area-chart',
        label: '报表管理',
        children: [
            {
                key: '2_1',
                link: '/frame/report/list',
                label: '报表'
            }, {
                key: '2_2',
                link: '/frame/report/chart',
                label: '图表'
            }
        ]
    }, {
        key: '3',
        iconType: 'file-search',
        label: '产品管理',
        children: [
            {
                key: '3_1',
                link: '/frame/product/list',
                label: '产品列表'
            }, {
                key: '3_2',
                link: '/frame/product/add',
                label: '新增产品'
            }, {
                key: '3_3',
                link: '/frame/product/category/list',
                label: '产品类别'
            }, {
                key: '3_4',
                link: '/frame/product/category/add',
                label: '新增类别'
            }
        ]
    }, {
        key: '6',
        iconType: 'shop',
        label: '商户管理',
        children: [
            {
                key: '6_1',
                link: '/frame/shop/list',
                label: '商户列表'
            }, {
                key: '6_2',
                link: '/frame/shop/add',
                label: '新增商户'
            }
        ]
    }, {
        key: '7',
        iconType: 'shop',
        label: '主题旅游管理',
        children: [
            {
                key: '7_1',
                link: '/frame/travel/list',
                label: '主题旅游列表'
            }, {
                key: '7_2',
                link: '/frame/travel/add',
                label: '新增主题旅游'
            }
        ]
    }, {
        key: '4',
        iconType: 'idcard',
        label: '用户管理',
        children: [
            {
                key: '4_1',
                link: '/frame/user/list',
                label: '用户列表'
            }, {
                key: '4_2',
                link: '/frame/user/add',
                label: '新增用户'
            }, {
                key: '4_3',
                link: '/frame/user/resource',
                label: '用户资源'
            }
        ]
    }, {
        key: '5',
        iconType: 'setting',
        label: '个人设置',
        children: [
            {
                key: '5_1',
                link: '/frame/setting/list',
                label: '个人中心'
            }, {
                key: '5_2',
                link: '/frame/setting/resource',
                label: '资源信息'
            }
        ]
    }
];

export default Menu;
