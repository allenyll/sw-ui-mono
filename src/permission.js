import Vue from 'vue'
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { getAuthUrl } from '@/utils/common'
// 引入封装好的jsonp
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
// 请求超时5s
Vue.use(VueJsonp, 5000)
NProgress.configure({ showSpinner: false })// NProgress Configuration
// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/auth-redirect']// 不重定向白名单
const url = getAuthUrl()

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  Vue.jsonp(process.env.SSO_CONFIG.AUTH_URL).then(json => {
    if (!json.isLogin) {
      // MessageBox.confirm('登录失效', '重新登录', { // '你已被登出，可以取消继续留在该页面，或者重新登录'
      //   confirmButtonText: '重新登录',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      // })
      window.location.href = url
    } else {
      if (getToken()) { // 判断是否有token
        /* 有 token */
        if (to.path === '/login') {
          next({ path: '/' })
          NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
          if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息
            store.dispatch('GetUserInfo').then(res => { // 拉取user_info
              const menuList = res.data.menus
              // const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
              store.dispatch('GenerateRoutes', { menuList }).then(() => { // 根据roles权限生成可访问的路由表
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
            }).catch((err) => {
              store.dispatch('FedLogOut').then(() => {
                Message.error(err || 'Verification failed, please login again')
                next({ path: '/' })
              })
            })
          } else {
            // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
            if (hasPermission(store.getters.roles, to.meta.roles)) {
              next()
            } else {
              next({ path: '/401', replace: true, query: { noGoBack: true }})
            }
            // 可删 ↑
          }
        }
      } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
          next()
        } else {
          console.log(url)
          window.location.href = url
          NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
      }
    }
  }).catch(() => {
    window.location.href = url
  })
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
