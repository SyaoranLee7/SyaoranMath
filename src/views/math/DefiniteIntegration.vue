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
                    <el-form-item label="被积函数类型">
                        <el-select v-model="inputData.type">
                            <el-option label="一元n次函数" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="inputData.type === 1" label="被积函数">
                        y = <el-input v-model="inputData.c" style="width: 80px"></el-input>
                    </el-form-item>
                </el-col>

                <el-col class="lan-col" :span="8">
                    <el-button
                        class="lan-btn"
                        type="primary"
                        style="width: 180px"
                        @click="run">
                        计算结果: {{ result }}
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
                type: 1,

                a: "",
                b: "",
                c: ""
            },
            result: ""
        };
    },

    methods: {
        // 开始计算
        run () {
            const type = this.inputData.type;
            const param = {
                a: Number(this.inputData.a) || 0,
                b: Number(this.inputData.b) || 0,
                c: Number(this.inputData.c) || 0
            };
            this.result = this.getEuclideanDistance(type, param);
        },

        getEuclideanDistance (type, param) {

        }
    },

    created () {
    }
};
</script>

<style scoped>
</style>
