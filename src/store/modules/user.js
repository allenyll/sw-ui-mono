import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, removeUID } from '@/utils/auth'
import router from '@/router'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    menus: undefined,
    elements: undefined,
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const _token = response.token
          var token = 'Bearer ' + _token
          const tokens = token
          commit('SET_TOKEN', tokens)
          setToken(tokens)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.success) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('用户信息获取失败')
          }
          const data = response.data

          if (data.menus && data.menus.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_MENUS', data.menus)
            const elements = {}
            for (let i = 0; i < data.menus.length; i++) {
              const menuType = data.menus[i].menu_type
              if (menuType === 'SW0100') {
                elements[data.menus[i].menu_perms] = true
              }
            }
            commit('SET_ELEMENTS', elements)
          } else {
            reject('初始化菜单失败，菜单数组不能为空！!')
          }

          commit('SET_NAME', data.name)
          commit('SET_AVATAR', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK7rhABLVGfWZ2OKtz9qP4WUMozicTT4DTKgDmIS9X4EXbdLMCS9PoXzibTeaHEgzcCrKgHWKibZlL0Q/132')
          // commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeUID()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 404报错
    404({ commit }) {
      return new Promise(resolve => {
        router.push({
          path: '/404'
        })
      })
    },

    // 401报错
    401({ commit }) {
      return new Promise(resolve => {
        router.push({
          path: '/401'
        })
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
