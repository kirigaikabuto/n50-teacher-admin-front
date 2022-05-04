import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginResponse: {},
        errorResponse: "",
    },
    mutations: {
        setLoginResponse: (state, resp) => {
            state.loginResponse = resp
        },
        setErrorResponse: (state, resp) => {
            state.errorResponse = resp
        }
    },
    actions: {
        getTest() {
            axios.post('http://localhost:5000/auth/test').then((response) => {
                console.log(response.data)
            })
        },
        loginAction({commit}, data) {
            const temp = {
                username: data.username,
                password: data.password
            };
            return axios.post(
                "http://localhost:5000/auth/login",
                temp,
                {
                    headers: {
                        "Access-Control-Allow-Methods": "*",
                        "Access-Control-Allow-Origin": "PUT, DELETE, GET, POST"
                    }
                }
            )
                .then((resp) => {
                    commit("setLoginResponse", resp.data);
                    commit("setErrorResponse", "");
                    localStorage.setItem('userToken', resp.data)
                    return resp
                })
                .catch((error) => {
                    commit("setErrorResponse", error.response.data.Message);
                    return error
                })
        }
    },
    getters: {
        LoginResponse(state) {
            return state.loginResponse
        },
        ErrorResponse(state) {
            return state.errorResponse
        }
    },
    modules: {}
})
