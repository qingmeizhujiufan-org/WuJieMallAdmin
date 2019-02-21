import assign from 'lodash/assign';

export default {
    //list 转 tree
    listToTree: (list) => {
        if (list.length === 0) return;
        const _list = [];
        list.map(item => _list.push(assign({}, item)));
        let arr = [];
        //首先状态顶层节点
        _list.map(item => {
            if (!item.pId) {
                arr.push(item);
            }
        });
        let toDo = [];
        arr.map(item => {
            toDo.push(item);
        });
        while (toDo.length) {
            let node = toDo.shift();
            for (let i = 0; i < _list.length; i++) {
                let row = _list[i];
                if (node.id === row.pId) {
                    if (node.children) {
                        node.children.push(row);
                    } else {
                        node.children = [row];
                    }
                    toDo.push(row);
                }
            }
        }

        function sortNumber(a, b) {
            return new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
        }

        arr.sort(sortNumber);

        return arr;
    },
    /**
     * @param 使用js让数字的千分位用,分隔
     */
    shiftThousands: (val, precision) => {
        if (typeof val !== "number") {
            return val;
        }
        let _val;
        /* 判断传入的小数点保留位数，没有则不截取 */
        if (arguments.length === 1) {
            _val = val.toString();
        } else {
            _val = val.toFixed(precision);
        }
        /* 判断传入的数值是否是整数，如果是，直接走原生千分位方法，不是，则通过正则处理为千分位 */
        if (_val.indexOf('.') === -1) {
            return val.toLocaleString();
        } else {
            return _val.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    },

    //导出excel文件
    exportExcel: options => {
        const {url, method, body, success, error} = options;
        fetch(url, {
            method: method,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': sessionStorage.token
            },
            body: body
        }).then((response) => {
            const disposition = response.headers.get('Content-Disposition');
            let filename;
            if (disposition && disposition.match(/attachment/)) {
                filename = disposition.replace(/attachment;filename=/, '').replace(/"/g, '');
                filename = decodeURIComponent(filename);
                filename = filename || 'file.xls';
                response.blob().then(blob => {
                    const fileUrl = URL.createObjectURL(blob);
                    const saveLink = document.createElement('a');
                    saveLink.href = fileUrl;
                    saveLink.download = filename;
                    let e = new MouseEvent('click');
                    saveLink.dispatchEvent(e);
                    // 使用完ObjectURL后需要及时释放, 否则会浪费浏览器存储区资源.
                    URL.revokeObjectURL(fileUrl);
                });
                if (typeof success === 'function' && success !== undefined) success();
            } else {
                if (typeof error === 'function' && error !== undefined){
                    response.json().then(res => error(res));
                }
            }
        });
    }
};