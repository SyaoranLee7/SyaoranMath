import setting from "./setting.js";
import MegaMath from "@/utils/MegaMath.js";

const funcs = {
    /**
     * 计算下一帧, 每格的状态遵循以下规则:
     * 1. 周围存在三个细胞, 则该格细胞为生
     * 2. 周围存在两个细胞, 则该细胞状态不变
     * 3. 其他情况下, 该细胞状态改为死
     * @param {Array} cells: 当前活细胞数组
     * @param {Number} length: 网格边长
     */
    getLife ( cells, length = 100 ) {
        // console.log("cells:", cells);
        const result = [];

        /* 仅对状态为生的细胞及其四周进行检测, 这样避免了循环所有格子 */
        const list = this.getCheckList( cells, length );

        list.forEach(i => {
            // console.log("=================");
            // console.log("当前坐标为x=" + i[0] + ", y=" + i[1]);
            const count = this.getNumsAround(i, cells, length);

            if ( count === 3 ) {
                /* 周围存在3个细胞, 该细胞为生 */
                result.push([ i[0], i[1] ]);
            } else if ( count === 2 ) {
                /* 周围存在2个细胞, 该细胞保持原样 */
                const exist = cells.find(cellsItem => {
                    return cellsItem[0] === i[0] && cellsItem[1] === i[1];
                });
                if (exist) result.push(exist);
            }
        });

        return result;
    },

    /**
     * 根据生成模式, 初始化细胞
     * @param {String} mode: 初始模式, 默认为"滑翔机"
     */
    getInitLife ( mode = "glider" ) {
        const cells = setting.modes.find( i => {
            return i.value === mode;
        });
        return cells.data;
    },

    /**
     * 随机生成初始生命
     * @param {Number} length: 网格边长
     * @param {Number} num: 生命个数
     */
    getRandomLife ( length = 100, num = 800 ) {
        const life = [];
        for ( let i = 0; i < num; i++ ) {
            const x = MegaMath.getRandomInt( 100 ) - length / 2;
            const y = MegaMath.getRandomInt( 100 ) - length / 2;
            life.push([ x, y ]);
        }
        return life;
    },

    /**
     * 获取下一帧可能改变状态的细胞
     * @param {Array} cells: 状态为生的细胞集合
     * @param {Number} length: 系统网格的边长
     */
    getCheckList ( cells, length ) {
        const list = [];
        const border = length / 2;
        cells.forEach(i => {
            // const x = i[0];
            // const y = i[1];
            for ( let x = i[0] - 1; x <= i[0] + 1; x++ ) {
                for ( let y = i[1] - 1; y <= i[1] + 1; y++ ) {
                    if ( x >= -1 * border && x <= border && y >= -1 * border && y <= border) {
                        const exist = list.find(listItem => {
                            return listItem[0] === x && listItem[1] === y;
                        });
                        if (!exist) list.push([ x , y ]);
                    }
                }
            }
        });
        return list;
    },

    /**
     * 计算某个细胞周围存在多少个细胞
     * @param {Array} point: 当前细胞坐标
     * @param {Array} cells: 状态为生的细胞集合
     * @param {Number} length: 系统网格的边长
     */
    getNumsAround ( point, cells, length ) {
        let count = 0;
        const border = length / 2;
        for ( let x = point[0] - 1; x <= point[0] + 1; x++ ) {
            for ( let y = point[1] - 1; y <= point[1] + 1; y++ ) {
                if ( x === point[0] && y == point[1] ) continue; // 剔除掉这个生命本身
                // 确保检查的范围不超过边界
                if ( x >= -1 * border && x <= border && y >= -1 * border && y <= border ) {
                    const exist = cells.find(i => {
                        return i[0] === x && i[1] === y;
                    });
                    if (exist) count++;
                }
            }
        }
        return count;
    }
};
export default funcs;
