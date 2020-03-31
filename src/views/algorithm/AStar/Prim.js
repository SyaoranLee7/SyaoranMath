import MegaMath from "@/utils/MegaMath.js";

const funcs = {
    /**
     * 生成迷宫数据
     * @param {Number} l: 生成迷宫的边长
     */
    getMaze (l) {
        const length = Number(l);
        const dataSets = this.getDataSets(length); // 迷宫数据, 这里1代表墙, 0代表路
        const finished = JSON.parse(JSON.stringify(dataSets)); // 完成矩阵, 这里1代表未完成, 0代表完成
        const list = []; // 队列
        let i = length * length; // 计数, 要处理length^2个数据

        while (i > 99) {
            // console.log("=============================");
            const list = []; // 队列

            /* 从完成矩阵中随机取出一个未完成的坐标 */
            const randomPoint = this.getRandomPoint(finished);
            const randomX = randomPoint.x; // 取随机行, randomX取值范围是[0, length-1]
            const randomY = randomPoint.y; // 取随机列, randomY取值范围是[0, length-1]

            finished[randomX][randomY] = 0; // 完成矩阵中修改对应信息
            i--; // 剩余待处理数据减少一个

            /* 该点为路, 则将四周的墙加入队列list中, 且更改迷宫数组中该点的值 */
            let up = (randomX + 1 >= length) ? 1 : dataSets[randomX + 1][randomY]; // 上侧格子(超出边缘则视为墙)
            let down = (randomX - 1 < 0) ? 1 : dataSets[randomX - 1][randomY]; // 下侧格子(超出边缘则视为墙)
            let left = (randomY - 1 < 0) ? 1 : dataSets[randomX][randomY - 1]; // 左侧格子(超出边缘则视为墙)
            let right = (randomY + 1 >= length) ? 1 : dataSets[randomX][randomY + 1]; // 右侧格子(超出边缘则视为墙)
            if (!this.wallOrRoad(dataSets, randomX, randomY, length)) { // 1代表墙, 0代表路
                if (up && randomX + 1 < length) list.push({ x: randomX + 1, y: randomY });
                if (down && randomX - 1 >= 0) list.push({ x: randomX - 1, y: randomY });
                if (left && randomY - 1 >= 0) list.push({ x: randomX, y: randomY - 1 });
                if (right && randomY + 1 < length) list.push({ x: randomX, y: randomY + 1 });
                dataSets[randomX][randomY] = 0;
            }

            /* 对本次循环中的队列进行处理, 每次随机选一个点 */
            while (list.length > 0) {
                // console.log("***********");
                const point = list[MegaMath.getRandomInt(list.length - 1)]; // 随机选取list中的一个点
                const x = point.x; // 取随机行
                const y = point.y; // 取随机列

                /* 该点为路, 则将四周的墙加入队列list中, 且更改迷宫数组中该点的值 */
                up = (x + 1 >= length) ? 1 : dataSets[x + 1][y]; // 上侧格子(超出边缘则视为墙)
                down = (x - 1 < 0) ? 1 : dataSets[x - 1][y]; // 下侧格子(超出边缘则视为墙)
                left = (y - 1 < 0) ? 1 : dataSets[x][y - 1]; // 左侧格子(超出边缘则视为墙)
                right = (y + 1 >= length) ? 1 : dataSets[x][y + 1]; // 右侧格子(超出边缘则视为墙)
                const check = this.wallOrRoad(dataSets, x, y, length);
                if (!check) { // 1代表墙, 0代表路
                    if (up && x + 1 < length) list.push({ x: x + 1, y });
                    if (down && x - 1 >= 0) list.push({ x: x - 1, y });
                    if (left && y - 1 >= 0) list.push({ x, y: y - 1 });
                    if (right && y + 1 < length) list.push({ x, y: y + 1 });
                    dataSets[x][y] = 0;
                }

                list.forEach((listItem, index) => {
                    if (listItem.x === x && listItem.y === y) list.splice(index, 1); // 在队列中剔除当前的点
                });
                finished[x][y] = 0; // 完成矩阵中修改对应信息
                i--;
            }
        }

        /* 在迷宫四周包一圈墙体 */
        dataSets.forEach(r => {
            r.push(1); // 每一行最后添加一面墙
            r.splice(0, 0, 1); // 每一行开头添加一面墙
        });
        const wall = [];
        for (let num = 0; num < length + 2; num++) wall.push(1);
        dataSets.splice(0, 0, JSON.parse(JSON.stringify(wall))); // 迷宫顶部添加一排墙
        dataSets.push(JSON.parse(JSON.stringify(wall))); // 迷宫底部添加一排墙

        /* 在上左&下右选取两个点作为出入口 */
        for (let e = 1; e < length; e++) {
            if (dataSets[1][e] === 0) {
                dataSets[0][e] = 0;
                break;
            }
        }
        for (let d = 1; d < length; d++) {
            if (dataSets[length][length + 1 - d] === 0) {
                dataSets[length + 1][length + 1 - d] = 0;
                break;
            }
        }

        // console.log("dataSets:", dataSets);
        return this.getMazePoint(dataSets);
    },

    /**
     * 生成初始迷宫数据集(二维)
     * 其中每个元素都为1, 代表都是一堵墙
     * @param {Number} length: 生成迷宫的边长
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
     * 该方法用来判断一个点应当被视为墙还是路
     * 判断该点上下左右是否至多只有一个路. 若是, 则该点可设置为路. 反之若该点四周存在两个以上的路, 则该点必须是墙
     * @param {Array} dataSets: 迷宫数据
     * @param {Number} x: 该点的x坐标
     * @param {Number} y: 该点的y坐标
     * @param {Number} length: 迷宫边长
     * @return {Number} 0表示该点为路, 1表示该点为墙
     */
    wallOrRoad (dataSets, x, y, length) {
        const point = dataSets[x][y]; // 待判断的点
        const up = (x + 1 >= length) ? 1 : dataSets[x + 1][y]; // 上侧格子(超出边缘则视为墙)
        const down = (x - 1 < 0) ? 1 : dataSets[x - 1][y]; // 下侧格子(超出边缘则视为墙)
        const left = (y - 1 < 0) ? 1 : dataSets[x][y - 1]; // 左侧格子(超出边缘则视为墙)
        const right = (y + 1 >= length) ? 1 : dataSets[x][y + 1]; // 右侧格子(超出边缘则视为墙)
        const near = [up, down, left, right]; // 相邻格子数组
        let count = 0; // 计数相邻格子有多少个路
        near.forEach(block => {
            if (block * point === 0) count++; // 墙与路相乘为0
        });

        if (count <= 1) {
            return 0;
        } else return 1;
    },

    /**
     * 从一个完成矩阵中随机选取一个未完成的点
     * @param {Array} arr: 完成矩阵, 其中1代表未完成, 0代表完成
     * @return {Object} x: 该未完成点的x坐标
     * @return {Object} y: 该未完成点的y坐标
     */
    getRandomPoint (arr) {
        let x = MegaMath.getRandomInt(arr.length - 1);
        let y = MegaMath.getRandomInt(arr.length - 1);
        let res = arr[x][y];
        while (res === 0) {
            x = MegaMath.getRandomInt(arr.length - 1);
            y = MegaMath.getRandomInt(arr.length - 1);
            res = arr[x][y];
        }
        return { x, y };
    },

    /**
     * 根据输入的迷宫矩阵来输出对应点集
     * @param {Array} dataSets: 迷宫矩阵, 其中1代表墙, 0代表路
     * return {Array} 包含一系列坐标的数组
     */
    getMazePoint (dataSets) {
        const result = [];
        dataSets.forEach((row, x) => {
            row.forEach((point, y) => {
                if (point) result.push([x, y]);
            });
        });
        return result;
    }
};
export default funcs;
