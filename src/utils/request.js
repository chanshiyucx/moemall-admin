import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import config from '@/config'

// 退出登录
const logOut = () => {
  store.dispatch('user/logout').then(() => {
    location.reload() // 为了重新实例化vue-router对象 避免bug
  })
}

// create an axios instance
const service = axios.create({
  baseURL: config.baseURL, // url = base url + request url
  timeout: 15000 // request timeout,
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => response.data,
  error => {
    console.log('error', error.response) // for debug
    const response = error.response.data
    Message({
      message: response.message || error.message,
      type: 'error',
      duration: 3 * 1000
    })

    // 401 退出登录
    if (error.response.status === 401) {
      logOut()
    }
    return Promise.reject(error)
  }
)

export default service
