import MegaMath from "@/utils/MegaMath.js";
const funcs = {
    /**
     * A-Star算法搜索路径
     * @param {Array} maze: 迷宫数据, 其中的点代表墙
     * @param {Number, String} l: 迷宫边长
     */
    Astar (maze, l) {
        const length = Number(l) + 2; // 迷宫边长
        const dataSets = this.getMazeDataSets(maze, length); // 迷宫数据二维数组, 其中1路, 0代表墙
        const entries = this.getMazeEntry(dataSets);
        const startPoint = entries[0]; // 入口坐标
        const distination = entries[1]; // 出口坐标
        const openList = []; // 待测试的点的集合
        const closeList = this.getDataSets(length); // 已测试完的点的集合. 1代表未测试, 0代表测试过的点

        // console.log("maze:", maze);
        // console.log("dataSets:", dataSets);
        // console.log("length:", length);
        // console.log("closeList:", closeList);
        // console.log("startPoint:", startPoint);
        // console.log("distination:", distination);

        let up; // 上侧格子(超出边缘则视为墙)
        let down; // 下侧格子(超出边缘则视为墙)
        let left; // 左侧格子(超出边缘则视为墙)
        let right; // 右侧格子(超出边缘则视为墙)
        let point; // 当前点p
        let x; // 当前点x轴坐标
        let y; // 当前点y轴坐标
        let path; // 结果路径数组

        /**** 初始化一些事情 ****/
        openList.push({
            x: startPoint.x,
            y: startPoint.y,
            value: dataSets[startPoint.x][startPoint.y],
            g: 0
        }); // 将起点塞进openList

        let stop = false;
        while (!stop) {
            // 每次大循环开始时, 选取openList中的第一个不在closeList的点为当前点p
            point = openList.find(i => {
                return !this.checkIsInCloseList(i, closeList);
            });
            x = point.x; // 初始点x坐标
            y = point.y; // 初始点y坐标

            closeList[x][y] = 0; // 将当前点p状态改为已测试

            up = (x + 1 >= length) ? { x: x + 1, y, value: 0 } : { x: x + 1, y, value: dataSets[x + 1][y] }; // 上侧格子(超出边缘则视为墙)
            down = (x - 1 < 0) ? { x: x - 1, y, value: 0 } : { x: x - 1, y, value: dataSets[x - 1][y] }; // 下侧格子(超出边缘则视为墙)
            left = (y - 1 < 0) ? { x, y: y - 1, value: 0 } : { x, y: y - 1, value: dataSets[x][y - 1] }; // 左侧格子(超出边缘则视为墙)
            right = (y + 1 >= length) ? { x, y: y + 1, value: 0 } : { x, y: y + 1, value: dataSets[x][y + 1] }; // 右侧格子(超出边缘则视为墙)
            const near = [up, right, down, left]; // 选取点的四周点集, 按上右下左的顺序排列

            /**
             * 对当前点p的上右下左4个点进行循环处理, 若点为路 & 未在closeList中修改过状态
             */
            near.forEach(aroundPoint => {
                if (aroundPoint.value === 1 && !this.checkIsInCloseList(aroundPoint, closeList) && !stop) {
                    // console.log("======x:" + aroundPoint.x + ", y:" + aroundPoint.y + "==========");
                    // console.log("该点可通过并且不在clostList中");
                    if (aroundPoint.x === distination.x && aroundPoint.y === distination.y) {
                        // console.log("找到终点了");
                        openList.push({
                            x: aroundPoint.x,
                            y: aroundPoint.y,
                            value: aroundPoint.value,
                            parent: { x, y }
                        });
                        stop = true;
                        path = this.getPath(openList);
                    } else if (!this.checkIsInOpenList(aroundPoint, openList)) {
                        // 如果该点不在openList中, 则添加进去, 并将当前点p设置为该点的父节点
                        const aroundG = point.g + this.getPrice(point, aroundPoint); // 该点的G值(经由当前点p而来)
                        const aroundH = this.getPrice({ x: aroundPoint.x, y: aroundPoint.y }, distination); // 该点的H值(即到终点的距离)
                        openList.push({
                            x: aroundPoint.x,
                            y: aroundPoint.y,
                            value: aroundPoint.value,
                            g: aroundG,
                            h: aroundH,
                            f: aroundG + aroundH,
                            parent: { x, y }
                        });
                    } else {
                        // 如果该点在openList中, 检查通过当前点p到该点的G值来判断是否会更有效
                        const totalPrice = this.getPrice(point, aroundPoint) + point.g; // 由当前点p路径到该点的距离G值
                        if (totalPrice < aroundPoint.g) {
                            aroundPoint.parent = { x, y }; // 如果更有效, 则将该点的父节点改为当前点p
                            aroundPoint.g = totalPrice; // 如果更有效, 则更新该点G值
                            aroundPoint.f = totalPrice + aroundPoint.h; // 更新该点的代价值F
                            openList.sort(this.sortListByAttr("f"));
                        }
                    }
                }
            });
        }
        return path;
    },

    /**
     * 根据输入的迷宫来生成迷宫数据
     * @param {Array} maze: 迷宫点集
     * @param {Number, String} length: 迷宫边长
     * @return {Array} 返回一个迷宫数据二维数组, 其中1路, 0代表墙
     */
    getMazeDataSets (maze, length) {
        const dataSets = this.getDataSets(length);
        maze.forEach(i => {
            const x = i[0];
            const y = i[1];
            dataSets[i[0]][i[1]] = 0;
        });
        return dataSets;
    },

    /**
     * 生成初始迷宫数据集(二维)
     * 其中每个元素都为0, 代表都是一堵墙
     * @param {Number} length: 生成迷宫的边长
     * @return {Array} 返回初始化的迷宫数据
     */
    getDataSets (length) {
        const dataSets = [];
        for (let x = 0; x < length; x++) {
            dataSets[x] = [];
            for (let y = 0; y < length; y++) {
                dataSets[x][y] = 1;
            }
        }
        return dataSets;
    },

    /**
     * 根据输入的迷宫, 返回出入口点(默认出入口在上下)
     * @param {Array} dataSets: 迷宫矩阵
     * @param {Number, String} length: 迷宫边长
     */
    getMazeEntry (dataSets) {
        const entries = [];
        dataSets[0].forEach((i, index) => {
            if (i) entries.push({ x: 0, y: index }); // 入口坐标
        });
        dataSets[dataSets.length - 1].forEach((i, index) => {
            if (i) entries.push({ x: dataSets.length - 1, y: index }); // 出口坐标
        });
        return entries;
    },

    /**
     * 判断一个点是否在openList中
     * @param {Object} point: 待测点, 包含x与y坐标
     * @param {Array} openList: 待测列表
     * @return {Boolean} 该点存在于openList中则返回true, 否则返回false
     */
    checkIsInOpenList (point, openList) {
        let result = false;
        openList.forEach(i => {
            if (i.x === point.x && i.y === point.y) result = true;
        });
        return result;
    },

    /**
     * 判断一个点是否在closeList中
     * @param {Object} point: 待测点, 包含x与y坐标
     * @param {Array} closeList: 关闭列表, 其中1代表未测试, 0代表测试过的点
     * @return {Boolean} 该点存在于closeList中则返回true, 否则返回false
     */
    checkIsInCloseList (point, closeList) {
        const length = closeList.length;
        if (point.x < 0 || point.x > length - 1 || point.y < 0 || point.y > length - 1) return false;
        return !closeList[point.x][point.y];
    },

    /**
     * 获取一个点到终点的路径代价F=G+H, 其中G为起始点与p点距离，H为终点与p点距离
     * @param {Object} point: 待测点, 包含x与y坐标
     * @param {Array} start: 起始点
     * @param {Array} end: 终止点
     * @return {Boolean} 该点存在于closeList中则返回true, 否则返回false
     */
    getTotalPrice (point, start, end) {
        const startPoint = start.x + "," + start.y;
        const endPoint = end.x + "," + end.y;
        const p = point.x + "," + point.y;
        const g = MegaMath.getMinkowskiDistance(startPoint, p, 1);
        const h = MegaMath.getMinkowskiDistance(endPoint, p, 1);
        return g + h;
    },

    /**
     * 获取两点的曼哈顿距离
     * @param {Array} start: 起始点, 包含x与y坐标
     * @param {Array} end: 终止点, 包含x与y坐标
     * @return {Number} 两点的曼哈顿距离
     */
    getPrice (start, end) {
        const startPoint = start.x + "," + start.y;
        const endPoint = end.x + "," + end.y;
        return MegaMath.getMinkowskiDistance(startPoint, endPoint, 1);
    },

    /**
     * 数组根据某个属性排列
     * @param {String} property: 排序的属性
     * @return {Array} 排序后的数组
     */
    sortListByAttr (property) {
        return function (a,b) {
            return a[property] - b[property];
        };
    },

    /**
     * 根据openList来生成路径数组
     * @param {Array} list: 主方法中传入的openList
     * @return {Array} 包含路径信息的点集
     */
    getPath (list) {
        const arr = []; // 路径数组
        let node = list[list.length - 1]; // 初始节点为终点
        arr.push([node.x, node.y]);

        while (node.parent) {
            let parent = list.find(i => {
                return (i.x === node.parent.x && i.y === node.parent.y);
            });
            arr.push([parent.x, parent.y]); // 将父节点的坐标放进路径数组中
            node = parent; // 下次循环将对父节点查询
        }
        return arr;
    }
};
export default funcs;
