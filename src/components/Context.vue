<template>
    <div class="context" @mousemove="onMouseMove($event)" id="context-filed" ref="context-field">
        <Container v-for="containerData in getContainers" :containerData="containerData" :key="containerData.id"></Container>
    </div>
</template>

<script>
    import Container from './Container.vue'

    export default {
        components: {
            Container
        },
        methods: {
            onMouseMove() {
                if(!this.$store.getters.CONTEXT_CORDS.length)
                    this.$store.commit('SET_CONTEXT_CORDS', [this.$refs["context-field"].offsetLeft, this.$refs["context-field"].offsetTop])
                else return
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
    .context {
        min-height: 100vh;
        width: 100%;
        background: #fff;
        position: relative;
    }
</style>