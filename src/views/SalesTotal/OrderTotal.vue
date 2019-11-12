<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 选择时间 -->
      <el-form-item>
        <span class="demonstration">选择时间</span>
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <!-- 查询 -->
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <el-card class="box-card">
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
// 引入订单接口函数
import { ordertotal } from "@/api/order";

// 引入时间模块
import moment from "moment";

import echarts from "echarts";

export default {
  data() {
    return {
      date: ""
    };
  },
  methods: {
    Echarts(xArr, yArr) {
      // a. 初始化dom容器
      var myChart = echarts.init(document.getElementById("main"));

      var colors = ["#5793f3", "#d14a61", "#675bba"];

      // b.配置
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xArr
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} 元"
          }
        },
        series: [
          {
            data: yArr,
            type: "line",
            areaStyle: {}
          }
        ]
      };

      // c. 使用配置 生成报表
      myChart.setOption(option);
    },
    // 获取数据
    async getTotalInfo() {
      // 获取报表的数据
      let { data } = await ordertotal({ date: JSON.stringify(this.date) });

      // 循环 处理时间格式
      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YY/MM/DD");
      });

      // 将时间相同的数据归类 (数据去重)
      let obj = {};

      //数据处理
      data.forEach(v => {
        if (!obj[v.orderTime]) {
          obj[v.orderTime] = v.orderAmount;
        } else {
          obj[v.orderTime] += v.orderAmount;
        }
      });

      let xArr = [];
      let yArr = [];

      for (let key in obj) {
        xArr.push(key);
        yArr.push(obj[key]);
      }

      // 画图
      this.Echarts(xArr, yArr);
    },
    // 查询数据
    search() {
      this.getTotalInfo();
    }
  },
  mounted() {
    this.getTotalInfo();
  }
};
</script>

<style lang="less" scoped>
.demonstration {
  margin-right: 20px;
}
.box-card {
  div {
    width: 900px;
    height: 600px;
  }
}
</style>