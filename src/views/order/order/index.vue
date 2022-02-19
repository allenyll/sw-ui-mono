<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"/>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          size="small"
          @click="handleSearchList()">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          size="small"
          @click="handleResetSearch()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 30px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.orderNo" class="input-width" placeholder="订单编号"/>
          </el-form-item>
          <el-form-item label="收货人：">
            <el-input v-model="listQuery.receiverKeyword" class="input-width" placeholder="收货人姓名/手机号码"/>
          </el-form-item>
          <el-form-item label="下单时间：">
            <el-date-picker
              v-model="listQuery.orderTime"
              class="input-width"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"/>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.orderStatus" class="input-width" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="订单分类：">
            <el-select v-model="listQuery.orderType" class="input-width" placeholder="全部" clearable>
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        ref="orderTable"
        :data="list"
        style="width: 100%;"
        border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center"/>
        <el-table-column v-if="show" label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
        </el-table-column>
        <el-table-column label="下单时间" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.orderTime }}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{ scope.row.customerName }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template slot-scope="scope">￥{{ scope.row.totalAmount }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.payChannel | formatPayType }}</template>
        </el-table-column>
        <el-table-column label="订单类型" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.orderType | formatOrderType }}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.orderStatus | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="orderManager_btn_search"
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看订单</el-button>
            <el-button
              v-if="orderManager_btn_close"
              v-show="scope.row.orderStatus === 'SW0701'"
              size="mini"
              @click="handleCloseOrder(scope.$index, scope.row)">关闭订单</el-button>
            <el-button
              v-if="orderManager_btn_send"
              v-show="scope.row.orderStatus === 'SW0702'"
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)">订单发货</el-button>
            <el-button
              v-if="orderManager_btn_delivery"
              v-show="scope.row.orderStatus === 'SW0703' || scope.row.orderStatus === 'SW0704'"
              size="mini"
              @click="handleViewLogistics(scope.$index, scope.row)">订单跟踪</el-button>
            <el-button
              v-if="orderManager_btn_del"
              v-show="scope.row.orderStatus === 'SW0706' || scope.row.orderStatus === 'SW0707'"
              size="mini"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container" style="margin-top: 10px;float: left;">
      <el-select
        v-model="operateType"
        size="small"
        placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        type="primary"
        size="small"
        @click="handleBatchOperate()">
        确定
      </el-button>
    </div>
    <div class="pagination-container" style="margin-top:10px; float: right;">
      <el-pagination
        :current-page.sync="listQuery.page"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :total="total"
        background
        layout="total, sizes,prev, pager, next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog
      :visible.sync="closeOrder.dialogVisible"
      title="关闭订单"
      width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        :rows="5"
        v-model="closeOrder.content"
        style="width: 80%"
        type="textarea"
        placeholder="请输入内容"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"/>
  </div>
