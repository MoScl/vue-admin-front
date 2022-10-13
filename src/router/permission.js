import router from './index'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getOAuth } from '@/utils/auth'
import { removeLocalStorage } from '@/utils/storage' // get token from cookie
import { server, globalConfig } from '@/settings'
import { matchMenuPath } from '@/utils/common'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth']
const rawAppendChild = HTMLHeadElement.prototype.appendChild
const rawAddEventListener = window.addEventListener

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // 登录权限
  const hasToken = getToken()
  const oauth = getOAuth() || '/login'

  if (hasToken && !to.path.startsWith('/auth')) {
    if (to.path === '/login') {
      if (await store.dispatch('user/checkToken')) {
        // if is logged in, redirect to the home page
        let redirect = to.query['redirect'] || ''
        if (redirect) {
          if (redirect.indexOf('http://') > -1 || redirect.indexOf('http%3A%2F%2F') > -1) {
            redirect = decodeURIComponent(redirect)
            if (redirect.indexOf('?') === -1) {
              redirect += '?'
            }
            window.open(redirect + '&token=' + hasToken, '_self')
          } else {
            next({ path: redirect || '/' })
          }
        } else {
          next({ path: '/' })
        }
      } else {
        window.location.reload()
      }
      NProgress.done()
    } else {
      const hasAut = store.getters['permission/addRoutes'] && store.getters['permission/addRoutes'].length > 0
      if (hasAut) {
        next()
        NProgress.done()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          // 加载头部系统导航
          await store.dispatch('permission/getHeaderNavigation')
          // 加载子系统路由
          await store.dispatch('permission/getSubSystemsRoutes')
          // 加载用户中心路由
          await store.dispatch('permission/getUserCenterRoutes')
          // 动态新增的页面路由
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          if (accessRoutes && accessRoutes.length) {
            accessRoutes.forEach(res => {
              router.addRoute(res)
            })
            next({ path: to.fullPath, replace: true })
          } else {
            ElMessage.error('无权限访问')
            // eslint-disable-next-line no-throw-literal
            throw '无页面权限'
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetState')
          // ElMessage.error('登录异常')
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (from && to && from.meta.sysCode !== server.name && (!to.meta.sysCode || to.meta.sysCode === server.name)) {
      HTMLHeadElement.prototype.appendChild = rawAppendChild
      window.addEventListener = rawAddEventListener
    }
    if (whiteList.indexOf(to.path) !== -1) next()
    else if (oauth.startsWith('/auth')) window.location.href = globalConfig.loginURL
    else next(`${oauth}?redirect=${to.fullPath}`)
  }
})

router.afterEach(async(to, from) => {
  // 当前左侧菜单path列表
  await store.dispatch('menu/setBreadcrumbs', [])
  const verticalMenuList = store.getters['menu/verticalMenuList']
  const formMenuPath = matchMenuPath(verticalMenuList, from.path)
  if (matchMenuPath(verticalMenuList, to.path) !== formMenuPath) {
    const arr = []
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).startsWith('query:' + server.path + formMenuPath)) {
        arr.push(localStorage.key(i))
      }
    }
    arr.forEach(item => {
      removeLocalStorage(item)
    })
  }
  NProgress.done()
})
