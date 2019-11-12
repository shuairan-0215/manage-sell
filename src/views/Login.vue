<template>
  <div class="login">
    <!-- 登录表单 -->
    <el-form class="login-form" :model="loginForm" ref="loginForm" :rules="rulers">
      <!-- ref类似于id  rules表单验证规则-->
      <div class="title">
        <h1>系统登录</h1>
      </div>
      <!-- 账号 -->
      <el-form-item prop="account">
        <el-input
          autocomplete="off"
          prefix-icon="iconfont icon-zhanghao"
          v-model="loginForm.account"
        ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          @click.native="changeType"
          :type="isOpen ? 'text' : 'password'"
          v-model="loginForm.password"
          autocomplete="off"
          prefix-icon="iconfont icon-mima"
          :suffix-icon="isOpen ? 'iconfont icon-yanjing-zheng' : 'iconfont icon-yanjing_bi'"
        ></el-input>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//引入工具函数
import { pwdReg } from "../utils/reg";

// 引入本地存储工具函数
import local from "@/utils/local";

// 引入接口
import { checkLogin } from "@/api/account.js";

export default {
  data() {
    // // 自定义验证密码
    const validatePwd = (rule, value, callback) => {
      // rule: 验证规则对象  value: 用户输入的值， callback: 回调函数
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!rule.pattern.test(value)) {
        callback(new Error("密码包含数字和英文，长度 3 ~ 12 位"));
      } else {
        callback();
      }
    };

    return {
      loginForm: {
        account: "",
        password: ""
      },
      // 眼睛的状态 默认闭
      isOpen: false,
      // 验证规则
      rulers: {
        // 内置验证
        account: [
          { required: true, message: "账户不能为空", trigger: "blur" }, //非空验证
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" } //长度
        ],
        password: [
          // { required: true, message: "请输入密码", trigger: "blur" },//非空验证
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }//长度

          // 自定义验证
          { validator: validatePwd, pattern: pwdReg(), trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 切换眼睛是开还是闭
    changeType(e) {
      if (e.target.className.includes("icon-yanjing")) {
        this.isOpen = !this.isOpen;
      }
    },
    // 登录
    submitForm(formName) {
      // validate 验证表单的所有字段  内置方法 返回布尔
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 发送登录请求
          let { code, token, role } = await checkLogin(this.loginForm);

          // 如果登录成功 跳转到后台首页
          if (code === 0) {
            // 把token存入本地存储
            local.set("token", token);
            local.set("role", role);
            // 跳转到后台首页
            this.$router.push("/home");
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" >
.login {
  height: 100%;
  background-color: #001d26;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    width: 400px;
    .title {
      color: #fff;
      font-size: 26px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 30px;
    }
    .el-form-item {
      .el-input {
        width: 100%;
        border: none;
        input {
          background-color: #283443;
          border: none;
          color: #fff;
        }
      }
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>