<template>
  <div class="index">
    <!-- 统计分类 -->
    <div>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <el-row :gutter="10">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <i class="iconfont icon-ico-jrddzs"></i>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <p>总订单</p>
                  <span>102,400</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <el-row :gutter="20">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <i class="iconfont icon-qian"></i>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <p>总销售额</p>
                  <span>102,400</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <el-row :gutter="20">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <i class="iconfont icon-dingdan"></i>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <p>今日订单数</p>
                  <span>102,400</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <el-row :gutter="20">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <i class="iconfont icon-qian1"></i>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <p>今日销售额</p>
                  <span>102,400</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
    </div>

    <!-- 统计表 -->
    <div class="total">
      <el-card class="box-card">
        <div id="main"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  methods: {
    Echarts() {
      // a. 初始化dom容器
      var myChart = echarts.init(document.getElementById("main"));

      // b.配置
      var option = {
        title: {
          text: "折线图堆叠"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };

      // c. 使用配置 生成报表
      myChart.setOption(option);
    }
  },
  mounted() {
    this.Echarts();
  }
};
</script>

<style lang="less">
.index {
  .grid-content {
    width: 300px;
  }
  .box-card {
    i {
      font-size: 35px;
      margin-left: 30px;
    }
    .icon-ico-jrddzs {
      color: #269fde;
    }
    .icon-qian {
      color: #d4237a;
    }
    .icon-dingdan {
      color: #1296db;
    }
    .icon-qian1 {
      color: #1afa29;
    }
    p {
      color: grey;
      font-size: 18px;
      margin-bottom: 10px;
    }
  }

  .total {
    #main {
      width: 800px;
      height: 500px;
    }
  }
}
</style>