<template>
    <div>
        <el-row type="flex" justify="start">
            <el-col :span="4" class="math-column">
                <el-button
                    class="math-btn"
                    type="primary"
                    @click="goNormalDistribution">
                    产生正态分布随机数
                </el-button>
            </el-col>

            <el-col :span="4" class="math-column">
                <el-button
                    class="math-btn"
                    type="primary"
                    @click="goBinomialDistribution">
                    产生二项分布结果(未完成)
                </el-button>
            </el-col>

            <el-col :span="4" class="math-column">
                <el-button
                    class="math-btn"
                    type="primary"
                    @click="goManhattanDistance">
                    计算曼哈顿距离
                </el-button>
            </el-col>

            <el-col :span="4" class="math-column">
                <el-button
                    class="math-btn"
                    type="primary"
                    @click="goCosine">
                    计算夹角余弦
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data () {
        return {
        };
    },

    methods: {
        goNormalDistribution () {
            this.$router.push("/math/normalDistribution");
        },
        goBinomialDistribution () {
            this.$router.push("/math/binomialDistribution");
        },
        goManhattanDistance () {
            this.$router.push("/math/manhattanDistance");
        },
        goCosine () {
            this.$router.push("/math/cosine");
        }
    },

    created () {
    }
};
</script>

<style scoped>
.math-column {
    text-align: left;
    padding: 10px;
    height: 100%;
}
</style>
