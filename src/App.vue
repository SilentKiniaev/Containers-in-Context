<template>
    <div id="app"
        @mouseup="onMouseUp($event)"
    >
        <ToolBar></ToolBar>
        <div class="d-flex align-items-stretch">
            <SideBar></SideBar>
            <Context></Context>
        </div>
    </div>
</template>

<script>
    import ToolBar from './components/ToolBar.vue'
    import SideBar from './components/SideBar.vue'
    import Context from './components/Context.vue'

    export default {
        name: 'app',
        components: {
            ToolBar, SideBar, Context
        },
        data() {
            return {
            }
        },
        methods: {
            onMouseUp() {
                this.$store.commit('FIX_CONTAINER')
            }
        }
    }
</script>

<style lang="scss">
    body {
        margin: 0;
    }
</style>