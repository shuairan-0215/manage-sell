<template>
  <div class="accountlist">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 表格 -->
        <el-table
          ref="accountTable"
          tooltip-effect="dark"
          style="width: 100%"
          :data="tableDate"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="100"></el-table-column>
          <el-table-column prop="account" label="账号" width="260"></el-table-column>
          <el-table-column prop="userGroup" label="用户组" width="260"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">{{ scope.row.ctime }}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="editMsg( scope.row )">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDel( scope.row )">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 模态框 -->
        <el-dialog title="编辑信息" :visible.sync="dialogFormVisible" width="500px">
          <el-form :model="editForm" style="width: 330px;">
            <!-- 账号 -->
            <el-form-item label="账号" label-width="120px">
              <el-input v-model="editForm.account" autocomplete="off"></el-input>
            </el-form-item>

            <!-- 用户组 -->
            <el-form-item label="用户组" label-width="120px">
              <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通管理员" value="普通管理员"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 确定修改 & 取消修改 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureModify">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          class="pages"
          :page-sizes="[3, 5, 7, 9]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>

        <!-- 批量删除和取消选择按钮 -->
        <div style="margin-top: 20px">
          <el-button type="primary" @click="delAll()">批量删除</el-button>
          <el-button @click="toggleSelection()" type="danger">取消选择</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入时间处理模块
import moment from "moment";

// 引入请求参数
import {
  getAccountlist, //获取表单列表
  delAccount, //删除
  delAccountAll, //批量删除
  editAccount //修改数据
} from "@/api/account";

export default {
  data() {
    return {
      tableDate: [], // 表格数据
      total: 0, //数据总条数
      currentPage: 1, //当前页数
      pageSize: 3, //每页条数
      ids: [], //被选中的id们
      editForm: {
        //编辑表单
        account: "",
        userGroup: ""
      },
      dialogFormVisible: false //控制编辑模态框的显示隐藏
    };
  },
  methods: {
    // 取消选择
    toggleSelection() {
      this.$refs.accountTable.clearSelection();
    },
    // 请求账号列表
    async getAccount() {
      // 后台响应的参数
      let { total, data } = await getAccountlist({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      // 判断分页删除的bug
      if (!data.length && this.currentPage != 1) {
        this.currentPage--; //加载的当前页码减1
        this.getAccount(); //再次请求列表
      }

      // 循环后端返回的数据  对时间进行格式化处理
      data.forEach(
        v => (v.ctime = moment(v.ctime).format("YYYY-MM-DD hh:mm:ss"))
      );

      // 赋值
      this.total = total;
      this.tableDate = data;
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccount();
    },
    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccount();
    },
    // 删除
    handleDel(row) {
      this.$confirm("你确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        // 确定
        .then(async () => {
          let { code } = await delAccount({ id: row.id }); //发送删除请求的id
          // 成功
          if (code === 0) {
            // 刷新列表（重新请求列表啊数据）
            this.getAccount();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 当选中的状态改变时
    handleSelectionChange(rows) {
      this.ids = rows.map(row => row.id);
    },
    // 批量删除
    delAll() {
      //没有选中任何数据时  不需要发送请求
      if (!this.ids.length) {
        this.$message.error("请选择数据之后再操作");
        return;
      }

      this.$confirm("你确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        // 确定
        .then(async () => {
          //发送请求 把选择的id数组发送给后端
          let { code } = await delAccountAll({
            ids: JSON.stringify(this.ids)
          }); //发送删除请求的id
          // 成功
          if (code === 0) {
            // 刷新列表（重新请求列表啊数据）
            this.getAccount();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除  "
          });
        });
    },
    // 编辑（修改账号）
    editMsg(row) {
      this.editForm = { ...row };
      // 显示模态框
      this.dialogFormVisible = true;
    },
    // 确定修改
    async sureModify() {
      // 隐藏模态框
      this.dialogFormVisible = false;

      // 解构出参数
      let { id, account, userGroup } = this.editForm;
      let { code } = await editAccount({ id, account, userGroup });

      // 成功
      if (code === 0) {
        // 刷新列表
        this.getAccount();
      }
    }
  },
  // 创建后的钩子函数
  created() {
    this.getAccount();
  }
};
</script>

<style lang="less" scoped>
.accountlist {
  .pages {
    margin: 30px 0;
  }
}
</style>