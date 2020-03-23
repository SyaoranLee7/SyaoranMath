<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">密度聚类算法 - DBScan</div>
            <div class="link" href="https://baike.baidu.com/item/DBSCAN">
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
                    <el-form-item label="生成模式">
                        <el-select v-model="inputData.mode">
                            <el-option label="簇模式" :value="1"></el-option>
                            <el-option label="空心球体&球体" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode === 1" label="模拟簇数目">
                        <el-input v-model="inputData.clust" type="text"></el-input>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode === 1" label="数据个数">
                        <el-input v-model="inputData.totalClust" type="text"></el-input>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode === 2" label="小球半径标准差">
                        <el-input v-model="inputData.radiusSmall" type="text"></el-input>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode === 2" label="小球数据量">
                        <el-input v-model="inputData.totalSmall" type="text"></el-input>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode === 2" label="大球外半径标准差">
                        <el-input v-model="inputData.radiusOutside" type="text"></el-input>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode === 2" label="大球内半径标准差">
                        <el-input v-model="inputData.radiusIutside" type="text"></el-input>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode === 2" label="大球数据量">
                        <el-input v-model="inputData.totalRing" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="密度边长">
                        <el-tooltip
                            effect="dark"
                            content="数据分布在[0, 1000]的空间中"
                            placement="top">
                            <div class="lan-form-tooltip" style="margin-left: -60px;">
                                <i class="el-icon-warning" />
                            </div>
                        </el-tooltip>
                        <el-input v-model="inputData.length" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="密度闸值/个">
                        <el-input v-model="inputData.minPts" type="text"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="initData">
                    生成数据
                </el-button>
                <el-button type="primary" @click="start">
                    开始聚类
                </el-button>
            </div>

            <div class="setting-result">
                <div class="title">算法结果</div>
                <div class="result">
                    <div id="preData"></div>
                    <div id="resultData"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import DBScan from "./DBScan.js";
export default {
    name: "DBScan",

    data () {
        return {
            inputData: {
                mode: 2, // 生成随机数的模式
                clust: 3, // mode===1时的簇数目
                totalClust: 100, // mode===1时生成数据个数
                radiusSmall: 80, // mode===2时的内小球半径
                totalSmall: 300, // mode===2时的内小球数据量
                radiusOutside: 500, // mode===2时的大球外半径
                radiusIutside: 400, // mode===2时的大球内半径
                totalRing: 1000, // mode===2时的大球数据量
                length: 25, // 密度边长
                minPts: 5 // 密度闸值
            },
            dataSets: [], // 初始数据集
            result: [] // 渲染后的数据集
        };
    },

    methods: {
        start () {
            if (!this.dataSets.length) this.initData();
            this.result = DBScan.DBScan(this.inputData, this.dataSets);
            // this.initResultEchart();
        },

        /* 生成数据 */
        initData () {
            this.dataSets = DBScan.getDataSets3D(this.inputData);
            // console.log("dataSets:", this.dataSets);
            this.initOriginEchart();
        },

        // 渲染原始数据
        initOriginEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("preData"));

            const xAxis3D = {
                type: "value"
            };

            const yAxis3D = {
                type: "value"
            };

            const zAxis3D = {
                type: "value"
            };

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
