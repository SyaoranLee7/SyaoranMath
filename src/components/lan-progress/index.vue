<template>
    <div class="lan-progress">
        <el-progress
            v-show="show"
            class="progress"
            type="circle"
            :percentage="percentage"
            :stroke-width="8"
            :width="180">
        </el-progress>
    </div>
</template>
<script>
export default {
    props: {
        percentage: {
            type: Number,
            default: 0
        }
    },

    data () {
        return {
            val: this.percentage,
            show: false
        };
    },

    watch: {
        percentage (p) {
            this.val = p;
        },
        val (v) {
            console.log("v:", v);
            if (v && v !== 100) {
                this.show = true;
            } else if (v === 100) {
                this.finish();
            }
        }
    },

    methods: {
        finish () {
            console.log("finish");
        }
    },

    created () {
    }
};
</script>

<style lang="scss" scoped>
.lan-progress {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    .progress {
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
}
</style>