</template>
<script>
import { page, closeOrder, deleteOrder } from '@/api/order/order/index'
import LogisticsDialog from '@/views/order/order/components/logisticsDialog'
const defaultListQuery = {
  page: 1,
  limit: 10,
  orderNo: null,
  receiverKeyword: null,
  orderStatus: null,
  orderType: null,
  orderTime: null
}
import { mapGetters } from 'vuex'
export default {
  name: 'OrderList',
  components: { LogisticsDialog },
  filters: {
    formatPayType(value) {
      if (value === 'SW0901') {
        return '余额'
      } else if (value === 'SW0902') {
        return '微信'
      } else if (value === 'SW0903') {
        return '支付宝'
      } else if (value === 'SW0904') {
        return '银联'
      } else {
        return '未支付'
      }
    },
    formatOrderType(value) {
      if (value === 'SW0601') {
        return '线上订单'
      } else if (value === 'SW0602') {
        return '线下订单'
      }
    },
    formatStatus(value) {
      if (value === 'SW0702') {
        return '待发货'
      } else if (value === 'SW0703') {
        return '已发货'
      } else if (value === 'SW0704') {
        return '待评价'
      } else if (value === 'SW0706') {
        return '已完成'
      } else if (value === 'SW0707') {
        return '已取消'
      } else if (value === 'SW0708') {
        return '已关闭'
      } else if (value === 'SW0709') {
        return '无效订单'
      } else {
        return '待付款'
      }
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      show: false,
      statusOptions: [
        {
          label: '待付款',
          value: 'SW0701'
        },
        {
          label: '待发货',
          value: 'SW0702'
        },
        {
          label: '已发货',
          value: 'SW0703'
        },
        {
          label: '待评价',
          value: 'SW0704'
        },
        {
          label: '已完成',
          value: 'SW0706'
        },
        {
          label: '已取消',
          value: 'SW0707'
        },
        {
          label: '已关闭',
          value: 'SW0708'
        },
        {
          label: '已失效',
          value: 'SW0709'
        }
      ],
      orderTypeOptions: [
        {
          label: '线上订单',
          value: 'SW0601'
        },
        {
          label: '线下订单',
          value: 'SW0602'
        }
      ],
      operateOptions: [
        {
          label: '批量发货',
          value: 1
        },
        {
          label: '关闭订单',
          value: 2
        },
        {
          label: '删除订单',
          value: 3
        }
      ],
      logisticsDialogVisible: false,
      orderManager_btn_search: false,
      orderManager_btn_del: false,
      orderManager_btn_delivery: false,
      orderManager_btn_send: false,
      orderManager_btn_close: false

    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  created() {
    this.getList()
    this.orderManager_btn_search = this.elements['order:order:search']
    this.orderManager_btn_del = this.elements['order:order:delete']
    this.orderManager_btn_delivery = this.elements['order:order:delivery']
    this.orderManager_btn_send = this.elements['order:order:send']
    this.orderManager_btn_close = this.elements['order:order:close']
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleSearchList() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleViewOrder(index, row) {
      this.$router.push({ path: '/order/orderDetail', query: { id: row.id }})
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true
      this.closeOrder.orderIds = [row.id]
    },
    handleDeliveryOrder(index, row) {
      console.log(row)
      const listItem = this.covertOrder(row)
      this.$router.push({ path: '/order/deliverOrderList', query: { list: [listItem] }})
    },
    handleViewLogistics(index, row) {
      this.logisticsDialogVisible = true
    },
    handleDeleteOrder(index, row) {
      const ids = []
      ids.push(row.id)
      this.deleteOrder(ids)
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择要操作的订单',
          type: 'warning',
          duration: 1000
        })
        return
      }
      if (this.operateType === 1) {
        // 批量发货
        const list = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].orderStatus === 1) {
            list.push(this.covertOrder(this.multipleSelection[i]))
          }
        }
        if (list.length === 0) {
          this.$message({
            message: '选中订单中没有可以发货的订单',
            type: 'warning',
            duration: 1000
          })
          return
        }
        this.$router.push({ path: '/order/deliverOrderList', query: { list: list }})
      } else if (this.operateType === 2) {
        // 关闭订单
        this.closeOrder.orderIds = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.closeOrder.orderIds.push(this.multipleSelection[i].id)
        }
        this.closeOrder.dialogVisible = true
      } else if (this.operateType === 3) {
        // 删除订单
        const ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        this.deleteOrder(ids)
      }
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCloseOrderConfirm() {
      if (this.closeOrder.content == null || this.closeOrder.content === '') {
        this.$message({
          message: '操作备注不能为空',
          type: 'warning',
          duration: 1000
        })
        return
      }
      const params = new URLSearchParams()
      params.append('ids', this.closeOrder.orderIds)
      params.append('note', this.closeOrder.content)
      closeOrder(params).then(response => {
        this.closeOrder.orderIds = []
        this.closeOrder.dialogVisible = false
        this.getList()
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    deleteOrder(ids) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('ids', ids)
        deleteOrder(params).then(response => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    },
    covertOrder(order) {
      const address = order.province + order.city + order.region + order.detailAddress
      const listItem = {
        orderId: order.id,
        orderNo: order.orderNo,
        receiverName: order.name,
        receiverPhone: order.phone,
        receiverPostCode: order.postCode,
        address: address,
        deliveryCompany: null,
        deliveryNo: null
      }
      return listItem
    }
  }
}
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>

