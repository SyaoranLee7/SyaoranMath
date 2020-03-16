<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">计算闵可夫斯基距离</div>
            <div class="link" href="https://my.oschina.net/hunglish/blog/787596">
                <span>指引明路</span>
            </div>
        </div>

        <div class="lan-content">
            <div class="setting-base">
                <div class="title">基础设置</div>
                <el-form
                    :model="inputData"
                    class="setting-base-form"
                    label-width="120px"
                    label-position="left">
                    <el-form-item label="n维向量A">
                        <el-input v-model="inputData.pointA" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="n维向量B">
                        <el-input v-model="inputData.pointB" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="变参数p">
                        <el-select v-model="inputData.p" placeholder="请选择便参数p">
                            <el-option label="p = 1" value="1"></el-option>
                            <el-option label="p = 2" value="2"></el-option>
                            <el-option label="p → +∞" value="0"></el-option>
                        </el-select>
                        <div class="hint">
                            多维度间以","隔开. AB两点维度需一致
                        </div>
                    </el-form-item>
                </el-form>
            </div>

            <div class="setting-advance">
                <div class="title">进阶设置</div>
            </div>

            <div class="setting-result">
                <div class="title">计算结果</div>
                <el-button
                    class="math-btn"
                    type="primary"
                    @click="runMath">
                    计算{{ resultTitle }}
                </el-button>
                {{ result }}
            </div>
        </div>

    </div>
</template>
<script>
import MinkowskiDistance from "./MinkowskiDistance.js";
export default {
    data () {
        return {
            inputData: {
                pointA: "1,1,1", // 向量A
                pointB: "5,6,7", // 向量B
                p: "1"
            },
            result: ""
        };
    },

    computed: {
        resultTitle () {
            const p = Number(this.inputData.p);
            if (p === 1) {
                return "曼哈顿距离";
            } else if (p === 2) {
                return "欧里几得距离";
            } else if (p === 0) {
                return "切比雪夫距离";
            }
            return "";
        }
    },

    methods: {
        // 开始计算
        runMath () {
            this.result = MinkowskiDistance.getMinkowskiDistance(this.inputData.pointA, this.inputData.pointB, this.inputData.p);
        }
    },

    created () {
    }
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.lan-main {
    .setting-base {
        .el-select { width: 100%; }
    }
}
</style>
