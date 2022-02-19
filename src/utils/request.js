import Vue from 'vue'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { getAuthUrl } from '@/utils/common'
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
// 请求超时5s
Vue.use(VueJsonp, 5000)
// const baseURLStr = window.g.BASE_API
const baseUrl = process.env.BASE_API
const url = getAuthUrl()

// 创建一个 axios 实例
const service = axios.create({
  baseURL: baseUrl, // api 的 base_url
  timeout: 5000 // request 超时时间
})

// request 拦截器
service.interceptors.request.use(
  config => {
    Vue.jsonp(process.env.SSO_CONFIG.AUTH_URL).then(json => {
      if (!json.isLogin) {
        MessageBox.confirm('登录失效', '重新登录', { // '你已被登出，可以取消继续留在该页面，或者重新登录'
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = url
        })
      }
    })
    // 发送请求之前携带token
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      const token = getToken()
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': token,
        'login-type': 'sweb'
      }
      // config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    // request 请求异常
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // debugger
    const res = response
    const header = response.headers
    if (res.status === 404) {
      store.dispatch('404').then(() => {
      })
    }
    if (res.status === 401) {
      store.dispatch('401').then(() => {
      })
    }
    if (res.status === 200) {
      return response.data
    } else {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 8001:非法的token;   8002:Token 过期了;
      if (header.ERROR_CODE === 8001 || header.ERROR_CODE === 8002) {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm(header.ERROR_INFO, '确定登出', { // '你已被登出，可以取消继续留在该页面，或者重新登录'
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    }
  },
  error => {
    if (error.response.status === 401) {
      MessageBox.confirm('登录超时', '确定登出', { // '你已被登出，可以取消继续留在该页面，或者重新登录'
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
    return Promise.reject(error)
  }
)

export default service
