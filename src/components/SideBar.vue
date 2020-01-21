<template>
    <div class="sidebar d-flex flex-column">
        <b-list-group>
            <b-list-group-item v-for="container in getContainers" :key="container.id"
                               @click="captureContainer(container.id)" :class="{'sidebar-item_active': getCurrentContainerId() === container.id}" class="sidebar-item">Контейнер {{container.id}}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import {BListGroup, BListGroupItem} from 'bootstrap-vue'

    export default {
        components: {
            BListGroup, BListGroupItem
        },
        data() {
            return {
            }
        },
        props: {
        },
        methods: {
            getCurrentContainerId() {
                return this.$store.getters.CAPTURED_CONTAINER_ID
            },
            captureContainer(id) {
                this.$store.commit('CAPTURE_CONTAINER', id)
            }
        },
        computed: {
            getContainers() {
                return this.$store.getters.CONTAINERS.filter(item => !item.hidden)
            }
        }
    }
</script>

<style lang="scss">
    .sidebar {
        background: #f5f5f5;
        padding: 10px;
        min-width: 100px;
        min-height: 100vh;
        width: 15%;
        height: auto;
        .sidebar-item {
            &:hover {
                cursor: pointer;
            }
        }
        .sidebar-item_active {
            background: #c2c2c2;
        }
    }
</style>