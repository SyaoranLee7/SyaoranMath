<template>
    <div class="app-wrapper">
        <top-bar></top-bar>
        <div class="main-container">
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
import TopBar from "./components/TopBar.vue";
import AppMain from "./components/AppMain.vue";

export default {
    name: "Layout",
    components: {
        TopBar,
        AppMain
    }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    .main-container {
        height: calc(100% - 60px;)
    }
}
</style>
