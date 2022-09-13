import { createStore } from 'vuex'
import config from '../../config'


export default createStore({
    state: {
        message: '',
        user: '',
        authenticated: false,
        showLoadingScreen: false
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
        },
        SET_SHOW_LOADING_SCREEN(state, showLoadingScreen) {
            state.showLoadingScreen = showLoadingScreen
        }
    },
    actions: {
        async attempt({ commit }, msg, state) {
            commit('SET_MSG', msg)

            try {
                const response = await fetch(`${config.apiURL}/users/profile`, {
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
                commit('SET_SHOW_LOADING_SCREEN', false);
            } catch (e) {
                console.log(e);
                commit('SET_SHOW_LOADING_SCREEN', false);
            }
        }
    },
    modules: {
        // auth
    }
})