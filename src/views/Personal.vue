<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>管理员信息</span>
      </div>
      <div>
        <span>管理员ID: {{ accountInfo.id }}</span>
        <el-divider></el-divider>
        <span>账号：{{ accountInfo.account }}</span>
        <el-divider></el-divider>
        <span>用户组: {{ accountInfo.userGroup }}</span>
        <el-divider></el-divider>
        <span>创建时间: {{ accountInfo.ctime|filterTime }}</span>
        <el-divider></el-divider>

        <span>管理员头像:</span>
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/account/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="accountInfo.imgUrl" :src="serveApi + accountInfo.imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-button
          @click="editAvator"
          style="margin-left: 30px; margin-top: 15px;"
          size="small"
          type="primary"
        >修改头像</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口函数
import { accountinfo, avatareditImg } from "@/api/account";

// 引入moment
import moment from "moment";

export default {
  data() {
    return {
      // 个人信息
      serveApi: "http://127.0.0.1:5000/upload/account/",
      accountInfo: {
        id: "", //管理员ID
        accont: "", //账号
        userGroup: "", //用户组
        ctime: "", //创建时间
        imgUrl: "" //图片地址
      }
    };
  },
  methods: {
    // 获取个人中心账号信息
    async getPersonInfo() {
      let { accountInfo } = await accountinfo(); //获取个人中心账号列表
      this.accountInfo = accountInfo; //赋值渲染
    },
    // 上传图片成功的回调
    handleAvatarSuccess(res) {
      // 回填头像
      let { code, imgUrl } = res;

      if (code === 0) {
        this.accountInfo.imgUrl = imgUrl;
      }
    },
    // 图片上传之前的处理函数
    beforeAvatarUpload() {},
    // 修改图片
    async editAvator() {
      let { code } = await avatareditImg({ imgUrl: this.accountInfo.imgUrl });

      if (code === 0) {
        // 发出通知 ( 给头部的小头像 )
        this.$bus.$emit("upAvatar");
      }
    }
  },
  created() {
    this.getPersonInfo(); //调用个人中心函数
  },
  filters: {
    // 过滤时间
    filterTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  background-color: #caced3;
  margin-left: 100px;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>