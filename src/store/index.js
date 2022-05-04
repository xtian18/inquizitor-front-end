import { createStore } from 'vuex'

export default createStore({
    state: {
        msg: '',
        user: ''
    },
    mutations: {
        SET_MSG(state, msg) {
            state.msg = msg
        },
        SET_USER(state, data) {
            state.user = data
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

            try {
                fetch('http://localhost:8000/users/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credetials': 'true'
                },
                credentials: 'include'
                })
                .then(res => res.json())
                .then(data => {
                    commit('SET_USER', data)    
                })
            } catch(e) {
                //
            }
        }
    },
    modules: {
        // auth
    }
})