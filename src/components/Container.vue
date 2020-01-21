<template>
        <div class="container" :class="{'container_active': getCapturedContainerId() === containerData.id}"
             @mousedown="onMouseDownContainer($event)"
             @mouseup="onMouseUpContainer($event)"
             @mousemove="onMouseMoveContainer($event)"
             :style="{
            width: containerData.size[0] + 'px',
            height: containerData.size[1] + 'px',
            left: containerData.cords[0] >= 0 ? containerData.cords[0] + 'px':0,
            top: containerData.cords[1] >= 0 ? containerData.cords[1] + 'px':0,
            zIndex: getCapturedContainerId() === containerData.id ? 3:2,
            cursor: resize.match ? resize.style:'default'
          }">
            <b-form-file id="file-small" size="sm" @change="onFileChange($event)"></b-form-file>
            <img :src="fileData.type === 'image'?fileData.src:''" alt="" class="loaded-content">
            <video controls :style="{display: fileData.type === 'video'?'block':'none'}" :src="fileData.src" :type="fileData.typeFull" class="loaded-content"></video>
            <audio controls :style="{display: fileData.type === 'audio'?'block':'none'}" :src="fileData.src" :type="fileData.typeFull"></audio>
        </div>
</template>

<script>
    import { BFormFile } from 'bootstrap-vue'
    export default {
        components: {
            BFormFile
        },
        data() {
            return {
                prevMouseCords: null,
                resize: {
                    match: false,//Совпадение по контуру
                    active: false,//Увеличение
                    style: '',
                    cords: [],
                    size: []
                },
                fileData: {type:'', src: '', typeFull: ''},
                fileTypes: ['video', 'image', 'audio']
            }
        },
        props: {
            containerData: Object
        },
        methods: {
            onFileChange(event) {
                const file = event.target.files[0]
                console.log(file)
                this.fileData.typeFull = file.type
                this.fileTypes.forEach(item => file.type.indexOf(item) !== -1 ? this.fileData.type = item : null)
                let reader = new FileReader()
                reader.onload = () => this.fileData.src = reader.result
                reader.readAsDataURL(file)
            },
            onMouseDownContainer(event) {
                this.$store.commit('CAPTURE_CONTAINER', this.containerData.id)
                this.$store.commit('FIX_CONTAINER', this.containerData.id)
                if(this.resize.match){
                    this.resize.active = true
                    this.$store.commit('SET_INITIAL_SIZE')
                } //Инициализация увеличения контейнера
                this.prevMouseCords = [event.clientX, event.clientY]
                this.$store.commit('SET_INITIAL_CORDS')
            },
            onMouseUpContainer() {
                this.$store.commit('FIX_CONTAINER')
            },
            onMouseMoveContainer(event) {
                let {cords} = this.containerData;
                //Процесс увеличения контейнера
                if(this.resizeContainer(event)) return
                //Процесс смещения контейнера
                if (this.$store.getters.FIXED_CONTAINER_ID !== this.containerData.id) return;
                this.$store.commit('SET_CURRENT_CORDS', [cords[0] + (event.clientX - this.prevMouseCords[0]), cords[1] + (event.clientY - this.prevMouseCords[1])])
                this.prevMouseCords = [event.clientX, event.clientY]
            },
            resizeContainer(event) {//Проверяем совпадение позиции мыши с позицией конутра контейнера
                const contCords = this.getContextCords();
                let {cords, size} = this.containerData;


                if(((contCords[0] + cords[0]-10) <= event.clientX && (contCords[0] + cords[0]+11) > event.clientX )//Левая граница
                    && ((contCords[1]+cords[1]+11) <= event.clientY) && (contCords[1]+cords[1]+size[1]-11) > event.clientY) {
                    this.resize.match = true
                    this.resize.style = 'ew-resize'
                    this.resize.cords = [cords[0] + (event.clientX - this.prevMouseCords[0]), cords[1]]
                    this.resize.size = [size[0] + (this.prevMouseCords[0] - event.clientX), size[1]]
                }
                else if(((contCords[0] + cords[0]+size[0]-11) <= event.clientX && (contCords[0] + cords[0]+size[0]+11) > event.clientX )//Правая граница
                    && ((contCords[1]+cords[1]+11) <= event.clientY) && (contCords[1]+cords[1]+size[1]-11) > event.clientY) {
                    this.resize.match = true
                    this.resize.style = 'ew-resize'
                    this.resize.cords = [cords[0], cords[1]]
                    this.resize.size = [size[0] + (event.clientX - this.prevMouseCords[0]), size[1]]
                }//left, right
                else if(((contCords[0] + cords[0]+11) <= event.clientX && (contCords[0] + cords[0] + size[0]-11) > event.clientX )//Верхняя граница
                    && ((contCords[1]+cords[1]-11) <= event.clientY) && (contCords[1]+cords[1]+11) > event.clientY) {
                    this.resize.match = true
                    this.resize.style = 'ns-resize'
                    this.resize.cords = [cords[0], cords[1] + (event.clientY - this.prevMouseCords[1])]
                    this.resize.size = [size[0], size[1] + (this.prevMouseCords[1] - event.clientY)]
                }
                else if(((contCords[0] + cords[0]+11) <= event.clientX && (contCords[0] + cords[0] + size[0]-11) > event.clientX )//Нижняя граница
                    && ((contCords[1] + cords[1]+size[1]-11) <= event.clientY) && (contCords[1]+cords[1]+size[1]+11) > event.clientY) {
                    this.resize.match = true
                    this.resize.style = 'ns-resize'
                    this.resize.cords = [cords[0], cords[1]]
                    this.resize.size = [size[0], size[1] + (event.clientY - this.prevMouseCords[1])]
                }//top, bottom
                else if(((contCords[0] + cords[0]-10) <= event.clientX && (contCords[0] + cords[0]+10) > event.clientX )//Пересечение верхней и левой границ
                    && ((contCords[1]+cords[1]-10) <= event.clientY) && (contCords[1]+cords[1]+10) > event.clientY) {
                    this.resize.match = true
                    this.resize.style = 'nwse-resize'
                    this.resize.cords = [cords[0] + (event.clientX - this.prevMouseCords[0]),  cords[1] + (event.clientY - this.prevMouseCords[1])]
                    this.resize.size = [size[0] + (this.prevMouseCords[0] - event.clientX), size[1] + (this.prevMouseCords[1] - event.clientY)]
                }
                else if(((contCords[0] + cords[0]+size[0]-10) <= event.clientX && (contCords[0] + cords[0]+size[0]+10) > event.clientX )//Пересечение нижней и правой границ
                    && ((contCords[1]+cords[1]+size[1]-10) <= event.clientY) && (contCords[1]+cords[1]+size[1]+10) > event.clientY) {
                    this.resize.match = true
                    this.resize.style = 'nwse-resize'
                    this.resize.cords = [cords[0], cords[1]]
                    this.resize.size = [size[0] + (event.clientX - this.prevMouseCords[0]), size[1] + (event.clientY - this.prevMouseCords[1])]
                }//top-left, bottom-right
                else if(((contCords[0] + cords[0]+size[0]-10) <= event.clientX && (contCords[0] + cords[0]+size[0]+10) > event.clientX )//Пересечение верхней и правой границ
                    && ((contCords[1]+cords[1]-10) <= event.clientY) && (contCords[1]+cords[1]+10) > event.clientY) {
                    this.resize.match = true
                    this.resize.style = 'nesw-resize'
                    this.resize.cords = [cords[0], cords[1] + (event.clientY - this.prevMouseCords[1])]
                    this.resize.size = [size[0] + (event.clientX - this.prevMouseCords[0]), size[1] + (this.prevMouseCords[1] - event.clientY)]
                }
                else if(((contCords[0] + cords[0]-10) <= event.clientX && (contCords[0] + cords[0]+10) > event.clientX )//Пересечение нижней и левой границ
                    && ((contCords[1]+cords[1]+size[1]-10) <= event.clientY) && (contCords[1]+cords[1]+size[1]+10) > event.clientY) {
                    this.resize.match = true
                    this.resize.style = 'nesw-resize'
                    this.resize.cords = [cords[0] + (event.clientX - this.prevMouseCords[0]), cords[1]]
                    this.resize.size = [size[0] + (this.prevMouseCords[0] - event.clientX), size[1] + (event.clientY - this.prevMouseCords[1])]
                }//top-right, bottom-left
                else {
                    this.resize.match = false
                    this.resize.active = false
                }

                //Запись данных
                if(this.resize.active){
                    this.$store.commit('SET_CURRENT_CORDS', this.resize.cords)
                    this.$store.commit('SET_CURRENT_SIZE', this.resize.size)
                    this.prevMouseCords = [event.clientX, event.clientY]
                    return true
                }
                return false
            },
            getCapturedContainerId() {
                return this.$store.getters.CAPTURED_CONTAINER_ID
            },
            getContextCords() {
                return this.$store.getters.CONTEXT_CORDS
            }
        }
    }
</script>

<style lang="scss">
    .container {
        padding: 25px;
        border: solid 1px #000;
        position: absolute;
        min-height: 100px;
        min-width: 100px;
        &:hover {
            cursor: pointer;
        }
    }
    .container_active {
        border-width: 2px;
    }
    .loaded-content {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        padding: 10px;
    }
</style>

