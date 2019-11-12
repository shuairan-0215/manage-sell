<template>
  <div class="rightcont">
    <el-container>
      <!-- 右侧头部 -->
      <RightHeader />
      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// 引入组件
import RightHeader from "./RightHeader";

export default {
  components: {
    RightHeader
  }
};
</script>

<style lang="less" scoped>
.rightcont {
  height: 100%;
  width: 100%;
  background-color: #EFF1F4;
  .el-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
}
</style>