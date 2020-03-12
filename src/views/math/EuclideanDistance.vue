<template>
    <div class="lan-main">
        <el-form
            class="lan-form"
            :model="inputData"
            label-width="120px"
            label-position="left"
            style="margin-top: 40px;">
            <el-row class="lan-row" type="flex" justify="start">

                <el-col class="lan-col" :span="8">
                    <el-form-item label="n维向量A">
                        <el-input v-model="inputData.pointA" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="n维向量B">
                        <el-input v-model="inputData.pointB" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <div class="hint">
                            多维度间以","隔开. AB两点维度需一致
                        </div>
                    </el-form-item>
                </el-col>

                <el-col class="lan-col" :span="16">
                    <el-button
                        class="lan-btn"
                        type="primary"
                        @click="run">
                        AB的欧里几得距离: {{ result }}
                    </el-button>
                </el-col>

            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
    data () {
        return {
            inputData: {
                pointA: "",
                pointB: ""
            },
            result: ""
        };
    },

    methods: {
        // 开始计算
        run () {
            this.result = this.getEuclideanDistance(this.inputData.pointA, this.inputData.pointB);
        },

        getEuclideanDistance (pointA, pointB) {
            const a = pointA.split(",");
            const b = pointB.split(",");

            let result = 0;
            a.forEach((item, index) => {
                const dis = Math.pow(Number(a[index]) - Number(b[index]), 2);
                result = result + dis;
            });
            result = Math.sqrt(result);

            return result;
        }
    },

    created () {
    }
};
</script>

<style scoped>
</style>
