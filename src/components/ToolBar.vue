<template>
    <div class="d-flex justify-content-start tool-bar">
        <b-icon icon="arrow-counterclockwise" font-scale="2" class="nav-icon" @click="undo()"></b-icon>
        <b-icon icon="arrow-clockwise" font-scale="2" class="nav-icon" @click="redo()"></b-icon>
        <b-icon @click="addContainer($event)" icon="plus" font-scale="2" class="nav-icon"></b-icon>
        <b-icon @click="removeContainer($event)" icon="trash-fill" font-scale="2" class="nav-icon"></b-icon>
        <b-icon icon="archive" font-scale="2" class="nav-icon" @click="clearHistory()"></b-icon>
    </div>
</template>

<script>
    import {BIcon} from 'bootstrap-vue'

    export default {
        components: {
            BIcon
        },
        props: {
        },
        methods: {
            addContainer() {
                this.$store.commit('ADD_CONTAINER')
            },
            removeContainer() {
                this.$store.commit('REMOVE_CONTAINER')
            },
            undo() {
                this.$store.commit('UNDO')
            },
            redo() {
                this.$store.commit('REDO')
            },
            clearHistory() {
                this.$store.commit('CLEAR_HISTORY')
            }
        }
    }
</script>

<style  lang="scss">
    .tool-bar {
        background: #e6e6e6;
        padding: 10px;
    }
    .nav-icon {
        margin: 8px;
        &:hover {
            cursor: pointer;
        }
    }
</style>