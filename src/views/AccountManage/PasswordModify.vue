<template>
  <div class="modify">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
        <div>
          <div class="addform">
            <el-form
              status-icon
              ref="changePwdForm"
              label-width="100px"
              :model="changePwdForm"
              :rules="rules"
            >
              <el-form-item label="原密码" prop="oldPwd">
                <el-input type="password" autocomplete="off" v-model="changePwdForm.oldPwd"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPwd">
                <el-input type="password" autocomplete="off" v-model="changePwdForm.newPwd"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="checkPass">
                <el-input type="password" autocomplete="off" v-model="changePwdForm.checkPass"></el-input>
              </el-form-item>

              <!-- 提交 重置按钮 -->
              <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入工具函数
import { pwdReg } from "@/utils/reg.js";

// 引入接口函数
import { checkoldpwd, passwordedit } from "@/api/account";

// 引入本地存储工具函数
import local from "@/utils/local";

export default {
  data() {
    // 原密码的自定义验证
    const validatePwd = async (rule, value, callback) => {
      //发送请求 验证原密码是否正确
      let { code, msg } = await checkoldpwd({ oldPwd: value });

      // 判断密码
      if (!value) {
        callback(new Error("请输入原密码"));
      } else if (code === "11") {
        callback(new Error(msg)); //原密码错误
      } else {
        callback(); //成功
      }
    };

    // 新密码自定义规则
    const validateNewPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码")); //错误提示 非空
      } else if (value === this.changePwdForm.oldPwd) {
        callback(new Error("不能和原密码一样"));
      } else if (!rule.pattern.test(value)) {
        callback(new Error("密码包含数字和英文  长度为 3 ~ 12 位")); //错误提示  密码填写要求
      } else {
        // 新密码不为空
        if (this.changePwdForm.checkPass !== "") {
          this.$refs.changePwdForm.validateField("checkPass"); //再次触发某个"字段"的验证
        }

        callback(); //成功
      }
    };

    // 确认密码
    const validateCheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.changePwdForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 添加账号表单
      changePwdForm: {
        oldPwd: "",
        newPwd: "",
        checkPass: ""
      },
      // 表单验证规则
      rules: {
        // 验证原密码
        oldPwd: [
          {
            required: true,
            validator: validatePwd,
            trigger: "blur"
          }
        ],
        // 验证新密码
        newPwd: [
          {
            required: true,
            pattern: pwdReg(),
            validator: validateNewPwd,
            trigger: "blur"
          }
        ],
        // 确认密码是否相同
        checkPass: [
          {
            required: true,
            pattern: pwdReg(),
            validator: validateCheckPass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //提交表单
    submitForm() {
      // 选中整个表单 触发所有验证 如果都通过 valid就是true 否则就是false
      this.$refs.changePwdForm.validate(async valid => {
        if (valid) {
          let { code } = await passwordedit({
            newPwd: this.changePwdForm.newPwd
          });

          if (code === 0) {
            // 清除token
            local.remove("token");

            // 跳转到登录页面
            this.$router.push("/login");
          } else {
            return false;
          }
        }
      });
    },
    //重置表单
    resetForm() {
      this.$refs.changePwdForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.modify {
  .el-form-item {
    .el-input {
      width: 300px;
    }
    .el-select {
      width: 300px;
    }
  }
}
</style>