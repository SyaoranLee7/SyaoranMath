<template>
    <div class="lan-main">

        <el-form
            :model="inputData"
            label-width="120px"
            label-position="left">
            <el-row type="flex" justify="start">

                <el-col :span="8" class="math-column">
                    <el-form-item label="数学期望">
                        <el-input v-model="inputData.mean" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="标准差">
                        <el-input v-model="inputData.standardDeviation" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="生成随机数量">
                        <el-input v-model="inputData.total" type="text"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="16" class="math-column result-column">
                    <el-button
                        class="math-btn"
                        type="primary"
                        @click="runMath">
                        计算结果: {{ result }}
                    </el-button>
                    <el-button
                        class="math-btn"
                        type="primary"
                        @click="checkResult">
                        多数据校验
                    </el-button>
                    <div id="check"></div>
                    <!-- <div class="data-sets">
                        <div
                            class="data-sets-item"
                            v-for="item in dataSets"
                            :key="item.id">
                            {{item.value}}
                        </div>
                    </div> -->
                </el-col>

            </el-row>
        </el-form>

    </div>
</template>
<script>
export default {
    data () {
        return {
        };
    },

    methods: {
    },

    created () {
    }
};
</script>

<style lang="scss" scoped>
</style>
