<template>
  <div class="home">
    <el-container>
        <!-- 左侧 -->
        <LeftNav/>
        <!-- 右侧 -->
        <RightContent/>
    </el-container>
  </div>
</template>

<script>
// 引入组件
import LeftNav from "../components/LayOut/LeftNav.vue";
import RightContent from "../components/LayOut/RightContent.vue";

export default {
    // 注册组件
    components:{
        LeftNav,
        RightContent
    }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>