import { createStore } from 'vuex'



export default createStore({
    state: {
        message: '',
        user: '',
        authenticated: 'false'
    },
    mutations: {
        SET_MSG(state, msg) {
            state.message = msg
        },
        SET_USER(state, data) {
            state.user = data
        },
        SET_AUTHENTICATED(state, authenticated) {
            state.authenticated = authenticated
        }
    },
    actions: {
        // async signIn({ dispatch }, credentials) {
        //     try {
        //         const check_token = await fetch('http://localhost:8000/login/token', {
        //             method: 'POST',
        //             credentials: 'include',
        //             body: credentials
        //         });

        //         if(check_token.ok) {
        //             const login = await check_token.json();
        //             dispatch('attempt', login);
        //         } else if(check_token.status == 400) {
        //             console.log('Incorrect')
        //         } else if(check_token.status == 422) {
        //             console.log('missing values')
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     }
        // },
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
                if(response.ok){
                    commit('SET_AUTHENTICATED', true);
                } else {
                    commit('SET_AUTHENTICATED', false);
                }
            } catch (e) {
                console.log(e);
            }
        }
    },
    modules: {
        // auth
    }
})