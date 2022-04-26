import { createStore } from 'vuex'
// import auth from './auth'

export default createStore({
    state: {
        msg: null,
        user: null
    },
    mutations: {
        SET_MSG(state, msg) {
            state.msg = msg
        }
    },
    actions: {
        signIn({ dispatch }, credentials) {
            let check_token =
            fetch('http://localhost:8000/login/token', {
            method: 'POST',
            credentials: 'include',
            body: credentials
            })
            .then(res => res.json())
            .then(data => dispatch('attempt', data.msg))
            .catch(err => console.log(err))

        },
        attempt({ commit }, msg) {
            commit('SET_MSG', msg)
        }
    },
    modules: {
        // auth
    }
})