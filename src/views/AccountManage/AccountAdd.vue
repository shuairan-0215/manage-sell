<template> 

  <div class="accountadd">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加账号</span>
        <!-- 表单 -->
        <div class="addform">
          <el-form
            status-icon
            ref="accountAddForm"
            label-width="100px"
            :rules="rules"
            :model="accountAddForm"
          >
            <el-form-item label="账号" prop="account">
              <el-input autocomplete="off" v-model="accountAddForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" autocomplete="off" v-model="accountAddForm.password"></el-input>
            </el-form-item>
            <el-form-item label="用户组" prop="userGroup">
              <el-select placeholder="请选择用户组" v-model="accountAddForm.userGroup">
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通管理员" value="普通管理员"></el-option>
              </el-select>
            </el-form-item>
            <!-- 提交 重置按钮 -->
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入工具函数
import { pwdReg } from "@/utils/reg.js";

// 引入接口请求方法
import { addAccount } from "@/api/account.js";

// 自定义验证
const validatePwd = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码")); //错误提示 非空
  } else if (!rule.pattern.test(value)) {
    callback(new Error("密码包含数字和英文  长度为 3 ~ 12 位")); //错误提示  密码填写要求
  } else {
    callback(); //成功
  }
};

export default {
  data() {
    return {
      // 添加账号表单
      accountAddForm: {
        account: "",
        password: "",
        userGroup: ""
      },
      // 表单验证规则
      rules: {
        // 验证账号
        account: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { min: 3, max: 6, message: "账号长度为3 ~ 6", trigger: "blur" }
        ],
        // 验证密码
        password: [
          // { required: true, message: "密码不能为空", trigger: "blur" },
          // { min: 3, max: 6, message: "密码长度为3 ~ 6", trigger: "blur" }
          {
            required: true,
            pattern: pwdReg(),
            validator: validatePwd,
            trigger: "blur"
          }
        ],
        // 验证用户组
        userGroup: [
          { required: true, message: "请选择用户组", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //提交表单
    submitForm() {
      // 检查所有字段 
      this.$refs.accountAddForm.validate(async valid => {
        if (valid) {
          // 前端 发送添加账号请求  
          let {code,msg} = await addAccount(this.accountAddForm);
          if (code === 0) {
            // 路由跳转
            this.$router.push("/home/accountList");
          } else {
            // 错误提示
            this.$message.error(msg);
          }
        } else {
          return false;
        }
      });
    },
    //重置表单
    resetForm() {
      this.$refs.accountAddForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.accountadd {
  .addform {
    .el-form-item {
      .el-input {
        width: 300px;
      }
      .el-select {
        width: 300px;
      }
    }
  }
}
</style>