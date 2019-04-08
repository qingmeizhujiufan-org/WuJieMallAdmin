const admin = {
    defaultOpenKeys: ['000', '001', '002', '003', '004', '005', '006', '007', '008'],
    defaultSelectedKeys: ['000_1'],
    menu: [
        {
            key: '000',
            children: ['000_1']
        }, {
            key: '001',
            children: ['001_1', '001_2', '001_3']
        }, {
            key: '002',
            children: ['002_1', '002_2']
        }, {
            key: '003',
            children: ['003_1', '003_2', '003_3', '003_4']
        }, {
            key: '004',
            children: ['004_1', '004_2']
        }, {
            key: '005',
            children: ['005_1']
        }, {
            key: '006',
            children: ['006_1', '006_2']
        }, {
            key: '007',
            children: ['007_1', '007_2']
        }, {
            key: '008',
            children: ['008_1', '008_2']
        }
    ]
};

const hotelkeeperAdmin = {
    defaultOpenKeys: ['300', '301'],
    defaultSelectedKeys: ['300_1'],
    menu: [
        {
            key: '300',
            children: ['300_1', '300_2']
        }, {
            key: '301',
            children: ['301_1']
        }
    ]
};

const travelkeeperAdmin = {
    defaultOpenKeys: ['400', '401'],
    defaultSelectedKeys: ['400_1'],
    menu: [
        {
            key: '400',
            children: ['400_1', '400_2']
        }, {
            key: '401',
            children: ['401_1']
        }
    ]
};

const foodkeeperAdmin = {
    defaultOpenKeys: ['500', '501'],
    defaultSelectedKeys: ['500_1'],
    menu: [
        {
            key: '500',
            children: ['500_1', '500_2']
        }, {
            key: '501',
            children: ['501_1']
        }
    ]
};

module.exports = {
    admin,
    hotelkeeperAdmin,
    travelkeeperAdmin,
    foodkeeperAdmin,
}
