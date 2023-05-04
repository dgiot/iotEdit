/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import { defaultRoutes, errorRoutes } from '@/config/router.config'
import { getRouterList } from '@/api/User'
import { convertRouter, filterRoutes } from '@/utils/router/routes'
import { getToken } from '@/utils/vue'
import router from '@/utils/router/utils'
const utilsRouter = new router()
const state = () => ({
  routes: [],
  cachedRoutes: [],
  routerOpenTime: getToken('routerOpenTime', localStorage, []),
})
const getters = {
  routes: (state) => state.routes,
  cachedRoutes: (state) => state.cachedRoutes,
  routerOpenTime: (state) => state.routerOpenTime,
}
const mutations = {
  setRoutesOpenTime(state, info) {
    state.routerOpenTime = _.merge(state.routerOpenTime, info)
  },
  /**
   * @description 多模式设置路由
   * @param {*} state
   * @param {*} routes
   */
  setRoutes(state, routes) {
    state.routes = routes
  },
  /**
   * @description 设置缓存Name数组
   * @param {*} state
   * @param {*} routes
   */
  setCachedRoutes(state, routes) {
    state.cachedRoutes = routes
  },
  /**
   * @description 修改Meta
   * @param {*} state
   * @param options
   */
  changeMenuMeta(state, options) {
    function handleRoutes(routes) {
      return routes.map((route) => {
        if (route.name === options.name) Object.assign(route.meta, options.meta)
        if (route.children && route.children.length) {
          route.children = handleRoutes(route.children)
        }
        return route
      })
    }

    state.routes = handleRoutes(state.routes)
  },
}
const actions = {
  /**
   * @description 多模式设置路由
   * @param {*} { commit }
   * @param mode
   * @returns
   */
  async setRoutes({ commit }, mode = 'none') {
    // 默认前端路由
    let _defaultRoutes = []
    _defaultRoutes.push(defaultRoutes)
    let routes = [...asyncRoutes]
    // 设置后端路由(不需要可以删除)
    // let { results } = await getRouterList() //通过接口获取，动态路由菜单栏
    let results = [
      {
        "children": [
          {
            "icon": "code-box-fill",
            "meta": {
              "alwaysShow": false,
              "badge": "",
              "component": "@/views/CloudFunction/lowcode/index",
              "hidden": false,
              "icon": "code-box-fill",
              "noClosable": false,
              "noKeepAlive": false,
              "redirect": "",
              "tabHidden": false,
              "title": "视图管理"
            },
            "name": "AmisLowCode",
            "url": "/design"
          },
          {
            "icon": "home-3-fill",
            "meta": {
              "alwaysShow": false,
              "badge": "",
              "component": "@/views/CloudOc/AmisPage/viewgit",
              "hidden": true,
              "icon": "home-3-fill",
              "isAmis": false,
              "isCustomSvg": false,
              "noClosable": false,
              "noKeepAlive": false,
              "redirect": "",
              "tabHidden": false,
              "title": "视图日志记录",
              "viewid": ""
            },
            "name": "ViewGit",
            "url": "/viewgit"
          },
          {
            "icon": "home-3-fill",
            "meta": {
              "alwaysShow": false,
              "badge": "",
              "component": "@/views/CloudOc/AmisPage/viewtemplate",
              "hidden": true,
              "icon": "home-3-fill",
              "isAmis": false,
              "isCustomSvg": false,
              "noClosable": false,
              "noKeepAlive": false,
              "redirect": "",
              "tabHidden": false,
              "title": "视图模板替换",
              "viewid": ""
            },
            "name": "AmisViewTemplate",
            "url": "/viewtemplate"
          },
          {
            "icon": "home-3-fill",
            "meta": {
              "alwaysShow": false,
              "badge": "",
              "component": "@/views/CloudFunction/topo/index",
              "hidden": true,
              "icon": "home-3-fill",
              "isAmis": false,
              "isCustomSvg": false,
              "noClosable": false,
              "noKeepAlive": false,
              "redirect": "",
              "tabHidden": false,
              "title": "组态大屏",
              "viewid": ""
            },
            "name": "AmisKonvaScreen",
            "url": "/Topo"
          },
          {
            "icon": "home-3-fill",
            "meta": {
              "alwaysShow": false,
              "badge": "",
              "component": "@/views/CloudFunction/amis/editor",
              "hidden": true,
              "icon": "home-3-fill",
              "isCustomSvg": false,
              "noClosable": false,
              "noKeepAlive": false,
              "redirect": "",
              "tabHidden": false,
              "title": "amis编辑器"
            },
            "name": "AmisDgiotEditor",
            "url": "/design/editor/amis"
          },
          {
            "icon": "home-3-fill",
            "meta": {
              "alwaysShow": false,
              "badge": "",
              "component": "@/views/CloudFunction/topo/editor",
              "hidden": true,
              "icon": "home-3-fill",
              "isCustomSvg": false,
              "noClosable": false,
              "noKeepAlive": false,
              "redirect": "",
              "tabHidden": false,
              "title": "组态编辑器"
            },
            "name": "AmisTopoEditor",
            "url": "/design/editor/topo"
          }
        ],
        "icon": "home-3-fill",
        "meta": {
          "alwaysShow": false,
          "badge": "",
          "component": "Layout",
          "hidden": false,
          "icon": "home-3-fill",
          "isCustomSvg": false,
          "noClosable": false,
          "noKeepAlive": false,
          "redirect": "/baseamis",
          "tabHidden": false,
          "title": "低代码"
        },
        "name": "AmisManage",
        "url": "/baseamis"
      }
    ]
    //  await getRouterList()
    const cookie = Cookies.get('dgiot_auth_token') !== 'undefined'
    // if (!results && cookie) {
    //   Vue.prototype.$baseMessage(
    //     '路由未正常返回！',
    //     'error',
    //     false,
    //     'dgiot-hey-message-error'
    //   )
    //   return false
    // }
    /**
     * 处理路由
     */
    let data = _.merge(utilsRouter.compute(results, errorRoutes))
    console.log(data)
    if (data[data.length - 1].path !== '*') {
      routes = convertRouter(data)
    }

    // 根据权限和rolesControl过滤路由
    const finallyRoutes = filterRoutes([...constantRoutes, ...routes])
    console.log('finallyRoutes', finallyRoutes);
    // 设置菜单所需路由
    // let list = [
    //   {
    //     "path": "/login",
    //     component: () => import('@/views/MultiTenant/user/login'),
    //     "hidden": true
    //   },
    //   {
    //     "path": "/403",
    //     "name": "403",
    //     component: () => import('@/views/403'),
    //     "hidden": true
    //   },
    //   {
    //     "path": "/404",
    //     "name": "404",
    //     component: () => import('@/views/404'),
    //     "hidden": true
    //   },
    //   {
    //     "hidden": false,
    //     "menuHidden": false,
    //     "alwaysShow": false,
    //     "name": "Dashboard",
    //     "path": "/",
    //     component: () => import('@/dgiot/layouts'),
    //     "redirect": "/index",
    //     "meta": {
    //       "title": "总控台",
    //       "icon": "home-2-line",
    //       "noKeepAlive": true
    //     },
    //     "children": [
    //       {
    //         "ACL": {
    //           "role:admin": {
    //             "read": true,
    //             "write": true
    //           }
    //         },
    //         "createdAt": "2021-08-13T09:54:42.994Z",
    //         "icon": "home-3-fill",
    //         "meta": {
    //           "alwaysShow": false,
    //           "badge": "",
    //           component: () => import('@/views/DeviceCloud/manage/platform_overview'),
    //           "hidden": false,
    //           "icon": "home-gear-line",
    //           "isCustomSvg": false,
    //           "noClosable": true,
    //           "noKeepAlive": true,
    //           "redirect": "",
    //           "tabHidden": false,
    //           "title": "总控台"
    //         },
    //         "name": "Workbench",
    //         "navShow": [
    //           {
    //             "alias": "编辑器管理",
    //             "roleId": "637a103aa2",
    //             "roleName": "编辑器管理"
    //           }
    //         ],
    //         "objectId": "zjRYRFGXzk",
    //         "orderBy": 11,
    //         "parent": "SVoMYPK8D5",
    //         "updatedAt": "2023-02-03T12:11:58.530Z",
    //         "url": "/index",
    //         "path": "/index",
    //         "hidden": false,
    //         "menuHidden": false,
    //         "alwaysShow": false
    //       },
    //       {
    //         "ACL": {
    //           "role:admin": {
    //             "read": true,
    //             "write": true
    //           }
    //         },
    //         "createdAt": "2022-01-20T07:56:06.912Z",
    //         "icon": "user-2-line",
    //         "meta": {
    //           "alwaysShow": false,
    //           "badge": "",
    //           component: () => import('@/views/MultiTenant/roles/userinfo'),
    //           "hidden": true,
    //           "icon": "user-2-line",
    //           "isCustomSvg": false,
    //           "noClosable": false,
    //           "noKeepAlive": false,
    //           "redirect": "",
    //           "tabHidden": false,
    //           "title": "用户中心"
    //         },
    //         "name": "UserCenter",
    //         "navShow": [
    //           {
    //             "alias": "编辑器管理",
    //             "roleId": "637a103aa2",
    //             "roleName": "编辑器管理"
    //           }
    //         ],
    //         "objectId": "1b6fba6483",
    //         "orderBy": 12,
    //         "parent": "SVoMYPK8D5",
    //         "updatedAt": "2023-02-03T12:11:58.785Z",
    //         "url": "/userinfo/:userid",
    //         "path": "/userinfo/:userid",
    //         "hidden": true,
    //         "menuHidden": false,
    //         "alwaysShow": false
    //       }
    //     ]
    //   },
    //   {
    //     "hidden": false,
    //     "menuHidden": false,
    //     "alwaysShow": false,
    //     "name": "AmisManage",
    //     "path": "/baseamis",
    //     "redirect": "/baseamis",
    //     component: () => import('@/dgiot/layouts'),
    //     "meta": {
    //       "title": "低代码",
    //       "icon": "home-3-fill",
    //       "noKeepAlive": false
    //     },
    //     "children": [
    //       {
    //         "ACL": {
    //           "role:admin": {
    //             "read": true,
    //             "write": true
    //           }
    //         },
    //         "createdAt": "2022-12-13T02:33:57.791Z",
    //         "icon": "code-box-fill",
    //         "meta": {
    //           "alwaysShow": false,
    //           "badge": "",
    //           component: () => import('@/views/CloudFunction/lowcode/index'),
    //           // "component": "@/views/CloudFunction/lowcode/index",
    //           "hidden": false,
    //           "icon": "code-box-fill",
    //           "isCustomSvg": false,
    //           "noClosable": false,
    //           "noKeepAlive": false,
    //           "redirect": "",
    //           "tabHidden": false,
    //           "title": "视图管理"
    //         },
    //         "name": "AmisLowCode",
    //         "navShow": [
    //           {
    //             "alias": "编辑器管理",
    //             "roleId": "637a103aa2",
    //             "roleName": "编辑器管理"
    //           }
    //         ],
    //         "objectId": "88203f3a27",
    //         "orderBy": 151,
    //         "parent": "62bf180f35",
    //         "updatedAt": "2023-02-03T12:11:58.777Z",
    //         "url": "/design",
    //         "path": "/design",
    //         "hidden": false,
    //         "menuHidden": false,
    //         "alwaysShow": false
    //       },
    //       {
    //         "ACL": {
    //           "role:admin": {
    //             "read": true,
    //             "write": true
    //           }
    //         },
    //         "createdAt": "2023-03-22T04:20:29.149Z",
    //         "icon": "home-3-fill",
    //         "meta": {
    //           "alwaysShow": false,
    //           "badge": "",
    //           component: () => import('@/views/CloudOc/AmisPage/viewgit'),
    //           // "component": "@/views/CloudOc/AmisPage/viewgit",
    //           "hidden": true,
    //           "icon": "home-3-fill",
    //           "isAmis": false,
    //           "isCustomSvg": false,
    //           "noClosable": false,
    //           "noKeepAlive": false,
    //           "redirect": "",
    //           "tabHidden": false,
    //           "title": "视图日志记录",
    //           "viewid": ""
    //         },
    //         "name": "ViewGit",
    //         "navShow": [
    //           {
    //             "alias": "编辑器管理",
    //             "roleId": "637a103aa2",
    //             "roleName": "编辑器管理"
    //           }
    //         ],
    //         "objectId": "b7111b195b",
    //         "orderBy": 157,
    //         "parent": "62bf180f35",
    //         "updatedAt": "2023-03-22T05:50:15.893Z",
    //         "url": "/viewgit",
    //         "path": "/viewgit",
    //         "hidden": true,
    //         "menuHidden": false,
    //         "alwaysShow": false
    //       },
    //       {
    //         "ACL": {
    //           "role:admin": {
    //             "read": true,
    //             "write": true
    //           }
    //         },
    //         "createdAt": "2023-03-27T07:23:41.928Z",
    //         "icon": "home-3-fill",
    //         "meta": {
    //           "alwaysShow": false,
    //           "badge": "",
    //           component: () => import('@/views/CloudOc/AmisPage/viewtemplate'),
    //           // "component": "@/views/CloudOc/AmisPage/viewtemplate",
    //           "hidden": true,
    //           "icon": "home-3-fill",
    //           "isAmis": false,
    //           "isCustomSvg": false,
    //           "noClosable": false,
    //           "noKeepAlive": false,
    //           "redirect": "",
    //           "tabHidden": false,
    //           "title": "视图模板替换",
    //           "viewid": ""
    //         },
    //         "name": "AmisViewTemplate",
    //         "navShow": [
    //           {
    //             "alias": "编辑器管理",
    //             "roleId": "637a103aa2",
    //             "roleName": "编辑器管理"
    //           }
    //         ],
    //         "objectId": "729b7b0a86",
    //         "orderBy": 158,
    //         "parent": "62bf180f35",
    //         "updatedAt": "2023-03-27T07:34:40.715Z",
    //         "url": "/viewtemplate",
    //         "path": "/viewtemplate",
    //         "hidden": true,
    //         "menuHidden": false,
    //         "alwaysShow": false
    //       },
    //       {
    //         "ACL": {
    //           "role:admin": {
    //             "read": true,
    //             "write": true
    //           }
    //         },
    //         "createdAt": "2023-01-31T06:34:50.974Z",
    //         "icon": "home-3-fill",
    //         "meta": {
    //           "alwaysShow": false,
    //           "badge": "",
    //           component: () => import('@/views/CloudFunction/topo/index'),
    //           // "component": "@/views/CloudFunction/topo/index",
    //           "hidden": true,
    //           "icon": "home-3-fill",
    //           "isAmis": false,
    //           "isCustomSvg": false,
    //           "noClosable": false,
    //           "noKeepAlive": false,
    //           "redirect": "",
    //           "tabHidden": false,
    //           "title": "组态大屏",
    //           "viewid": ""
    //         },
    //         "name": "AmisKonvaScreen",
    //         "navShow": [
    //           {
    //             "alias": "编辑器管理",
    //             "roleId": "637a103aa2",
    //             "roleName": "编辑器管理"
    //           }
    //         ],
    //         "objectId": "bd66a18820",
    //         "orderBy": 158,
    //         "parent": "62bf180f35",
    //         "updatedAt": "2023-02-03T12:11:58.806Z",
    //         "url": "/Topo",
    //         "path": "/Topo",
    //         "hidden": true,
    //         "menuHidden": false,
    //         "alwaysShow": false
    //       },
    //       {
    //         "ACL": {
    //           "role:admin": {
    //             "read": true,
    //             "write": true
    //           }
    //         },
    //         "createdAt": "2022-12-13T02:47:15.605Z",
    //         "icon": "home-3-fill",
    //         "meta": {
    //           "alwaysShow": false,
    //           "badge": "",
    //           component: () => import('@/views/CloudFunction/amis/editor'),
    //           // "component": "@/views/CloudFunction/amis/editor",
    //           "hidden": true,
    //           "icon": "home-3-fill",
    //           "isCustomSvg": false,
    //           "noClosable": false,
    //           "noKeepAlive": false,
    //           "redirect": "",
    //           "tabHidden": false,
    //           "title": "amis编辑器"
    //         },
    //         "name": "AmisDgiotEditor",
    //         "navShow": [
    //           {
    //             "alias": "编辑器管理",
    //             "roleId": "637a103aa2",
    //             "roleName": "编辑器管理"
    //           }
    //         ],
    //         "objectId": "f738b892ee",
    //         "orderBy": 158,
    //         "parent": "62bf180f35",
    //         "updatedAt": "2023-02-03T12:11:58.741Z",
    //         "url": "/design/editor/amis",
    //         "path": "/design/editor/amis",
    //         "hidden": true,
    //         "menuHidden": false,
    //         "alwaysShow": false
    //       },
    //       {
    //         "ACL": {
    //           "role:admin": {
    //             "read": true,
    //             "write": true
    //           }
    //         },
    //         "createdAt": "2022-12-13T02:32:26.940Z",
    //         "icon": "home-3-fill",
    //         "meta": {
    //           "alwaysShow": false,
    //           "badge": "",
    //           component: () => import('@/views/CloudFunction/topo/editor'),
    //           // "component": "@/views/CloudFunction/topo/editor",
    //           "hidden": true,
    //           "icon": "home-3-fill",
    //           "isCustomSvg": false,
    //           "noClosable": false,
    //           "noKeepAlive": false,
    //           "redirect": "",
    //           "tabHidden": false,
    //           "title": "组态编辑器"
    //         },
    //         "name": "AmisTopoEditor",
    //         "navShow": [
    //           {
    //             "alias": "编辑器管理",
    //             "roleId": "637a103aa2",
    //             "roleName": "编辑器管理"
    //           }
    //         ],
    //         "objectId": "277f3727bd",
    //         "orderBy": 159,
    //         "parent": "62bf180f35",
    //         "updatedAt": "2023-02-03T12:11:58.734Z",
    //         "url": "/design/editor/topo",
    //         "path": "/design/editor/topo",
    //         "hidden": true,
    //         "menuHidden": false,
    //         "alwaysShow": false
    //       }
    //     ]
    //   }
    // ]
    commit('setRoutes', finallyRoutes)  //finallyRoutes
    // 根据可访问路由重置Vue Router
    await resetRouter(finallyRoutes)
  },
  /**
   * @description 设置缓存Name数组
   * @param {*} { commit }
   * @param {*} routes
   */
  setCachedRoutes({ commit }, routes) {
    commit('setCachedRoutes', routes)
  },
  setRoutesOpenTime({ commit }, info) {
    commit('setRoutesOpenTime', info)
  },
  /**
   * @description 修改Route Meta
   * @param {*} { commit }
   * @param options
   */
  changeMenuMeta({ commit }, options = {}) {
    commit('changeMenuMeta', options)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
