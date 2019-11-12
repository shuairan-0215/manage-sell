<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑商品</span>
      </div>
      <!-- 表单 -->
      <div>
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <!-- 商品名称 -->
          <el-form-item label="商品名称" >
            <el-input v-model=" goodseditForm.goodsname "></el-input>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="商品分类" >
            <el-select placeholder="请选择商品分类" v-model="goodseditForm.goodscategory">
              <el-option label="微辣" value="微辣"></el-option>
              <el-option label="中辣" value="中辣"></el-option>
              <el-option label="特辣" value="特辣"></el-option>
            </el-select>
          </el-form-item>
          <!-- 商品特色 -->
          <el-form-item label="商品特色" >
            <el-checkbox-group v-model="goodseditForm.goodsfeature">
              <el-checkbox label="新品上市" name="type"></el-checkbox>
              <el-checkbox label="第二件半价" name="type"></el-checkbox>
              <el-checkbox label="主打产品" name="type"></el-checkbox>
              <el-checkbox label="火爆产品" name="type"></el-checkbox>
              <el-checkbox label="祖传手艺" name="type"></el-checkbox>
              <el-checkbox label="来自四川  " name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 商品图片 -->
          <el-form-item label="商品图片">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/goods/upload"
              :show-file-list="false"
            >
              <img
                v-if="goodseditForm.imgUrl"
                :src="serverApi + goodseditForm.imgUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!-- 是否促销 -->
          <el-form-item label="是否促销" >
            <el-radio-group v-model="goodseditForm.isPromotion">
              <el-radio label="促销"></el-radio>
              <el-radio label="不促销"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 食品规格 -->
          <el-form-item label="食品规格" >
            <el-radio-group v-model="goodseditForm.goodsstandard">
              <el-radio label="单规格"></el-radio>
              <el-radio label="多规格"></el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 单规格的包装费 -->
          <el-form-item v-show="flag" label="包装费">
            <el-input-number v-model="goodseditForm.packingexpense" :min="0" :max="20" label="包装费"></el-input-number>
          </el-form-item>
          <!-- 单规格的价格 -->
          <el-form-item v-show="flag" label="价格">
            <el-input-number v-model="goodseditForm.goodsPrice" :min="20" label="价格"></el-input-number>
          </el-form-item>

          <!-- 多规格 的包装费和价格 -->
          <div v-show="!flag" style="text-align: center; margin-bottom: 30px;">
            <el-button size="medium" type="primary" @click="dialogFormVisible = true">添加规格</el-button>

            <el-table :data="goodseditForm.tableData" style="width: 100%">
              <el-table-column prop="goodsstandard" label="规格" width="120"></el-table-column>
              <el-table-column prop="packingexpense" label="包装费" width="120"></el-table-column>
              <el-table-column prop="goodsPrice" label="价格"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="delstandard(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 添加规格模态框 -->
          <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="addStandardForm">
              <!-- 规格 -->
              <el-form-item label="规格" :label-width="formLabelWidth">
                <el-input v-model="addStandardForm.goodsstandard" autocomplete="off"></el-input>
              </el-form-item>

              <!-- 包装费 -->
              <el-form-item :label-width="formLabelWidth" label="包装费">
                <el-input-number
                  v-model="addStandardForm.packingexpense"
                  :min="0"
                  :max="10"
                  label="包装费"
                ></el-input-number>
              </el-form-item>

              <!-- 价格 -->
              <el-form-item :label-width="formLabelWidth" label="价格">
                <el-input-number v-model="addStandardForm.goodsPrice" :min="20" label="价格"></el-input-number>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addStandard">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 商品描述 -->
          <el-form-item label="商品描述"  class="textarea">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="goodseditForm.goodsdesc"
            ></el-input>
          </el-form-item>

          <!-- 添加按钮 -->
          <el-form-item>
            <el-button type="primary" @click="saveEdit">保存修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 保存修改
import { goodsedit,addGoods } from "@/api/goods";
import { log } from "util";

export default {
  data() {
    return {
      serverApi: "http://127.0.0.1:5000/upload/goods/", //商品图片地址
      // 商品详情表单
      goodseditForm: {
        goodsname: "", // 商品名称
        goodscategory: "", // 商品分类
        goodsfeature: [], // 商品特色
        imgUrl: "", // 商品图片地址
        isPromotion: "不促销", // 是否促销
        goodsstandard: "单规格", // 单规格
        packingexpense: "", // 包装费
        goodsPrice: "", // 价格
        goodsdesc: "", // 商品描述
        // 多规格表格
        tableData: [
          {
            goodsstandard: "默认", // 规格
            packingexpense: "0", // 包装费
            goodsPrice: "20" // 价格
          }
        ]
      },
      // 添加规格表单
      addStandardForm: {
        goodsstandard: "", // 规格
        packingexpense: "", // 包装费
        goodsPrice: "" //价格
      },
      // 是否显示模态框
      dialogFormVisible: false,
      formLabelWidth: "120px" // 标签宽度
    };
  },
  methods: {
    // 删除规格
    delstandard(index) {
      this.goodseditForm.tableData.splice(index, 1);
    },
    // 确定添加
    addStandard() {
      this.dialogFormVisible = false;
      this.goodseditForm.tableData.unshift(this.addStandardForm); //把表单对象加到多规格数组
      // 添加之后清空表单
      this.addStandardForm = {
        goodsstandard: "", // 规格
        packingexpense: "", // 包装费
        goodsPrice: "" //价格
      };
    },
    // 保存修改
    async saveEdit() {
      // 获取值
      let {
        id,
        goodsname, // 商品名称
        goodscategory, // 商品分类
        goodsfeature, // 商品特色
        imgUrl, // 商品图片地址
        isPromotion, // 是否促销
        goodsstandard, // 单规格
        packingexpense, // 包装费
        goodsPrice, // 价格
        goodsdesc, // 商品描述
        tableData // 多规格表格
      } = this.goodseditForm;

      console.log(this.goodseditForm.id)
      // 准备参数对象(处理参数)
      let params = {
        id,
        goodsname,
        goodscategory,
        goodsfeature: JSON.stringify(goodsfeature),
        imgUrl,
        isPromotion,
        standard:
          goodsstandard === "单规格"
            ? JSON.stringify([{ goodsstandard, packingexpense, goodsPrice }])
            : JSON.stringify(tableData),
        goodsdesc
      };

      let { code } = await goodsedit(params); //发送修改商品请求
      if (code === 0) {
        this.$router.push("/home/goodslist");
      }
    }
  },
  created() {
    // 获取本地存储
    this.goodseditForm = Object.assign(
      this.goodseditForm,
      JSON.parse(window.localStorage.getItem("goods"))
    );
    // 商品特色
    this.goodseditForm.goodsfeature = JSON.parse(
      this.goodseditForm.goodsfeature
    );

    // 商品规格
    let arr = JSON.parse(this.goodseditForm.standard); //转换为数组

    arr.forEach(v => {
      if (v.goodsstandard === "单规格") {
        this.goodseditForm.goodsPrice = v.goodsPrice;
        this.goodseditForm.packingexpense = v.packingexpense;
        this.goodseditForm.goodsstandard = v.goodsstandard;
      } else if (!(v.goodsstandard === "单规格")) {
        this.goodseditForm.goodsstandard = "多规格";
        this.goodseditForm.tableData = arr;
      }
    });
  },
  computed: {
    flag() {
      return this.goodseditForm.goodsstandard === "单规格" ? true : false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
}
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.textarea {
  width: 400px;
}
.more {
  width: 300px;
  height: 200px;
  border: 1px solid tomato;
}
</style>