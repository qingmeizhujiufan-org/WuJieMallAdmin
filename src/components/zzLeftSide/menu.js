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
            }, {
                key: '000_2',
                link: '/frame/mobile/recommend/list',
                label: '首页推荐管理'
            }
        ]
    }, {
        key: '003',
        iconType: 'file-search',
        label: '特色食品管理',
        children: [
            {
                key: '003_1',
                link: '/frame/food/shopList',
                label: '食品商家列表'
            },
            {
                key: '003_2',
                link: '/frame/food/list',
                label: '特色食品列表'
            }, {
                key: '003_3',
                link: '/frame/food/categoryList',
                label: '食品分类列表'
            },
            {
                key: '003_4',
                link: '/frame/food/category/add',
                label: '新增食品分类'
            }
        ]
    }, {
        key: '007',
        iconType: 'shop',
        label: '主题旅游管理',
        children: [
            {
                key: '007_1',
                link: '/frame/travel/shopList',
                label: '旅游商家列表'
            }, {
                key: '007_2',
                link: '/frame/travel/list',
                label: '主题旅游列表'
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
                link: '/frame/hotel/roomList',
                label: '民宿房间列表'
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
        label: '订单管理',
        children: [
            {
                key: '301_1',
                link: '/frame/hotelkeeper/orderList',
                label: '订单列表'
            }
        ]
    }, {
        key: '302',
        iconType: 'shop',
        label: '认证管理',
        children: [
            {
                key: '302_1',
                link: '/frame/hotelkeeper/keeper',
                label: '认证信息'
            }
        ]
    }, {
        key: '303',
        iconType: 'setting',
        label: '个人设置',
        children: [
            {
                key: '303_1',
                link: '/frame/setting/list',
                label: '个人中心'
            }
        ]
    }, {
        key: '400',
        iconType: 'shop',
        label: '特色旅游管理',
        children: [
            {
                key: '400_1',
                link: '/frame/travelkeeper/travelList',
                label: '特色旅游列表'
            }, {
                key: '400_2',
                link: '/frame/travelkeeper/addTravel',
                label: '新增特色旅游'
            }
        ]
    }, {
        key: '401',
        iconType: 'shop',
        label: '订单管理',
        children: [
            {
                key: '401_1',
                link: '/frame/travelkeeper/orderList',
                label: '订单信息'
            }
        ]
    }, {
        key: '402',
        iconType: 'shop',
        label: '认证管理',
        children: [
            {
                key: '402_1',
                link: '/frame/travelkeeper/keeper',
                label: '认证信息'
            }
        ]
    }, {
        key: '403',
        iconType: 'setting',
        label: '个人设置',
        children: [
            {
                key: '403_1',
                link: '/frame/setting/list',
                label: '个人中心'
            }
        ]
    }, {
        key: '500',
        iconType: 'shop',
        label: '食品管理',
        children: [
            {
                key: '500_1',
                link: '/frame/foodkeeper/foodList',
                label: '食品列表'
            }, {
                key: '500_2',
                link: '/frame/foodkeeper/addFood',
                label: '新增特色食品'
            }
        ]
    }, {
        key: '501',
        iconType: 'shop',
        label: '认证管理',
        children: [
            {
                key: '501_1',
                link: '/frame/foodkeeper/keeper',
                label: '认证信息'
            }
        ]
    }, {
        key: '502',
        iconType: 'setting',
        label: '个人设置',
        children: [
            {
                key: '502_1',
                link: '/frame/setting/list',
                label: '个人中心'
            }
        ]
    }
];

export default Menu;
