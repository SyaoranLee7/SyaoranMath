<template>
    <div>
        <el-form
            :model="inputData"
            label-width="120px"
            label-position="left"
            style="margin-top: 40px;">
            <el-row type="flex" justify="start">

                <el-col :span="8" class="math-column">
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
                    <br>
                    <br>
                    <el-form-item label="n维向量集合">
                        <el-input v-model="inputData.points" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <div class="hint">
                            例如1,2,3*4,5,6*7,8,9. 各向量维度需保持一致
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="16" class="math-column result-column">
                    <el-button
                        class="math-btn"
                        type="primary"
                        @click="runMath">
                        AB的曼哈顿距离: {{ result }}
                    </el-button>
                    <el-button
                        class="math-btn"
                        type="primary"
                        @click="runMax">
                        多维最远曼哈顿距离: {{ resultMax }}
                    </el-button>
                    <div
                        v-for="row in distance"
                        :key="row[0][0]"
                        class="check-row">
                        <div
                            v-for="column in row"
                            :key="column"
                            class="check-column">
                            {{ column }}
                        </div>
                    </div>
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
            distance: [],
            result: "",
            resultMax: ""
        };
    },

    methods: {
        // 开始计算
        runMath () {
            this.result = this.getManHattanDistance(this.inputData.pointA, this.inputData.pointB);
        },
        runMax () {
            this.resultMax = this.getMaxManHattanDistance(this.inputData.points);
        },

        getManHattanDistance (a, b) {
            const arrA = a.split(",");
            const arrB = b.split(",");
            if (arrA.length !== arrB.length) {
                this.$message.error("维度不同, 无法计算");
                return "无法计算";
            } else {
                let result = 0;
                arrA.forEach((item, index) => {
                    result = result + Math.abs(arrA[index] - arrB[index]);
                });
                return result;
            }
        },

        getMaxManHattanDistance (arrayPoints) {
            const points = arrayPoints.split("*");

            const distance = [];
            points.forEach((a, index) => {
                const row = [];
                points.forEach((b) => {
                    row.push(this.getManHattanDistance(a, b));
                });
                distance.push(row);
            });
            this.distance = distance;

            let max = 0;
            distance.forEach((row) => {
                row.forEach((column) => {
                    if (column > max) max = column;
                });
            });
            return max;
        }
    },

    created () {
    }
};
</script>

<style scoped>
.math-column {
    text-align: left;
    border-right: 1px solid #E8E8E8;
    padding: 10px;
    height: 100%;
}
.result-column {
    display: flex;
    flex-direction: column;
}
.math-btn {
    width: 20%;
    margin: 5px 10px;
}
.hint {
    color: #CCCCCC;
}
.check-row {
    display: flex;
    flex-direction: row;
    text-align: center;
}
.check-column {
    width: 40px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #CCCCCC;
}
</style>
