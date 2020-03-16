<template>
    <div class="lan-topmenu">

        <div v-for="m in menu" :key="m.name">

            <el-dropdown
                v-if="m.children"
                :show-timeout="0"
                :hide-timeout="0"
                @command="handleCommand">
                <div class="menu-item" :class="{ 'is-active': active === m.name }">{{ m.meta.title }}</div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                        v-for="submenu in m.children"
                        :key="submenu.name"
                        :command="submenu">
                        {{ submenu.meta.title }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <div
                v-else
                class="menu-item"
                :class="{ 'is-active': active === m.name }"
                @click="handleClick(m)">
                {{ m.meta.title }}
            </div>

        </div>

    </div>
</template>

<script>
import constantRoutes from "@/router";
export default {
    name: "LanTopMenu",

    data () {
        return {
            menu: [],
            active: "Home"
        };
    },

    computed: {
    },

    created () {
        const route = constantRoutes.options.routes.filter(m => {
            return !m.hidden;
        });
        const menu = route.map(m => {
            if (!m.children || !m.children.length) {
                return m;
            } else {
                const children = m.children.map(item => {
                    item.parent = {
                        name: m.name,
                        path: m.path
                    };
                    return item;
                });
                return m;
            }
        });
        this.menu = menu;

        // 定位
        const path = this.$route.path.split("/")[1];
        menu.forEach(item => {
            if (item.path === "/" + path) this.active = item.name;
        });
    },

    methods: {
        // 点击子菜单触发
        handleCommand (command) {
            this.active = command.parent.name;
            const url = command.parent.path + "/" + command.path;
            this.$router.push(url);
        },
        // 点击非下拉菜单触发
        handleClick (menu) {
            this.active = menu.name;
            this.$router.push(menu.path);
        }
    }
};
</script>

<style lang="scss" scoped>
.lan-topmenu {
    display: flex;
    height: 60px;
    color: #FFFFFF;
    font-size: 16px;
    border-bottom: 1px solid #272b34;
    .menu-item {
        height: 60px;
        line-height: 62px;
        margin: 0 30px;
        cursor: pointer;
        font-size: 14px;
        color: #FFFFFF;
        cursor: pointer;
        &:hover { border-bottom: 2px solid #FFFFFF; }
    }
    .is-active {
        border-bottom: 2px solid #FFFFFF;
    }
}
</style>
<style lang="scss">
.lan-topbar {
    .lan-topbar-main {
        .el-dropdown {
            color: #FFFFFF;
            font-size: 14px;
            height: 60px;
        }
    }
}
</style>
