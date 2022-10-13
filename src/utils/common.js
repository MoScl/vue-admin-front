import { server } from '@/settings'
import microAppStore from '@/store/microAppStore'
import { BasicLayout } from '@/layouts'
import CryptoJS from 'crypto-js'
import store from '@/store'

const rawAppendChild = HTMLHeadElement.prototype.appendChild
const rawAddEventListener = window.addEventListener

/**
 *
 * @param subSystemList 子系统列表
 * @param basePath
 * @returns {(*|{container: string, props: {routerBase: *, getGlobalState: *}})[]}
 */
export function getMicroApps(subSystemList = [], basePath = '/app') {
  const microApps = []
  subSystemList.forEach(item => {
    microApps.push({
      name: item['code'],
      title: item['name'],
      entry: item['url'],
      url: basePath + '/' + item['code'],
      activeRule: basePath + '/' + item['code']
    })
  })
  return microApps.map(item => {
    item.activeRule = server.path + item.activeRule
    return {
      ...item,
      container: '#microApps', // 子应用挂载的div
      props: {
        entry: item.entry,
        routerBase: item.activeRule, // 下发基础路由
        getGlobalState: microAppStore.getGlobalState, // 下发getGlobalState方法
        globalFn: microAppStore.globalFn
      }
    }
  })
}

// 格式化系统列表，为qiankun子系统路由配置表
export function setAppRoutes(microApps = []) {
  const apps = microApps.filter(item => item.entry).map(item => {
    return {
      path: item.name,
      meta: { sysCode: item.name },
      component: () => import('@/views/microApp'),
      children: [{
        path: '*',
        meta: { sysCode: item.name }
      }]
    }
  })
  return [{
    path: '/app',
    name: 'App',
    component: BasicLayout,
    children: [...apps, { path: '*', redirect: '/401' }]
  }]
}

// 格式化用户中心菜单路由
export function setUserCenterRoutes(systemMenu = []) {
  let menus = []
  formatTreeData(systemMenu, menus)
  menus = menus.map((item) => {
    const path = item.url.replace([/system/], '')
    return {
      path: path,
      name: item.id,
      meta: { title: item.name, sysCode: server.name },
      component: resolve => require([`@/views/${path}`], resolve)
    }
  })
  return {
    path: '/system',
    component: BasicLayout,
    children: menus
  }
}

function formatTreeData(treeData, listData) {
  for (const i in treeData) {
    if (treeData[i].children) {
      formatTreeData(treeData[i].children, listData)
    }
    listData.push({ ...treeData[i], children: undefined })
  }
}

// 密码加密
export function encrypt(word, keyStr) {
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.ciphertext.toString()
}

export function beforeEnter(to, from, next) {
  // 从子项目跳转到主项目
  if (from && to && from.meta.sysCode !== server.name && (!to.meta.sysCode || to.meta.sysCode === server.name)) {
    HTMLHeadElement.prototype.appendChild = rawAppendChild
    window.addEventListener = rawAddEventListener
  }
  next()
}

// 根据菜单项生成跳转url
export function formatMenuUrl(route, returnField) {
  let path = route.url
  if (route.openLabelpageFlag === '1') {
    if (path.indexOf('http://') > -1 || path.indexOf('http%3A%2F%2F') > -1) {
      path = decodeURIComponent(path)
    } else {
      const subSystemActive = store.getters && store.getters['user/subSystemActive']
      if (subSystemActive && subSystemActive.code !== server.name) {
        path = server.path + '/app/' + subSystemActive.code + route.url
      }
      if (path.indexOf('?') === -1) path += '?'
      path = path + '&isBlank=1'
    }
  } else {
    const subSystemActive = store.getters && store.getters['user/subSystemActive']
    if (subSystemActive && subSystemActive.code !== server.name) {
      path = '/app/' + subSystemActive.code + route.url
    }
  }
  if (returnField) {
    return { path: path, fullPath: formatProjectUrl(path) }[returnField]
  } else {
    return path
  }
}

// 根据path追加当前选中项目参数
export function formatProjectUrl(path) {
  const projectActive = store.getters['user/projectActive']
  if (path && projectActive && projectActive['id']) {
    if (path.indexOf('?') === -1) {
      path += '?'
    }
    path = path + '&projectId=' + projectActive['id']
  }
  return path
}

// 根据菜单树集合，提取所有的菜单路由（不带项目参数）
export function formatMenus(menus) {
  let arr = []
  menus.forEach(menu => {
    if (menu.children && menu.children.length) {
      arr = [...arr, ...formatMenus(menu.children)]
    } else {
      const path = formatMenuUrl(menu)
      if (path) {
        arr.push(path)
      }
    }
  })
  return arr
}

// 根据菜单树集合，提取所有的菜单对象（不带项目参数）
export function formatMenuMaps(menuPath, menus) {
  let maps = {}
  menus.forEach(menu => {
    if (menu.children && menu.children.length) {
      maps = { ...maps, ...formatMenuMaps([...menuPath, menu.name], menu.children) }
    } else {
      const subSystemActive = store.getters && store.getters['user/subSystemActive']
      const path = formatMenuUrl(menu)
      if (path) {
        maps[path] = menu
        maps[path]['pathList'] = subSystemActive['name'] ? [subSystemActive['name'], ...menuPath, menu.name] : [...menuPath, menu.name]
      }
    }
  })
  return maps
}

// 根据所有的菜单路由匹配path，匹配则返回匹配菜单路由
export function matchMenuPath(menuList, path) {
  if (menuList.indexOf(path) > -1) {
    return path
  } else {
    const items = menuList.filter(v => path.indexOf(v) > -1).sort((a, b) => path.replace(a, '').length - path.replace(b, '').length)
    return items.length ? items[0] : ''
  }
}
