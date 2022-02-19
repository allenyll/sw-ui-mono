<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>发货列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="deliverOrderTable"
        :data="list"
        style="width: 100%;"
        border>
        <el-table-column label="订单编号" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
        </el-table-column>
        <el-table-column label="收货人" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.receiverName }}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.receiverPhone }}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.receiverPostCode }}</template>
        </el-table-column>
        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="配送方式" width="160" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.deliveryCompany"
              placeholder="请选择物流公司"
              size="small">
              <el-option
                v-for="item in companyOptions"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" width="180" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deliveryNo" size="small"/>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { deliveryOrder } from '@/api/order/order/index'
const defaultLogisticsCompanies = ['顺丰快递', '圆通快递', '中通快递', '韵达快递']
export default {
  name: 'DeliverOrderList',
  data() {
    return {
      list: [],
      companyOptions: defaultLogisticsCompanies
    }
  },
  created() {
    this.list = this.$route.query.list
  },
  methods: {
    cancel() {
      this.$router.back()
    },
    confirm() {
      console.log(this.list)
      const params = {
        orderId: this.list[0].orderId,
        deliveryCompany: this.list[0].deliveryCompany,
        deliveryNo: this.list[0].deliveryNo
      }
      this.$confirm('是否要进行发货操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deliveryOrder(params).then(response => {
          this.$router.back()
          this.$message({
            type: 'success',
            message: '发货成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发货'
        })
      })
    }
  }
}
</script>
<style></style>

