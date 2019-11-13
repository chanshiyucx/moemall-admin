import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    name: 'Ums',
    meta: { title: '系统管理', icon: 'ums' },
    children: [
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/ums/permission'),
        meta: { title: '权限管理', icon: 'permission', id: 28 }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/ums/role'),
        meta: { title: '角色管理', icon: 'role', id: 24 }
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/ums/admin'),
        meta: { title: '账户管理', icon: 'admin', id: 20 }
      }
    ]
  },
  {
    path: '/pms',
    component: Layout,
    name: 'Pms',
    meta: { title: '商品管理', icon: 'pms' },
    children: [
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/pms/category'),
        meta: { title: '分类管理', icon: 'category', id: 4 }
      },
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/pms/brand'),
        meta: { title: '品牌管理', icon: 'brand', id: 6 }
      },
      {
        path: 'productAttr',
        name: 'ProductAttr',
        component: () => import('@/views/pms/productAttr'),
        meta: { title: '属性管理', icon: 'productAttr', id: 5 }
      },
      {
        path: 'productAttrList',
        name: 'ProductAttrList',
        hidden: true,
        component: () => import('@/views/pms/productAttrList'),
        meta: { title: '属性管理' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
