import { login } from '@/api/user'
import { localSave, localRead } from '@/utils'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const localUser = localRead('userInfo')

const state = {
  token: getToken(),
  userInfo: localUser ? JSON.parse(localUser) : {},
  routes: [] // 全部路由
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_USER: (state, userInfo) => {
    state.userInfo = userInfo
    localSave('userInfo', JSON.stringify(userInfo))
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_USER', data)
          commit('SET_TOKEN', data.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_USER', {})
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
