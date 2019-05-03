const admin = {
    defaultOpenKeys: ['000', '001', '002', '003', '004', '005', '006', '007', '008'],
    defaultSelectedKeys: ['000_1'],
    menu: [
        {
            key: '000',
            children: ['000_1', '000_2']
        }, {
            key: '003',
            children: ['003_1', '003_2', '003_3', '003_4']
        }, {
            key: '007',
            children: ['007_1', '007_2']
        }, {
            key: '008',
            children: ['008_1', '008_2']
        }, {
            key: '004',
            children: ['004_1', '004_2']
        }, {
            key: '005',
            children: ['005_1']
        }
    ]
};

const hotelkeeperAdmin = {
    defaultOpenKeys: ['300', '301', '302', '303'],
    defaultSelectedKeys: ['300_1'],
    menu: [
        {
            key: '300',
            children: ['300_1', '300_2']
        }, {
            key: '301',
            children: ['301_1']
        }, {
            key: '302',
            children: ['302_1']
        }, {
            key: '303',
            children: ['303_1']
        }
    ]
};

const travelkeeperAdmin = {
    defaultOpenKeys: ['400', '401', '402', '403'],
    defaultSelectedKeys: ['400_1'],
    menu: [
        {
            key: '400',
            children: ['400_1', '400_2']
        }, {
            key: '401',
            children: ['401_1']
        }, {
            key: '402',
            children: ['402_1']
        }, {
            key: '403',
            children: ['403_1']
        }
    ]
};

const foodkeeperAdmin = {
    defaultOpenKeys: ['500', '501', '502'],
    defaultSelectedKeys: ['500_1'],
    menu: [
        {
            key: '500',
            children: ['500_1', '500_2']
        }, {
            key: '501',
            children: ['501_1']
        }, {
            key: '502',
            children: ['502_1']
        }
    ]
};

module.exports = {
    admin,
    hotelkeeperAdmin,
    travelkeeperAdmin,
    foodkeeperAdmin,
}
