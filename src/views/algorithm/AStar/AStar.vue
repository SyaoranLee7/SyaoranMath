<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">A-Star算法搜寻迷宫路径</div>
            <div class="link">
                <span href="https://blog.csdn.net/wr132/article/details/45422045">指引明路</span>
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
                    <el-form-item label="迷宫边长">
                        <el-input v-model="length" type="text"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="createMaze">生成迷宫</el-button>
                <el-button type="primary" @click="start">开始搜索</el-button>
            </div>

            <div class="setting-result">
                <div class="title">算法结果</div>
                <div class="result">
                    <div id="resultData"></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import Prim from "./Prim.js";
import AStar from "./AStar.js";
export default {
    data () {
        return {
            inputData: {},
            length: 100, // 迷宫边长

            Maze: [], // 迷宫数据集
            path: [] // 路径数据集
        };
    },

    methods: {
        start () {
            if (!this.Maze.length) this.createMaze();

            this.path = AStar.Astar(this.Maze, this.length);
            this.initResultEchart();
        },

        // 生成迷宫
        createMaze () {
            this.path = [];
            this.Maze = Prim.getMaze(this.length); // 借用Prim页面的生成随机迷宫算法
            this.initResultEchart();
        },

        // 渲染迷宫
        initResultEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("resultData"), {}, { renderer: "svg" });
            const xAxis = {
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: -1
            };
            const yAxis = {
                type: "value",
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: -1
            };
            const grid = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };

            const seriesMaze = {
                type: "scatter",
                data: this.Maze,
                symbol: "rect",
                symbolSize: 6,
                itemStyle: { color: "#000000" },
                silent: true // 不响应鼠标操作
            };
            const seriesPath = {
                type: "scatter",
                data: this.path,
                symbol: "rect",
                symbolSize: 6,
                itemStyle: { color: "#FF0000" },
                silent: true // 不响应鼠标操作
            };
            const series = [seriesMaze, seriesPath];
            const option = {
                xAxis,
                yAxis,
                grid,
                series,
                animation: false
            };
            dom.setOption(option);
        },

        // 渲染路径
        initPathEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("resultData"), {}, { renderer: "svg" });
            const xAxis = {
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: -1
            };
            const yAxis = {
                type: "value",
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: -1
            };
            const grid = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };

            const series = {
                type: "scatter",
                data: this.Maze,
                symbol: "rect",
                symbolSize: 6,
                itemStyle: { color: "#000000" },
                silent: true // 不响应鼠标操作
            };
            const option = {
                xAxis,
                yAxis,
                grid,
                series,
                animation: false
            };
            dom.setOption(option);
        }
    },

    created () {
    },

    mounted () {
    }
};
</script>

<style lang="scss" scope>
.lan-main {
    .result {
        display: flex;
        #resultData {
            display: inline-block;
            width: 800px;
            height: 800px;
        }
    }
}
</style>
