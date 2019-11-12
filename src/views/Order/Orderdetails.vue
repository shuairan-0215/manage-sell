<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight:600">订单详情</span>
        <el-button
          style="float: right; padding: 3px 0; width:50px;height:30px"
          @click="handClick"
          :type="isEdit ? 'success' : 'primary'"
        >{{ btnText }}</el-button>
      </div>
      <!-- 详情表单 -->
      <div>
        <span>
          订单号:
          <span v-if="!isEdit">{{ orderdetails.orderNo }}</span>
          <input v-else v-model="orderdetails.orderNo" />
        </span>
        <el-divider></el-divider>
        <span>
          下单时间:
          <span v-if="!isEdit">{{ orderdetails.orderTime }}</span>
          <el-date-picker
            v-else
            v-model="orderdetails.orderTime"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </span>
        <el-divider></el-divider>
        <span>
          手机号:
          <span v-if="!isEdit">{{ orderdetails.phone }}</span>
          <input v-else v-model="orderdetails.phone" />
        </span>
        <el-divider></el-divider>
        <span>
          收货人:
          <span v-if="!isEdit">{{ orderdetails.consignee }}</span>
          <input v-else v-model="orderdetails.consignee" />
        </span>
        <el-divider></el-divider>
        <span>
          配送地址:
          <span v-if="!isEdit">{{ orderdetails.deliverAddress }}</span>
          <input v-else v-model="orderdetails.deliverAddress" />
        </span>
        <el-divider></el-divider>
        <span>
          配送时间:
          <span v-if="!isEdit">{{ orderdetails.deliveryTime }}</span>
          <el-date-picker
            v-else
            v-model="orderdetails.deliveryTime"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </span>
        <el-divider></el-divider>
        <span>
          用户备注:
          <span v-if="!isEdit">{{ orderdetails.remarks }}</span>
          <input v-else v-model="orderdetails.remarks" />
        </span>
        <el-divider></el-divider>
        <span>
          订单金额:
          <span v-if="!isEdit">{{ orderdetails.orderAmount }}</span>
          <input v-else v-model="orderdetails.orderAmount" />
        </span>
        <el-divider></el-divider>
        <span>
          订单状态:
          <span v-if="!isEdit">{{ orderdetails.orderState }}</span>
          <el-select v-else v-model="orderdetails.orderState" placeholder="请选择活动区域">
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="已受理" value="已受理"></el-option>
            <el-option label="派送中" value="派送中"></el-option>
          </el-select>
        </span>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口函数
import { editOrder } from "@/api/order";

import { log } from "util";
export default {
  data() {
    return {
      // 订单详情
      orderdetails: {},
      // 是否可以编辑
      isEdit: false
    };
  },
  created() {
    //   获取本地存储
    this.orderdetails = JSON.parse(
      window.sessionStorage.getItem("orderdetails")
    );
  },
  methods: {
    //点击 编辑&保存 切换
    async handClick() {
      this.isEdit = !this.isEdit;

      //  如果点击的是保存
      if (!this.isEdit) {
        let { code } = await editOrder(this.orderdetails);

        if (code === 0) {
          this.$router.push("/home/ordermanage");
        }
      }
    }
  },
  //   计算按钮属性
  computed: {
    btnText() {
      return this.isEdit === false ? "编辑" : "保存";
    }
  }
};
</script>

<style lang="less" scoped>
input {
  height: 20px;
  font-size: 16px;
}
</style>