<template>
  <div class="app-container calendar-list-container">
    <el-card shadow="never">
      <div style="height: 32px; margin-bottom: 5px;">
        <i class="el-icon-search"/>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" size="small" @click="handleFilter()">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" size="small" @click="handleReset()">重置</el-button>
      </div>
      <div>
        <el-form :inline="true" :model="listQuery" size="small">
          <el-row>
            <el-col :span="8">
              <el-form-item label="售后申请单号：">
                <el-input v-model="listQuery.aftersaleNo" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户账号：">
                <el-input v-model="listQuery.customerName" class="input-width" placeholder="手工录入，精确查询"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="售后状态：">
                <el-select v-model="listQuery.aftersaleStatus" class="input-width" placeholder="全部" clearable>
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="申请时间：">
                <el-date-picker
                  v-model="listQuery.applyTimeStart"
                  style="margin-right:5px;"
                  class="input-width"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择时间"/>至
                <el-date-picker
                  v-model="listQuery.applyTimeEnd"
                  style="margin-left:5px;"
                  class="input-width"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择时间"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请单号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.aftersaleNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户账号">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="售后状态">
        <template slot-scope="scope">
          <span>{{ scope.row.aftersaleStatus | formatAfterStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请退款金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.refundAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请时间">
        <template slot-scope="scope">
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理时间">
        <template slot-scope="scope">
          <span>{{ scope.row.dealTime }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="orderAftersaleManager_btn_check" size="small" @click="handleViewOrderAftersale(scope.$index, scope.row)">查看详情
          </el-button>
          <el-button v-if="orderAftersaleManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="订单ID" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单ID"/>
        </el-form-item>
        <el-form-item label="订单明细ID" prop="orderDetailId">
          <el-input v-model="form.orderDetailId" placeholder="请输入订单明细ID"/>
        </el-form-item>
        <el-form-item label="商品ID" prop="goodsId">
          <el-input v-model="form.goodsId" placeholder="请输入商品ID"/>
        </el-form-item>
        <el-form-item label="用户ID" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item
          label="退货
            换货
            退款退货"
          prop="aftersaleType">
          <el-input
            v-model="form.aftersaleType"
            placeholder="请输入退货
            换货
            退款退货"/>
        </el-form-item>
        <el-form-item
          label="SW0801 未发起售后
            SW0802 申请售后
            SW0803 取消售后
            SW0804 售后处理中
            SW0805 拒绝申请
            SW0806 处理完成"
          prop="aftersaleStatus">
          <el-input
            v-model="form.aftersaleStatus"
            placeholder="请输入SW0801 未发起售后
            SW0802 申请售后
            SW0803 取消售后
            SW0804 售后处理中
            SW0805 拒绝申请
            SW0806 处理完成"/>
        </el-form-item>
        <el-form-item label="申请原因" prop="aftersaleReason">
          <el-input v-model="form.aftersaleReason" placeholder="请输入申请原因"/>
        </el-form-item>
        <el-form-item label="申请佐证，支持多个，逗号分开" prop="applyFile">
          <el-input v-model="form.applyFile" placeholder="请输入申请佐证，支持多个，逗号分开"/>
        </el-form-item>
        <el-form-item label="退还积分" prop="refundPoint">
          <el-input v-model="form.refundPoint" placeholder="请输入退还积分"/>
        </el-form-item>
        <el-form-item label="使用的积分可抵扣金额" prop="usePointAmount">
          <el-input v-model="form.usePointAmount" placeholder="请输入使用的积分可抵扣金额"/>
        </el-form-item>
        <el-form-item label="获得的积分可抵扣金额" prop="getPointAmount">
          <el-input v-model="form.getPointAmount" placeholder="请输入获得的积分可抵扣金额"/>
        </el-form-item>
        <el-form-item label="申请退款金额" prop="refundAmount">
          <el-input v-model="form.refundAmount" placeholder="请输入申请退款金额"/>
        </el-form-item>
        <el-form-item
          label="原来返回
            退还到余额"
          prop="refundType">
          <el-input
            v-model="form.refundType"
            placeholder="请输入原来返回
            退还到余额"/>
        </el-form-item>
        <el-form-item label="退货数量" prop="refundQuality">
          <el-input v-model="form.refundQuality" placeholder="请输入退货数量"/>
        </el-form-item>
        <el-form-item label="退款说明" prop="refundRemark">
          <el-input v-model="form.refundRemark" placeholder="请输入退款说明"/>
        </el-form-item>
        <el-form-item
          label="上门取件
            送到门店
            快递"
          prop="returnType">
          <el-input
            v-model="form.returnType"
            placeholder="请输入上门取件
            送到门店
            快递"/>
        </el-form-item>
        <el-form-item label="拒绝原因" prop="refuseReason">
          <el-input v-model="form.refuseReason" placeholder="请输入拒绝原因"/>
        </el-form-item>
        <el-form-item label="快递名称" prop="deliveryCompany">
          <el-input v-model="form.deliveryCompany" placeholder="请输入快递名称"/>
        </el-form-item>
        <el-form-item label="快递单号" prop="deliveryNo">
          <el-input v-model="form.deliveryNo" placeholder="请输入快递单号"/>
        </el-form-item>
        <el-form-item label="收货人" prop="receiverName">
          <el-input v-model="form.receiverName" placeholder="请输入收货人"/>
        </el-form-item>
        <el-form-item label="收货人电话" prop="receiverPhone">
          <el-input v-model="form.receiverPhone" placeholder="请输入收货人电话"/>
        </el-form-item>
        <el-form-item label="收货人邮编" prop="receiverPostCode">
          <el-input v-model="form.receiverPostCode" placeholder="请输入收货人邮编"/>
        </el-form-item>
        <el-form-item label="收货人省份" prop="receiverProvince">
          <el-input v-model="form.receiverProvince" placeholder="请输入收货人省份"/>
        </el-form-item>
        <el-form-item label="收货人城市" prop="receiverCity">
          <el-input v-model="form.receiverCity" placeholder="请输入收货人城市"/>
        </el-form-item>
        <el-form-item label="收货人区域" prop="receiverRegion">
          <el-input v-model="form.receiverRegion" placeholder="请输入收货人区域"/>
        </el-form-item>
        <el-form-item label="收货人详细地址" prop="receiverDetailAddress">
          <el-input v-model="form.receiverDetailAddress" placeholder="请输入收货人详细地址"/>
        </el-form-item>
        <el-form-item label="退货时间" prop="deliveryTime">
          <el-input v-model="form.deliveryTime" placeholder="请输入退货时间"/>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyTime">
          <el-input v-model="form.applyTime" placeholder="请输入申请时间"/>
        </el-form-item>
        <el-form-item label="处理时间" prop="dealTime">
          <el-input v-model="form.dealTime" placeholder="请输入处理时间"/>
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-input v-model="form.auditTime" placeholder="请输入审核时间"/>
        </el-form-item>
        <el-form-item label="取消时间" prop="cancelTime">
          <el-input v-model="form.cancelTime" placeholder="请输入取消时间"/>
        </el-form-item>
        <el-form-item label="处理人" prop="dealUser">
          <el-input v-model="form.dealUser" placeholder="请输入处理人"/>
        </el-form-item>
        <el-form-item label="处理人姓名" prop="dealUserName">
          <el-input v-model="form.dealUserName" placeholder="请输入处理人姓名"/>
        </el-form-item>
        <el-form-item label="处理备注" prop="dealNote">
          <el-input v-model="form.dealNote" placeholder="请输入处理备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/orderAftersale/index'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderAftersale',
  filters: {
    formatAfterStatus(value) {
      if (value === 'SW0801') {
        return '未发起售后'
      } else if (value === 'SW0802') {
        return '申请售后'
      } else if (value === 'SW0803') {
        return '取消售后'
      } else if (value === 'SW0804') {
        return '售后处理中'
      } else if (value === 'SW0805') {
        return '拒绝售后'
      } else if (value === 'SW0806') {
        return '处理完成'
      }
    }
  },
  data() {
    return {
      form: {
        aftersaleNo: undefined,
        orderId: undefined,
        orderDetailId: undefined,
        goodsId: undefined,
        customerId: undefined,
        aftersaleType: undefined,
        aftersaleStatus: undefined,
        aftersaleReason: undefined,
        applyFile: undefined,
        refundPoint: undefined,
        usePointAmount: undefined,
        getPointAmount: undefined,
        refundAmount: undefined,
        refundType: undefined,
        refundQuality: undefined,
        refundRemark: undefined,
        returnType: undefined,
        refuseReason: undefined,
        deliveryCompany: undefined,
        deliveryNo: undefined,
        receiverName: undefined,
        receiverPhone: undefined,
        receiverPostCode: undefined,
        receiverProvince: undefined,
        receiverCity: undefined,
        receiverRegion: undefined,
        receiverDetailAddress: undefined,
        deliveryTime: undefined,
        applyTime: undefined,
        dealTime: undefined,
        auditTime: undefined,
        cancelTime: undefined,
        dealUser: undefined,
        dealUserName: undefined,
        dealNote: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        aftersaleNo: '',
        customerName: '',
        aftersaleStatus: '',
        applyTimeStart: '',
        applyTimeEnd: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      orderAftersaleManager_btn_edit: false,
      orderAftersaleManager_btn_del: false,
      orderAftersaleManager_btn_add: false,
      orderAftersaleManager_btn_check: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      statusOptions: [
        {
          label: '未申请售后',
          value: 'SW0801'
        },
        {
          label: '申请售后',
          value: 'SW0802'
        },
        {
          label: '取消售后',
          value: 'SW0803'
        },
        {
          label: '售后处理中',
          value: 'SW0804'
        },
        {
          label: '拒绝售后',
          value: 'SW0805'
        },
        {
          label: '处理完成',
          value: 'SW0806'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  created() {
    this.getList()
    this.orderAftersaleManager_btn_edit = this.elements['orderAftersale:orderAftersale:edit']
    this.orderAftersaleManager_btn_del = this.elements['orderAftersale:orderAftersale:delete']
    this.orderAftersaleManager_btn_add = this.elements['orderAftersale:orderAftersale:add']
    this.orderAftersaleManager_btn_check = this.elements['orderAftersale:orderAftersale:check']
  },
  methods: {
    getList() {
      // 判断申请日期选择是否正确
      if (this.listQuery.applyTimeEnd < this.listQuery.applyTimeStart) {
        this.$message({
          type: 'error',
          message: '申请时间开始日期不能大于结束日期',
          duration: 2000
        })
        return
      }
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        aftersaleNo: '',
        customerName: '',
        aftersaleStatus: '',
        applyTimeStart: '',
        applyTimeEnd: ''
      }
    },
    handleViewOrderAftersale(index, row) {
      this.$router.push({ path: '/order/orderAftersaleDetail', query: { id: row.id }})
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getObj(row.id).then(response => {
        this.form = response.data.obj
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
