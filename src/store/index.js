import { createStore } from 'vuex'



export default createStore({
    state: {
        message: '',
        user: '',
        authenticated: false,
        quiz_id: null,
        question_id: null
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