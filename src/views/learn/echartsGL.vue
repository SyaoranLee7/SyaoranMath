<template>
    <div class="lan-main main">
        <div class="setting">
            <el-form
                :model="setting"
                label-width="180px"
                label-position="left">
                <el-row type="flex" justify="start">
                    <el-col :span="24" class="math-column">
                        <div class="menu-title">整体背景 - grid3D.environment</div>
                        <el-form-item label="environment">
                            <el-input v-model="setting.grid3D.environment" type="text"></el-input>
                        </el-form-item>

                        <div class="menu-title">特效总开关 - grid3D.postEffect</div>
                        <el-form-item label="enable">
                            <el-select v-model="setting.grid3D.postEffect.enable">
                                <el-option label="开启" :value="true"></el-option>
                                <el-option label="关闭" :value="false"></el-option>
                            </el-select>
                        </el-form-item>

                        <div class="menu-title">特效光晕 - grid3D.postEffect.bloom</div>
                        <el-form-item label="enable">
                            <el-select v-model="setting.grid3D.postEffect.bloom.enable">
                                <el-option label="开启" :value="true"></el-option>
                                <el-option label="关闭" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="强度bloomIntensity">
                            <el-input v-model="setting.grid3D.postEffect.bloom.bloomIntensity" type="text"></el-input>
                        </el-form-item>

                        <div class="menu-title">特效景深 - grid3D.postEffect.depthOfField</div>
                        <el-form-item label="开关enable">
                            <el-select v-model="setting.grid3D.postEffect.depthOfField.enable">
                                <el-option label="开启" :value="true"></el-option>
                                <el-option label="关闭" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="初始焦距focalDistance">
                            <el-input v-model="setting.grid3D.postEffect.depthOfField.focalDistance" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="完全聚焦focalRange">
                            <el-input v-model="setting.grid3D.postEffect.depthOfField.focalRange" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="焦距fstop">
                            <el-input v-model="setting.grid3D.postEffect.depthOfField.fstop" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="模糊半径blurRadius">
                            <el-input v-model="setting.grid3D.postEffect.depthOfField.blurRadius" type="text"></el-input>
                        </el-form-item>

                        <div class="menu-title">系列 - series</div>
                        <el-form-item label="series.symbolSize">
                            <el-input v-model="setting.series.symbolSize" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="series.itemStyle.color">
                            <el-input v-model="setting.series.itemStyleColor" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="series.blendMode">
                            <el-select v-model="setting.series.blendMode">
                                <el-option label="source-over" value="source-over"></el-option>
                                <el-option label="lighter" value="lighter"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button type="primary" @click="refresh">刷新</el-button>
            <el-button type="primary" @click="initData">重生数据簇</el-button>
        </div>

        <div v-if="show" id="e1" class="echarts"></div>
    </div>
</template>
<script>
import MegaMath from "@/util/MegaMath.js";
export default {
    data () {
        return {
            setting: {
                grid3D: {
                    environment: "#000000",
                    postEffect: {
                        enable: false,
                        bloom: {
                            enable: false,
                            bloomIntensity: 0.5
                        },
                        depthOfField: {
                            enable: false,
                            focalDistance: 100,
                            focalRange: 20,
                            fstop: 2.8,
                            blurRadius: 5
                        }
                    }
                },
                series: {
                    symbolSize: 8,
                    itemStyleColor: "#ffffff",
                    blendMode: "lighter"
                }
            },

            echartData: [],
            clust: 3,
            clustNumber: 200,
            center: [],
            standardDeviation: 100,

            show: true
        };
    },

    methods: {
        initData () {
            this.center = [];
            this.echartData = [];
            // 生成随机中心点, 定义域为[0, 1000]
            for (let i = 0; i < this.clust; i++) {
                const x = Math.random() * 1000;
                const y = Math.random() * 1000;
                const z = Math.random() * 1000;
                const center = {x: x, y: y, z: z};
                this.center.push(center);
            }

            // 对每个中心点生成簇
            this.center.forEach((center) => {
                for (let i = 0; i < this.clustNumber; i++) {
                    const x = MegaMath.getNormalDistribution(center.x, this.standardDeviation);
                    const y = MegaMath.getNormalDistribution(center.y, this.standardDeviation);
                    const z = MegaMath.getNormalDistribution(center.z, this.standardDeviation);
                    this.echartData.push([x, y, z]);
                }
            });

            this.initOriginEchart();
        },

        initOriginEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("e1"));

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
                axisLine: {
                    lineStyle: { color: "#fff" }
                },
                axisLabel: { show: false },
                axisTick: { show: false },
                axisPointer: { show: false },
                environment: this.setting.grid3D.environment,
                postEffect: this.setting.grid3D.postEffect,
                viewControl: {
                    // autoRotate: true
                }
            };

            const series = {
                type: "scatter3D",
                data: this.echartData,
                symbol: "circle",
                symbolSize: this.setting.series.symbolSize,
                itemStyle: {
                    color: this.setting.series.itemStyleColor
                },
                blendMode: this.setting.series.blendMode
            };

            const option = {xAxis3D, yAxis3D, zAxis3D, grid3D, series};
            dom.setOption(option);
        },

        refresh () {
            this.initOriginEchart();
        }
    },

    created () {
    },

    mounted () {
        this.initData();
    }
};
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: row;
}
.setting {
    width: 30%;
    margin: 10px;
    overflow: auto;
}
.menu-title {
    text-align: center;
    font-size: 16px;
    color: #999999;
    border-top: 1px solid #cccccc;
    line-height: 30px;
    height: 30px;
}
.echarts {
    width: 70%;
    height: 100%;
}
</style>
