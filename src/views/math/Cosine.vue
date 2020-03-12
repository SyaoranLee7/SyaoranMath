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
                </el-col>

                <el-col :span="16" class="math-column result-column">
                    <el-button
                        class="math-btn"
                        type="primary"
                        @click="runMath">
                        AB的夹角余弦值: {{ result }}
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
        runMath () {
            this.result = this.getCosine(this.inputData.pointA, this.inputData.pointB);
        },

        getCosine (a, b) {
            const arrA = a.split(",");
            const arrB = b.split(",");
            if (arrA.length !== arrB.length) {
                this.$message.error("维度不同, 无法计算");
                return "无法计算";
            } else {
                let dot = 0;
                let lengthA = 0;
                let lengthB = 0;
                arrA.forEach((item, index) => {
                    dot = dot + arrA[index] * arrB[index];
                    lengthA = lengthA + Math.pow(arrA[index], 2);
                    lengthB = lengthB + Math.pow(arrB[index], 2);
                });
                const result = dot / (Math.sqrt(lengthA) * Math.sqrt(lengthB));
                return result.toFixed(4);
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
</style>
