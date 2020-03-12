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
                    <el-form-item label="变参数p">
                        <el-select v-model="inputData.p" placeholder="请选择便参数p">
                            <el-option label="p = 1" value="1"></el-option>
                            <el-option label="p = 2" value="2"></el-option>
                            <el-option label="p → +∞" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <div class="hint">
                            多维度间以","隔开. AB两点维度需一致
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="16" class="math-column result-column">
                    <el-button
                        class="math-btn"
                        type="primary"
                        @click="runMath">
                        计算闵可夫斯基距离
                    </el-button>
                    <el-form-item :label="resultTitle">
                        {{ result }}
                    </el-form-item>
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
                pointB: "",
                p: "1"
            },
            resultTitle: "",
            result: ""
        };
    },

    methods: {
        // 开始计算
        runMath () {
            this.result = this.getMinkowskiDistance(this.inputData.pointA, this.inputData.pointB, this.inputData.p);
        },

        getMinkowskiDistance (a, b, p) {
            const arrA = a.split(",");
            const arrB = b.split(",");
            const parP = Number(p);
            if (arrA.length !== arrB.length) {
                this.$message.error("维度不同, 无法计算");
                return "无法计算";
            } else if (parP) {
                if (parP === 1) {
                    this.resultTitle = "曼哈顿距离:";
                } else if (parP === 2) {
                    this.resultTitle = "欧里几得距离:";
                }
                let result = 0;
                arrA.forEach((item, index) => {
                    const cal = Math.abs(arrA[index] - arrB[index]);
                    result = result + Math.pow(cal, p);
                });
                result = Math.pow(result, 1 / p);
                return result;
            } else if (parP === 0) {
                this.resultTitle = "切比雪夫距离";
                let resultArr = [];
                arrA.forEach((item, index) => {
                    const cal = Math.abs(arrA[index] - arrB[index]);
                    resultArr.push(cal);
                });
                return Math.max(...resultArr);
            }
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
