import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        contextCords: [],
        containers: [],
        history: [],
        capturedContainerId: -1,//Контейнер, по которому кликнули(выделили)
        fixedContainerId: -1,//Контейнер, на котором зафиксировали курсор
        initialCords: [],
        initialSize: []
    },
    getters: {
        CONTEXT_CORDS: state => state.contextCords,
        CONTAINERS: state => state.containers,
        CAPTURED_CONTAINER_ID: state => state.capturedContainerId,
        FIXED_CONTAINER_ID: state => state.fixedContainerId
    },
    mutations: {
        SET_CONTEXT_CORDS: (state, payload) => state.contextCords = payload,
        UNDO: state => {
            if (!state.history.length) return
            let index = state.history.length - 1
            while (index >= 0) {
                if (state.history[index].status !== 'undo') {
                    console.log(state.history[index].status);
                    state.history[index].status = 'undo'
                    console.log(state.history[index].status);
                    switch (state.history[index].type) {
                        case 'ADD_CONTAINER':
                            state.containers.find(item => item.id === state.history[index].id).hidden = true
                            break
                        case 'REMOVE_CONTAINER':
                            state.containers.find(item => item.id === state.history[index].id).hidden = false
                            break
                        case 'SET_LAST_CORDS':
                            state.containers.find(item => item.id === state.history[index].id).cords = state.history[index].initialCords
                            break
                        case 'SET_LAST_SIZE':
                            state.containers.find(item => item.id === state.history[index].id).cords = state.history[index].initialCords
                            state.containers.find(item => item.id === state.history[index].id).size = state.history[index].initialSize
                            break
                    }
                    break
                }
                index--
            }
        },
        REDO: state => {
            if (!state.history.length) return
            let index = 0
            while (index < state.history.length) {
                if (state.history[index].status === 'undo') {
                    state.history[index].status = 'redo'
                    switch (state.history[index].type) {
                        case 'ADD_CONTAINER':
                            state.containers.find(item => item.id === state.history[index].id).hidden = false
                            break
                        case 'REMOVE_CONTAINER':
                            state.containers.find(item => item.id === state.history[index].id).hidden = true
                            break
                        case 'SET_LAST_CORDS':
                            state.containers.find(item => item.id === state.history[index].id).cords = state.history[index].lastCords
                            break
                        case 'SET_LAST_SIZE':
                            state.containers.find(item => item.id === state.history[index].id).cords = state.history[index].lastCords
                            state.containers.find(item => item.id === state.history[index].id).size = state.history[index].lastSize
                            break
                    }
                    break;
                }
                index++;
            }
        },
        CLEAR_HISTORY: state => {
          state.history = []
        },
        ADD_CONTAINER: state => {
            const id = Date.now();
            state.history.push({
                id,
                type: 'ADD_CONTAINER',
                status: 'do'
            })
            state.containers.push({
                id,
                cords: [10, 10],//[0] - X, [1] - Y
                size: [200, 200],//[0] - X, [1] - Y
                hidden: false
            })

        },
        CAPTURE_CONTAINER: (state, payload = -1) => {
            state.capturedContainerId = payload
        },
        REMOVE_CONTAINER: state => {
            state.history.push({
                id: state.capturedContainerId,
                type: 'REMOVE_CONTAINER',
                status: 'do'
            })
            state.containers.find(item => item.id === state.capturedContainerId).hidden = true;
        },
        FIX_CONTAINER: (state, payload = -1) => {//
            if(payload === -1) {
                let type = ''
                let lastSize = null

                if(!state.containers.length || state.fixedContainerId === -1) return

                if(state.initialSize.length) {
                    lastSize = state.containers.find(item => item.id === state.fixedContainerId).size
                    type = 'SET_LAST_SIZE'
                } else type = 'SET_LAST_CORDS'

                let lastCords = state.containers.find(item => item.id === state.fixedContainerId).cords

                if(!lastSize && (lastCords[0] === state.initialCords[0] && lastCords[1] === state.initialCords[1])) return
                if(lastSize && (lastSize[0] === state.initialSize[0] && lastSize[1] === state.initialSize[1])) return

                state.history.push({
                    id: state.fixedContainerId,
                    initialSize: state.initialSize,
                    lastSize,
                    initialCords: state.initialCords,
                    lastCords,
                    type,
                    status: 'do'
                })
            }
            state.fixedContainerId = payload
        },
        SET_INITIAL_CORDS: (state) => {//ДЛЯ ВЫБРАННОГО КОНТЕЙНЕРА В МОМЕНТ MOUSE DOWN
            state.initialCords = state.containers.find(item => item.id === state.fixedContainerId).cords
        },
        // SET_LAST_CORDS: (state) => {
        //     if(!state.containers.length || state.fixedContainerId === -1) return
        //     const lastCords = state.containers.find(item => item.id === state.fixedContainerId).cords
        //     if(lastCords[0] === state.initialCords[0] && lastCords[1] === state.initialCords[1]) return
        //     state.history.push({
        //         id: state.fixedContainerId,
        //         initialCords: state.initialCords,
        //         lastCords,
        //         type: 'SET_LAST_CORDS',
        //         status: 'do'
        //     })
        // },
        SET_CURRENT_CORDS: (state, payload) => {
            state.containers.find(item => item.id === state.fixedContainerId).cords = payload
        },
        SET_INITIAL_SIZE: (state) => {//ДЛЯ ВЫБРАННОГО КОНТЕЙНЕРА В МОМЕНТ MOUSE DOWN
            state.initialSize = state.containers.find(item => item.id === state.fixedContainerId).size
        },
        SET_CURRENT_SIZE: (state, payload) => {
            state.containers.find(item => item.id === state.fixedContainerId).size = payload
        },
        // SET_LAST_SIZE: (state) => {
        //     if(!state.containers.length || state.fixedContainerId === -1 || !state.initialSize.length) return
        //     const lastSize = state.containers.find(item => item.id === state.fixedContainerId).size
        //     const lastCords = state.containers.find(item => item.id === state.fixedContainerId).cords
        //     if(lastSize[0] === state.initialSize[0] && lastSize[1] === state.initialSize[1]) return
        //     state.history.pop()
        //     state.history.push({
        //         id: state.fixedContainerId,
        //         initialSize: state.initialSize,
        //         lastSize,
        //         initialCords: state.initialCords,
        //         lastCords,
        //         type: 'SET_LAST_SIZE',
        //         status: 'do'
        //     })
        // },
    },
    actions: {},
});