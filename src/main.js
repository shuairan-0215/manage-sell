import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/css/reset.css" //引入reset.css  重置样式
import "./assets/fonts/iconfont.css" //引入iconfont.css  矢量图
// 引入element
import ElementUI from "element-ui"//组件
import "element-ui/lib/theme-chalk/index.css"//css样式
// 引入echarts
import echarts from "echarts"
// 引入本地存储工具函数
import local from "@/utils/local";

// 创建bus
const bus = new Vue()
Vue.prototype.$bus = bus;

Vue.prototype.$echarts = echarts
// 注册element-ui
Vue.use(ElementUI)
Vue.config.productionTip = false

// 路由守卫(拦截所有路由 进入所有路由之前 必须先走路由守卫)
// to : 即将要进入的目标 路由对象;  from:当前导航正要离开的路由; next :依赖回调 执行下一步 为钩子函数
router.beforeEach((to, from, next) => {
  // 从本地存储获取token
  let token = local.get("token")

  // 判断token  token存在 证明登录是成功进来的
  if (token) {
    next() //进行下一步
  } else {// token不存在 证明没有登录 通过其他非法途径进入
    // 去登录页面 直接放行
    if (to.path === "/login") {
      next()
    } else {//如果要去其他地址 直接跳转到登录页面
      next("/login")
    }
  }
})





new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
