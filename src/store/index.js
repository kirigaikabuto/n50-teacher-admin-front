import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

var host = "http://localhost:5000"

export default new Vuex.Store({
    state: {
        loginResponse: {},
        errorResponse: "",
        teacherSubjects: [],
        subject: {},
        groupSubject: [],
        group: {},
        lessons: {},
    },
    mutations: {
        setLoginResponse: (state, resp) => {
            state.loginResponse = resp
        },
        setErrorResponse: (state, resp) => {
            state.errorResponse = resp
        },
        setTeacherSubjects: (state, resp) => {
            state.teacherSubjects = resp
        },
        setSubject: (state, resp) => {
            state.subject = resp
        },
        setGroupSubjects: (state, resp) => {
            state.groupSubject = resp
        },
        setGroup: (state, resp) => {
            state.group = resp
        },
        setLessons: (state, resp) => {
            state.lessons = resp
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
                host + "/auth/login",
                temp,
                {
                    headers: {
                        "Access-Control-Allow-Methods": "*",
                    }
                }
            )
                .then((resp) => {
                    commit("setLoginResponse", resp.data);
                    commit("setErrorResponse", "");
                    let obj = {
                        token: resp.data.access_token,
                    }

                    localStorage.setItem('userToken', JSON.stringify(obj))
                    return resp
                })
                .catch((error) => {
                    commit("setErrorResponse", error.response.data.Message);
                    return error
                })
        },
        getTeacherSubjects({commit}, data) {
            console.log(data)
            let temp = localStorage.getItem("userToken")
            let accessToken = JSON.parse(temp).token
            console.log(accessToken)
            return axios.get(
                host + "/teacherSubject/token",
                {
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                    }
                }).then((resp) => {
                commit("setTeacherSubjects", resp.data.objects);
                console.log("from get teacher subject by teacherid ", resp.data.objects)
                commit("setErrorResponse", "");
                return resp.data
            })
                .catch((error) => {
                    commit("setErrorResponse", error.response.data.Message);
                    console.log("error from get teacher ", error.response.data.Message)
                    return error
                });

        },
        getSubjectById({commit}, data) {
            console.log("from get subject by id", data)
            let temp = localStorage.getItem("userToken")
            let accessToken = JSON.parse(temp).token
            console.log(accessToken)
            return axios.get(
                host + "/subjects/id?id=" + data.id,
                {
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                    }
                }).then((resp) => {
                console.log("from get subject by id", resp.data)
                commit("setSubject", resp.data);
                commit("setErrorResponse", "");
                return resp.data
            })
                .catch((error) => {
                    commit("setErrorResponse", error.response.data.Message);
                    console.log("error from get subject by id ", error.response.data.Message)
                    return error
                });

        },
        getGroupSubjects({commit}, data) {
            console.log(data)
            let temp = localStorage.getItem("userToken")
            let accessToken = JSON.parse(temp).token
            console.log(accessToken)
            return axios.get(
                host + "/groupSubject/teacherSubId?id=" + data.id,
                {
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                    }
                }).then((resp) => {
                commit("setGroupSubjects", resp.data.objects);
                console.log(resp.data.objects)
                commit("setErrorResponse", "");
                return resp.data
            })
                .catch((error) => {
                    commit("setErrorResponse", error.response.data.Message);
                    console.log("error from get teacher ", error.response.data.Message)
                    return error
                });

        },
        getGroupById({commit}, data) {
            console.log("from get group by id", data)
            let temp = localStorage.getItem("userToken")
            let accessToken = JSON.parse(temp).token
            console.log(accessToken)
            return axios.get(
                host + "/group/id?id=" + data.id,
                {
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                    }
                }).then((resp) => {
                console.log("from get group by id", resp.data)
                commit("setGroup", resp.data);
                commit("setErrorResponse", "");
                return resp.data
            })
                .catch((error) => {
                    commit("setErrorResponse", error.response.data.Message);
                    console.log("error from get group by id ", error.response.data.Message)
                    return error
                });

        },
        getGroupSubjectByTeacherSubGroupId({commit}, data) {
            console.log("from getGroupSubjectByTeacherSubGroupId", data)
            let temp = localStorage.getItem("userToken")
            let accessToken = JSON.parse(temp).token
            console.log(accessToken)
            return axios.get(
                host + "/groupSubject/ids?groupId=" + data.groupId + "&teacherSubId=" + data.teacherSubId,
                {
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                    }
                }).then((resp) => {
                console.log("from getGroupSubjectByTeacherSubGroupId", resp.data)
                commit("setErrorResponse", "");
                return resp.data
            })
                .catch((error) => {
                    commit("setErrorResponse", error.response.data.Message);
                    console.log("error getGroupSubjectByTeacherSubGroupId ", error.response.data.Message)
                    return error
                });
        },
        getLessonsByGroupSubjectId({commit}, data) {
            console.log(data)
            let temp = localStorage.getItem("userToken")
            let accessToken = JSON.parse(temp).token
            console.log(accessToken)
            return axios.get(
                host + "/lesson/groupSubjectId?id=" + data.id,
                {
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                    }
                }).then((resp) => {
                console.log("get lessons", resp.data.objects)
                commit("setErrorResponse", "");
                return resp.data
            })
                .catch((error) => {
                    commit("setErrorResponse", error.response.data.Message);
                    console.log("get lessons ", error.response.data.Message)
                    return error
                });
        }
    },
    getters: {
        LoginResponse(state) {
            return state.loginResponse
        },
        ErrorResponse(state) {
            return state.errorResponse
        },
        GetTeacherSubjectResponse(state) {
            return state.teacherSubjects
        },
        GetSubject(state) {
            return state.subject
        },
        GetGroupSubject(state) {
            return state.groupSubject
        },
        GetGroup(state) {
            return state.group
        },
        GetLessons(state) {
            return state.lessons
        }
    },
    modules: {}
})
