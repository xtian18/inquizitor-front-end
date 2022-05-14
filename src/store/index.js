import { createStore } from 'vuex'

export default createStore({
    state: {
        message: '',
        user: ''
    },
    mutations: {
        SET_MSG(state, msg) {
            state.message = msg
        },
        SET_USER(state, data) {
            state.user = data
        }
    },
    actions: {
        async signIn({ dispatch }, credentials) {
            try {
                const check_token = await fetch('http://localhost:8000/login/token', {
                    method: 'POST',
                    credentials: 'include',
                    body: credentials
                    });
                const login = await check_token.json();
                console.log(login)
                dispatch('attempt', login);
            } catch(e) {
                console.log(e);
            }
        },
        async attempt({ commit }, msg) {
            commit('SET_MSG', msg)

            try {
                const response = await fetch('http://localhost:8000/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credetials': 'true'
                    },
                    credentials: 'include'
                    });
                    const data = await response.json();
                    commit('SET_USER', data);
            } catch(e) {
                console.log(e);
            }
        }
    },
    modules: {
        // auth
    }
})