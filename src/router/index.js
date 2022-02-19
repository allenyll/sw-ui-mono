import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/logout',
    component: () => import('@/views/logout/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'sw-dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/sys',
    component: Layout,
    name: '系统管理',
    meta: { title: '系统管理', icon: 'sw-system', perms: 'sys:sys' },
    icon: 'setting',
    children: [{
      path: 'user',
      component: () => import('@/views/admin/user/index'),
      name: '用户管理',
      meta: { title: '用户管理', icon: 'sw-user', perms: 'sys:user:user', noCache: true }
    }, {
      path: 'menu',
      component: () => import('@/views/admin/menu/index'),
      name: '菜单管理',
      meta: { title: '菜单管理', icon: 'sw-menu', perms: 'sys:menu:menu', noCache: true }
    }, {
      path: 'depot',
      component: () => import('@/views/admin/depot/index'),
      name: '组织管理',
      meta: { title: '组织管理', icon: 'sw-depot', perms: 'sys:depot:depot', noCache: true }
    }, {
      path: 'role',
      component: () => import('@/views/admin/role/index'),
      name: '角色管理',
      meta: { title: '角色管理', icon: 'sw-role', perms: 'sys:role:role', noCache: true }
    }]
  },
  {
    path: '/sys/dict',
    // component: () => import('@/views/admin/dict/index'),
    component: Layout,
    name: '字典管理',
    meta: { title: '字典管理', icon: 'sw-dict', perms: 'sys:dict:dict', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/views/admin/dict/index'),
        name: '字典列表',
        meta: { title: '字典列表', icon: 'sw-dict', perms: 'sys:dict:list', noCache: true }
      },
      {
        path: 'edit',
        component: () => import('@/views/admin/dict/components/childDict'),
        name: '编辑字典',
        meta: { title: '编辑字典', noCache: true, perms: 'sys:dict:edit' },
        hidden: true
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: '系统工具',
    meta: { title: '系统工具', icon: 'sw-tools', perms: 'monitor:monitor' },
    icon: 'setting',
    children: [
      {
        path: 'log',
        component: () => import('@/views/monitor/log/index'),
        name: '系统日志',
        meta: { title: '系统日志', icon: 'sw-log', perms: 'sys:log:log', noCache: true }
      },
      {
        path: 'swagger',
        component: Layout,
        name: '接口文档',
        children: [
          {
            path: 'http://www.allenyll.com:10001/swagger-ui.html',
            meta: { title: '接口文档', icon: 'sw-interface' }
          }
        ]
        //  meta: { title: '接口文档', icon: 'sw-interface', perms: 'monitor:swagger:swagger', noCache: true }
      },
      {
        path: 'generator',
        component: () => import('@/views/monitor/generator/index'),
        name: '代码工具',
        meta: { title: '代码工具', icon: 'sw-code', perms: 'sys:generator:generator', noCache: true }
      },
      {
        path: 'cache',
        component: () => import('@/views/monitor/cache/index'),
        name: '缓存管理',
        meta: { title: '缓存管理', icon: 'sw-cache', perms: 'sys:cache:cache', noCache: true }
      },
      {
        path: 'job',
        component: () => import('@/views/admin/job/index'),
        name: '调度任务',
        meta: { title: '调度任务', icon: 'sw-job', perms: 'sys:job:list', noCache: true }
      },
      {
        path: 'jobLog',
        component: () => import('@/views/admin/jobLog/index'),
        name: '调度日志',
        meta: { title: '调度日志', icon: 'sw-log', perms: 'sys:jobLog:list', noCache: true }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    name: '会员管理',
    meta: { title: '会员管理', icon: 'sw-customer', perms: 'customer:customer' },
    icon: 'setting',
    children: [
      {
        path: 'customer',
        component: () => import('@/views/customer/customer/index'),
        name: '会员管理',
        meta: { title: '会员管理', icon: 'sw-role', perms: 'customer:customer:list', noCache: true }
      },
      {
        path: 'customerPoint',
        component: () => import('@/views/customer/customerPoint/index'),
        name: '积分管理',
        meta: { title: '积分管理', icon: 'sw-point', perms: 'customer:point:list', noCache: true }
      },
      {
        path: 'customerPointDetail',
        component: () => import('@/views/customer/customerPointDetail/index'),
        name: '积分详情',
        meta: { title: '积分详情', noCache: true, perms: 'customer:customerPointDetail:list' },
        hidden: true
      },
      {
        path: 'balance',
        component: () => import('@/views/customer/balance/index'),
        name: '余额管理',
        meta: { title: '余额管理', icon: 'sw-balance', perms: 'customer:balance:list', noCache: true }
      },
      {
        path: 'customerLevel',
        component: () => import('@/views/customer/customerLevel/index'),
        name: '会员等级',
        meta: { title: '会员等级', icon: 'sw-level', perms: 'customer:customerLevel:list', noCache: true }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    name: '商品管理',
    meta: { title: '商品管理', icon: 'sw-goods', perms: 'goods:goods' },
    icon: 'setting',
    children: [
      {
        path: 'brand',
        component: () => import('@/views/goods/brand/index'),
        name: '品牌管理',
        meta: { title: '品牌管理', icon: 'sw-brand', noCache: true, perms: 'goods:brand:list' }
      },
      {
        path: 'specsGroup',
        component: () => import('@/views/goods/specsGroup/index'),
        name: '规格组',
        meta: { title: '规格组', icon: 'sw-group', noCache: true, perms: 'goods:specsGroup:list' }
      },
      {
        path: 'specs',
        component: () => import('@/views/goods/specs/index'),
        name: '规格管理',
        meta: { title: '规格管理', icon: 'sw-spec', noCache: true, perms: 'goods:specs:list' }
      },
      {
        path: 'specOption',
        component: () => import('@/views/goods/specOption/index'),
        name: '规格选项',
        meta: { title: '规格选项', icon: 'sw-spec', noCache: true, perms: 'goods:specOption:list' }
      },
      {
        path: 'category',
        component: () => import('@/views/goods/category/index'),
        name: '商品分类',
        meta: { title: '商品分类', icon: 'sw-class', perms: 'goods:category:list', noCache: true }
      },
      {
        path: 'goods',
        component: () => import('@/views/goods/goods/index'),
        name: '商品列表',
        meta: { title: '商品列表', icon: 'sw-goods', perms: 'goods:goods:list', noCache: true }
      },
      {
        path: 'addGoods',
        component: () => import('@/views/goods/goods/addGoods'),
        name: '添加商品',
        meta: { title: '添加商品', icon: 'sw-add', perms: 'goods:goods:addGoods', noCache: true }
      },
      {
        path: 'updateGoods',
        name: 'updateGoods',
        component: () => import('@/views/goods/goods/updateGoods'),
        meta: { title: '修改商品', icon: 'sw-wdit' },
        hidden: true
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: '订单管理',
    meta: { title: '订单管理', icon: 'sw-order', perms: 'order:order' },
    icon: 'setting',
    children: [
      {
        path: 'order',
        component: () => import('@/views/order/order/index'),
        name: '订单列表',
        meta: { title: '订单列表', icon: 'sw-order', noCache: true, perms: 'order:order:list' }
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/order/order/deliverOrderList'),
        meta: { title: '发货列表' },
        hidden: true
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/order/order/orderDetail'),
        meta: { title: '订单详情' },
        hidden: true
      },
      {
        path: 'orderAftersale',
        component: () => import('@/views/orderAftersale/orderAftersale/index'),
        name: '售后申请',
        meta: { title: '售后申请', icon: 'sw-aftersale', noCache: true, perms: 'orderAftersale:orderAftersale:list' }
      },
      {
        path: 'orderAftersaleDetail',
        name: 'orderAftersaleDetail',
        component: () => import('@/views/orderAftersale/detail/index'),
        meta: { title: '售后申请单详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    name: '营销管理',
    meta: { title: '营销管理', icon: 'sw-market', perms: 'market:market' },
    icon: 'setting',
    children: [
      {
        path: 'coupon',
        component: () => import('@/views/market/coupon/index'),
        name: '优惠券管理',
        meta: { title: '优惠券管理', icon: 'sw-coupon', noCache: true, perms: 'market:coupon:list' }
      },
      {
        path: 'couponDetail',
        name: 'couponDetail',
        component: () => import('@/views/market/coupon/detail'),
        meta: { title: '优惠券领取详情' },
        hidden: true
      },
      {
        path: 'adPosition',
        component: () => import('@/views/market/adPosition/index'),
        name: '广告位管理',
        meta: { title: '广告位管理', icon: 'sw-ad', noCache: true, perms: 'market:adPosition:list' }
      },
      {
        path: 'ad',
        component: () => import('@/views/market/ad/index'),
        name: '广告管理',
        meta: { title: '广告管理', icon: 'sw-ad', noCache: true, perms: 'market:ad:list' }
      },
      {
        path: 'message',
        component: () => import('@/views/market/message/index'),
        name: '消息管理',
        meta: { title: '消息管理', icon: 'sw-message', noCache: true, perms: 'market:message:list' }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    name: '商城管理',
    meta: { title: '商城管理', icon: 'sw-store', perms: 'shop:shop' },
    icon: 'setting',
    children: [
      {
        path: 'keywords',
        component: () => import('@/views/shop/keywords/index'),
        name: '关键字管理',
        meta: { title: '关键字管理', icon: 'sw-word', noCache: true, perms: 'shop:keyword:list' }
      },
      {
        path: 'searchHistory',
        name: '搜索历史',
        component: () => import('@/views/shop/searchHistory/index'),
        meta: { title: '搜索历史', icon: 'sw-check', noCache: true, perms: 'shop:searchHistory:list' }
      },
      {
        path: 'feedback',
        name: '意见反馈',
        component: () => import('@/views/shop/feedback/index'),
        meta: { title: '意见反馈', icon: 'sw-feedback', noCache: true, perms: 'shop:feedback:list' }
      },
      {
        path: 'footprint',
        name: '我的足迹',
        component: () => import('@/views/shop/footprint/index'),
        meta: { title: '我的足迹', icon: 'sw-footprint', noCache: true, perms: 'shop:footprint:list' }
      }
    ]
  },
  {
    path: '/store',
    component: Layout,
    name: '店铺管理',
    meta: { title: '店铺管理', icon: 'sw-shop', perms: 'store:store' },
    icon: 'setting',
    children: [
      {
        path: 'shop',
        component: () => import('@/views/shop/shop/index'),
        name: '店铺列表',
        meta: { title: '店铺列表', icon: 'sw-shop-list', noCache: true, perms: 'store:store:list' }
      },
      {
        path: 'shopAddress',
        name: '发货地址',
        component: () => import('@/views/shop/shopAddress/index'),
        meta: { title: '发货地址', icon: 'sw-deliver', noCache: true, perms: 'shopAddress:shopAddress:list' }
      }
    ]
  }
]
