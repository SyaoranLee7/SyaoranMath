<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">Game Of Life</div>
        </div>

        <div class="lan-content">
            <div class="setting-result">
                <div class="result">
                    <div id="result"></div>
                </div>
            </div>
        </div>

        <lan-setting ref="lanSetting" :maxWidth="300">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="初始模式">
                    <el-select v-model="form.mode" placeholder="请选择模式" @change="modeChange">
                        <el-option
                            v-for="i in modeList"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="速度">
                    <el-input v-model="form.speed"></el-input>
                </el-form-item>
                <el-form-item label="计数">
                    <el-input v-model="count" disabled></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="random">随机生成</el-button>
            <el-button type="primary" @click="clear">停止</el-button>
            <el-button type="primary" @click="start">开始</el-button>
        </lan-setting>

    </div>
</template>
<script>
import helper from "./helper.js";
import setting from "./setting.js"; // 一些相关设置参数
import LanSetting from "@/components/lan-setting";

export default {
    data () {
        return {
            echarts: "",
            dom: "",
            clock: "", // 时钟
            count: 0,

            life: [], // 生命数组

            form: {
                mode: "pulsar", // 初始模式
                speed: 5 // 运行速度
            }
        };
    },

    components: { LanSetting },

    computed: {
        modeList () {
            const list = [];
            setting.modes.forEach( i => {
                list.push({ label: i.label, value: i.value });
            });
            return list;
        }
    },

    mounted () {
        this.echarts = require( "echarts" );
        this.dom = this.echarts.init( document.getElementById("result"), {}, { renderer: "svg" } );
        this.life = helper.getInitLife( this.form.mode );
        this.drawEchart(); // 生成原始数据图
    },

    methods: {
        start () {
            this.count = 0; // 计数器清零
            this.$refs.lanSetting.show = false;
            const speed = this.form.speed * 100;
            this.clock = setInterval(() => {
                this.count++;
                this.life = helper.getLife( this.life );
                this.drawEchart();
            }, speed);
        },

        clear () {
            clearInterval( this.clock );
        },

        random () {
            this.clear();
            this.life = helper.getRandomLife();
            this.drawEchart();
        },

        /* 当选择的初始模式发生改变时触发 */
        modeChange ( value ) {
            this.clear();
            this.life = helper.getInitLife( value );
            this.drawEchart();
        },

        // 初始化坐标格
        drawEchart () {
            const xAxis = setting.axis;
            const yAxis = setting.axis;
            const grid = setting.grid;

            const seriesLife = {
                type: "scatter",
                data: this.life,
                symbol: "rect",
                symbolSize: 14,
                symbolOffset: ["50%", "50%"],
                itemStyle: { color: "#00FF00" },
                silent: true // 不响应鼠标操作
            };
            const series = [ seriesLife ];

            const option = {
                xAxis,
                yAxis,
                grid,
                series,
                animation: false // 关闭动画
            };
            this.dom.setOption( option );
        }
    }
};
</script>

<style lang="scss" scope>
.lan-main {
    .result {
        display: flex;
        justify-content: center;
        #result {
            width: 1400px;
            height: 1400px;
            border: 1px solid #666666;
            margin: 20px;
            flex-shrink: 0;
        }
    }
}
</style>
