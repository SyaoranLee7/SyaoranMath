import MegaMath from "@/utils/MegaMath.js";
const funcs = {
    /**
     * 生成迷宫数据
     * @param {Number} length: 生成迷宫的边长
     */
    getMaze (length = 100) {
        const getDataSets = this.getDataSets(length);
        const notAccessed = getDataSets.notAccessed; // 生成待处理数据
        const dataSets = getDataSets.dataSets; // 迷宫数据
        const accessed = [];
        console.log("dataSets:", dataSets);
        console.log("notAccessed:", notAccessed);

        let count = length * length;
        let cur = MegaMath.getRandomInt(count);
        let offs = [-length, length, -1, 1];         // 四周顶点在notAccessed的偏移量
        let offr = [-1, 1, 0, 0];                        // 四周顶点在arr的纵向偏移量
        let offc = [0, 0, -1, 1];                        // 四周顶点在arr的横向偏移量
        accessed.push(cur);
        notAccessed[cur] = 1;
        console.log("count:", count);
        console.log("cur:", cur);
        console.log("offs:", offs);
        console.log("offr:", offr);
        console.log("offc:", offc);

        let stop = 0;
        while (stop < 100) {
            stop++;
        // while (accessed.length < count) {
            console.log("==================");
            let tr = Math.floor(cur / length);
            let tc = cur % length;
            let num = 0;
            let off = -1;
            console.log("tr:", tr);
            console.log("tc:", tc);
            console.log("off:", off);

            // 遍历上下左右顶点
            while (++num < 5) {
                console.log("******num:", num);
                let around = MegaMath.getRandomInt(4);
                let nr = tr + offr[around];
                let nc = tc + offc[around];
                console.log("around:", around);
                console.log("nr:", nr);
                console.log("nc:", nc);
                if (nr >= 0 && nc >= 0 && nr < length && nc < length && notAccessed[cur + offs[around]] === 0) {
                    off = around;
                    break;
                }
            }
            // 四周顶点均被访问，则从已访问的顶点中随机抽取一个为cur
            if (off < 0) {
                cur = accessed[MegaMath.getRandomInt(accessed.length)];
            } else {
                tr = 2 * tr + 1;
                tc = 2 * tc + 1;
                dataSets[tr + offr[off]][tc + offc[off]] = 0;
                cur = cur + offs[off];
                notAccessed[cur] = 1;
                accessed.push(cur);
                console.log("else tr:", tr);
                console.log("else tc:", tc);
            }
            console.log("cur:", cur);
        }

        console.log("dataSets result:", dataSets);
        return dataSets;
    },

    /**
     * 生成初始迷宫数据集(二维)
     * 最终结果为 [1, 1, 1, 1, 1, 1, ......, 1, 1
                  1, 0, 1, 0, 1, 0, ......, 0, 1
                  1, 1, 1, 1, 1, 1, ......, 1, 1
                  1, 0, 1, 0, 1, 0, ......, 0, 1
                  ...
                  1, 0, 1, 0, 1, 0, ......, 0, 1
                  1, 1, 1, 1, 1, 1, ......, 1, 1], 其中1表示墙, 0表示路
     * @param {Number} length: 生成迷宫的边长
     */
    getDataSets (length = 100) {
        const dataSets = [];
        const notAccessed = [];

        for (let i = 0; i < 2 * length + 1; i++) {
            dataSets[i] = []; // 每一行视为一个数组

            for (let n = 0; n < 2 * length + 1; n++) {
                /* tip: 两个连续整数异或, 奇数^偶数=1 */
                /* 以下判断意思: 对矩阵中的某一项, 若行数为偶数且列数为也为偶数, 则该点为路 */
                if ((n ^ (n - 1)) === 1 && (i ^ (i - 1)) === 1) {
                    dataSets[i][n] = 0; // 0表示该点为路
                    notAccessed.push(0);
                } else {
                    dataSets[i][n] = 1; // 1表示该点墙
                }
            }
        }
        return { notAccessed, dataSets };
    }
};
export default funcs;
