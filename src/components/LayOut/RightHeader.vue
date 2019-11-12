<template>
  <div class="rightheader">
    <el-row :gutter="10">
      <el-col :span="18">
        <el-header class="bread">
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :key="i" v-for="(item, i) in breadArr" :to="{ path: item.path }">{{ item.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
      </el-col>
      <el-col :span="4" class="right">
        <div class="welcome">欢迎你 {{ account }}</div>

        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <!-- 下拉菜单 -->
            <div class="img">
              <img v-if="imgUrl" :src="serveApi + imgUrl" alt />
            </div>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入本地存储工具函数
import local from "@/utils/local";

// 获取账号信息接口函数
import { accountinfo } from "@/api/account";

export default {
  data() {
    return {
      serveApi: "http://127.0.0.1:5000/upload/account/",
      account: "",
      imgUrl: "",
      breadArr: [] //面包屑
    };
  },
  methods: {
    // topersonal() {
    //   this.$router.push("/home/personal");
    // },
    handleCommand(command) {
      if (command === "logout") {
        // 退出登录
        // 1. 清除本地存储（token）
        local.remove("token");
        // 2. 跳转到登录页面
        this.$router.push({ path: "/login" });

        // 3. 给出提示信息
        this.$message({
          type: "success",
          message: "退出成功"
        });
      } else if (command === "personal") {
        this.$router.push("/home/personal");
      }
    },
    // 获取账号信息
    async getInfo() {
      let { accountInfo } = await accountinfo();
      let { account, imgUrl } = accountInfo;

      this.account = account;
      this.imgUrl = imgUrl;
    },
    // 面包屑
    breadArrlist() {
      // 取出meta中的数组
      this.breadArr = this.$route.meta.breadArr;
    }
  },
  created() {
    this.getInfo();//获取数据

    // // // 监听头像改变( 信息传递 子组件 =》 子组件)
    this.$bus.$on("upAvatar", () => {
      this.getInfo(); //重新获取数据
    });

    this.breadArrlist();//调用面包屑函数

  },
  // 观察数据变化
  watch:{
    "$route.path"(){
      this.breadArrlist();//面包屑
    }
  }
};
</script>

<style lang="less" scoped>
.rightheader {
  background-color: #fff;
  .el-breadcrumb,
  .your {
    line-height: 60px;
    height: 60px;
  }
  .right {
    display: flex;
    align-items: center;

    .img {
      width: 50px;
      height: 50px;
      margin-left: 10px;
      img {
      border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>