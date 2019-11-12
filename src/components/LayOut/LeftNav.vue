<template>
  <div class="leftnav">
    <el-aside width="200px">
      <el-menu
        :default-active="path"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
        unique-opened
        router
      >
        <!-- 循环渲染菜单 -->
        <template v-for="(item,index) in menus">
          <!-- 一级导航 -->
          <el-menu-item v-if="!item.children" :index="item.path" :key="index">
            <i class="iconfont" :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>

          <!-- 二级导航 -->
          <el-submenu v-else :index="item.path" :key="index">
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(v,index) in item.children"
                :key="index"
                :index="v.path"
              >{{ v.title }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
// 引入本地存储工具函数
import local from "@/utils/local";

export default {
  data() {
    return {};
  },
  computed: {
    // 路由高亮
    path() {
      // 路径中包含order 就跳转到'/home/ordermanage'
      if (this.$route.path === "/home/orderdetails") {
        return "/home/ordermanage";
      }
      if (this.$route.path === "/home/goodsedit") {
        return "/home/goodslist";
      }
      return this.$route.path;
    }
  },
  // 路由导航权限
  created() {
    // 后端返回的菜单（角色分类）
    let role = local.get("role");

    // 菜单列表
    // 导航菜单数据
    let menus = [
      //后台首页
      {
        path: "/home",
        icon: "icon-1",
        title: "后台首页",
        meta: {
          roles: ["super", "general"]
        }
      },
      //订单管理
      {
        path: "/home/ordermanage",
        icon: "icon-dingdan",
        title: "订单管理",
        meta: {
          roles: ["super", "general"]
        }
      },
      //商品管理
      {
        path: "/home/goodsmanage",
        icon: "icon-shangpin",
        title: "商品管理",
        children: [
          { path: "/home/goodslist", title: "商品列表" },
          { path: "/home/goodsadd", title: "添加商品" }
        ],
        meta: {
          roles: ["super", "general"]
        }
      },
      //店铺管理
      {
        path: "/home/shopmanage",
        icon: "icon-dianpu",
        title: "店铺管理",
        meta: {
          roles: ["super", "general"]
        }
      },
      //账号管理
      {
        path: "/home/accountmanage",
        icon: "icon-zhanghao",
        title: "账号管理",
        children: [
          { path: "/home/accountlist", title: "账号列表" },
          { path: "/home/accountadd", title: "添加账号" },
          { path: "/home/passwordmodify", title: "修改密码" }
        ],
        meta: {
          roles: ["super"]
        }
      },
      //销售统计
      {
        path: "/home/salsetotal",
        icon: "icon-tongji",
        title: "销售统计",
        children: [
          { path: "/home/goodstotal", title: "商品统计" },
          { path: "/home/ordertotal", title: "订单统计" }
        ],
        meta: {
          roles: ["super"]
        }
      }
    ];

    // 根据后端返回的角色 计算出权限菜单
    let accMenus = menus.filter(
      item => item.meta && item.meta.roles.includes(role)
    );
    // 赋值
    this.menus = accMenus;
  }
};
</script>

<style lang="less" scoped>
.leftnav {
  background-color: #304156;
  .el-menu {
    border: none;
    .el-menu-item {
      i {
        color: #fff;
        margin-right: 10px;
      }
    }
    .el-submenu {
      i {
        color: #fff;
        margin-right: 10px;
      }
      .el-menu-item-group {
        background-color: #202f3f !important;
        .el-menu-item {
          background-color: #202f3f !important;
        }
      }
    }
  }
}
</style>