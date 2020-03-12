<template>
    <div class="lan-topbar">
      <div class="lan-topbar-main">

          <lan-topmenu class="topmenu"></lan-topmenu>

      </div>
    </div>
</template>

<script>
import lanTopmenu from "./lan-TopMenu";
export default {
    name: "TopBar",
    components: {
        lanTopmenu
    }
};
</script>

<style lang="scss" scoped>
.lan-topbar {
    width: 100%;
    height: 60px;
    background-color: #000000;
    .lan-topbar-main {
        display: flex;
        justify-content: center;
        width: 65%;
        margin: 0 auto;
        .topmenu {
        }
    }
}
</style>
