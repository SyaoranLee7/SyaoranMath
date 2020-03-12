<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <router-view :key="key" />
        </transition>
    </section>
</template>

<script>
export default {
    name: "AppMain",
    computed: {
        key () {
            return this.$route.path;
        }
    }
};
</script>

<style scoped>
.app-main {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: #F5F5F5;
}
</style>
