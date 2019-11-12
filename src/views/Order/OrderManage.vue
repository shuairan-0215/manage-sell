<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单管理</span>
      </div>
      <!-- 查询 -->
      <div>
        <!-- 订单号 -->
        <el-form
          style="margin-bottom: 20px;"
          size="small"
          :inline="true"
          :model="searchForm"
          class="demo-form-inline"
        >
          <!-- 订单号 -->
          <el-form-item label="订单号">
            <el-input placeholder="订单号" v-model="searchForm.orderNo"></el-input>
          </el-form-item>

          <!-- 收货人 -->
          <el-form-item label="收货人">
            <el-input placeholder="收货人" v-model="searchForm.consignee"></el-input>
          </el-form-item>

          <!-- 手机号 -->
          <el-form-item label="手机号">
            <el-input placeholder="手机号" v-model="searchForm.phone"></el-input>
          </el-form-item>

          <!-- 订单状态 -->
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderState" placeholder="订单状态">
              <el-option label="已受理" value="已受理"></el-option>
              <el-option label="派送中" value="派送中"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
            </el-select>
          </el-form-item>

          <!-- 选择时间 -->
          <el-form-item>
            <span class="demonstration">选择时间</span>
            <el-date-picker
              v-model="searchForm.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>

          <!-- 清除和查询按钮 -->
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="clear">清除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table border style="width: 100%" :data="tableData">
        <el-table-column fixed prop="orderNo" label="订单号" width="100"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间" width="160"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
        <el-table-column prop="deliverAddress" label="配送地址" width="120"></el-table-column>
        <el-table-column prop="deliveryTime" label="配送时间" width="160"></el-table-column>
        <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
        <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>

        <el-table-column prop="orderState" label="操作" width="80">
          <!-- 操作 -->
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// 引入接口函数
import { getOrderList } from "@/api/order";

// 引入时间模块
import moment from "moment";

export default {
  data() {
    return {
      // 订单表格数据
      tableData: [],
      // 搜索表单数据
      searchForm: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      },
      currentPage: 1, //当前页
      pageSize: 3, //每页条数
      total: 12 //总条数
    };
  },
  methods: {
    // 查询
    search() {
      this.currentPage = 1;
      this.getOrders(); //调用获取列表函数
    },
    // 清除
    clear() {
      // 搜索表单数据
      this.searchForm = {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      };
      this.getOrders();
    },
    // 获取订单
    async getOrders() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderNo: this.searchForm.orderNo,
        consignee: this.searchForm.consignee,
        phone: this.searchForm.phone,
        orderState: this.searchForm.orderState,
        date: JSON.stringify(this.searchForm.date)
      };

      // 发送请求 获取订单列表
      let { total, data } = await getOrderList(params);

      this.total = total;

      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD hh:mm:ss");
        v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD hh:mm:ss");
      });

      this.tableData = data;
    },

    // 当前页码改变时
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrders();
    },
    // 查看订单详情
    handleClick(row) {
      // 将订单信息存入本地存储
      window.sessionStorage.setItem("orderdetails", JSON.stringify(row));

      // 跳转到详情页面
      this.$router.push("/home/orderdetails");
    }
  },

  // 钩子函数  创建后加载
  created() {
    this.getOrders();
  }
};
</script>

<style lang="less" scoped>
.demonstration {
  margin-right: 10px;
}
.pages {
  margin: 30px 0;
}
</style>