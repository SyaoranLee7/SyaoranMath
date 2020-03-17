<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">LevelCohesion层次凝聚聚类算法</div>
            <div class="link" href="https://www.cnblogs.com/weimiaomiao/p/4318244.html">
                <span>指引明路</span>
            </div>
        </div>

        <div class="lan-content">
            <div class="setting-base">
                <div class="title">参数设置</div>
                <el-form
                    class="setting-base-form"
                    :model="inputData"
                    label-width="120px"
                    label-position="left">
                    <el-form-item label="数据个数" required>
                        <el-input v-model="inputData.total" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="模拟簇数目" required>
                        <el-input v-model="inputData.clust" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="终止类型" required>
                        <el-tooltip
                            v-show="inputData.type === 'minClust'"
                            effect="dark"
                            content="聚合到多少簇时终止"
                            placement="top">
                            <div class="lan-form-tooltip" style="margin-left: -50px;">
                                <i class="el-icon-warning" />
                            </div>
                        </el-tooltip>
                        <el-tooltip
                            v-show="inputData.type === 'maxDistance'"
                            effect="dark"
                            content="聚合到簇中心间距为多少时停止"
                            placement="top">
                            <div class="lan-form-tooltip" style="margin-left: -50px;">
                                <i class="el-icon-warning" />
                            </div>
                        </el-tooltip>
                        <el-select v-model="inputData.type">
                            <el-option label="最小簇数目" value="minClust"></el-option>
                            <el-option label="最大簇间距" value="maxDistance"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="inputData.type === 'minClust'" label="最小簇数目" required>
                        <el-input v-model="inputData.minClust" type="text"></el-input>
                    </el-form-item>
                    <el-form-item v-show="inputData.type === 'maxDistance'" label="最大簇间距" required>
                        <el-input v-model="inputData.maxDistance" type="text"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="initData">生成随机数据</el-button>
                <el-button type="primary" @click="run">开始</el-button>
            </div>

            <div class="setting-result">
                <div class="title">算法结果</div>
                <div class="result">
                    <div id="preData"></div>
                    <div id="resultData"></div>
                </div>
                <div class="message">
                    <div v-for="(m, i) in message" :key="i" class="message-item">
                        {{ m }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { clone } from "@/utils";
import MegaMath from "@/utils/MegaMath.js";
import LevelCohesion from "./LevelCohesion.js";
import constant from "@/utils/constant.js";
export default {
    data () {
        return {
            // 输入项
            inputData: {
                total: 100,
                clust: 3,
                type: "maxDistance",
                minClust: 3,
                maxDistance: 200
            },

            dataSets: [], // 初始数据集
            result: [], // 结果数据
            message: [] // 处理中的消息
        };
    },

    methods: {
        run () {
            this.message = [];
            if (!this.dataSets.length) this.initData();

            /*
             * 原始数据dataSets格式: [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], ...]
             * 需要将原始数据处理成result, 即每个坐标点都是一个独立的簇(每个数据都包一层数组)
             * 处理数据result格式: [[[x1, y1, z1]], [[x2, y2, z2]], [[x3, y3, z3]], ...]
             */
            let processingDataSets = this.dataSets.map(i => {
                return [i];
            });

            if (this.inputData.type === "minClust") {
                let i = 1; // 计数器
                /* 只有当数据的簇数目比闸值大时, 才执行算法 */
                while (processingDataSets.length > Number(this.inputData.minClust)) {
                    processingDataSets = LevelCohesion.cohesionByNumber(this.inputData.minClust, processingDataSets).result;
                    const str = "正在进行第" + i + "次聚类...: ";
                    const num = "结果中有" + processingDataSets.length + "个簇";
                    this.message.push(str + num); // 输出信息
                    i++;
                }
                this.result = processingDataSets;
                this.initEchart();
            } else if (this.inputData.type === "maxDistance") {
                let result = [];
                let i = 0; //计数器
                /* 当待聚合数据为空时才停止算法 */
                while (processingDataSets.length) {
                    const res = LevelCohesion.cohesionByDistance(this.inputData.maxDistance, processingDataSets, result);
                    processingDataSets = res.processingResult;
                    result = res.result;
                    const str = "正在进行第" + i + "次聚类...: ";
                    const num = "结果中有" + result.length + "个簇, 还有" + processingDataSets.length + "个簇待聚类";
                    this.message.push(str + num); // 输出信息
                    i++;
                }
                this.result = result;
                this.initEchart();
            }
        },

        /* 生成原始数据 */
        initData () {
            this.dataSets = LevelCohesion.getDataSets3D(this.inputData);
            // 等等删掉
            this.processResult = this.dataSets.map(i => {
                return [i];
            });
            this.initOriginEchart();
        },

        /* 原始数据图表渲染 */
        initOriginEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("preData"));

            const xAxis3D = { type: "value" };
            const yAxis3D = { type: "value" };
            const zAxis3D = { type: "value" };
            const grid3D = {
                axisLine: { lineStyle: { color: "#fff" } },
                axisLabel: { show: false },
                axisTick: { show: false },
                axisPointer: { show: false },
                environment: "#000000"
            };
            const series = {
                type: "scatter3D",
                data: this.dataSets,
                symbol: "circle",
                symbolSize: 5,
                itemStyle: { color: "#FFFFFF" }
            };

            const option = {xAxis3D, yAxis3D, zAxis3D, grid3D, series};
            dom.setOption(option);
        },

        /* 数据聚类后表渲染 */
        initEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("resultData"));

            const xAxis3D = { type: "value" };
            const yAxis3D = { type: "value" };
            const zAxis3D = { type: "value" };
            const grid3D = {
                axisLine: { lineStyle: { color: "#fff" } },
                axisLabel: { show: false },
                axisTick: { show: false },
                axisPointer: { show: false },
                environment: "#000000"
            };
            const seriesArr = [];
            for (let i = 0; i < this.result.length; i++) {
                const obj = {
                    type: "scatter3D",
                    data: this.result[i],
                    symbol: "circle",
                    symbolSize: 5,
                    itemStyle: { color: constant.colorBoxDark[i] }
                };
                seriesArr.push(obj);
            }
            const series = [...seriesArr];

            const option = {xAxis3D, yAxis3D, zAxis3D, grid3D, series};
            dom.setOption(option);
        }
    }
};
</script>
<style lang="scss" scoped>
.lan-main {
    .result {
        display: flex;
        #preData, #resultData {
            display: inline-block;
            width: calc(50% - 40px);
            height: 500px;
            border: 1px solid #666666;
            margin: 20px;
            flex-shrink: 0;
        }
    }
}
</style>
