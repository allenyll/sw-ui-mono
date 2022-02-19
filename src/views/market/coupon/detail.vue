<template>
  <div class="app-container">
    <div class="table-layout">
      <el-row>
        <el-col :span="4" class="table-cell-title">名称</el-col>
        <el-col :span="4" class="table-cell-title">优惠券类型</el-col>
        <el-col :span="4" class="table-cell-title">可使用商品</el-col>
        <el-col :span="4" class="table-cell-title">使用门槛</el-col>
        <el-col :span="4" class="table-cell-title">面值</el-col>
        <el-col :span="4" class="table-cell-title">状态</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">{{ coupon.name }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.type | typeFilter }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.useType | useTypeFilter }}</el-col>
        <el-col :span="4" class="table-cell">满{{ coupon.minPoint }}元可用</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.amount }}元</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.endTime | formatStatus }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell-title">有效期</el-col>
        <el-col :span="4" class="table-cell-title">总发行量</el-col>
        <el-col :span="4" class="table-cell-title">已领取</el-col>
        <el-col :span="4" class="table-cell-title">待领取</el-col>
        <el-col :span="4" class="table-cell-title">已使用</el-col>
        <el-col :span="4" class="table-cell-title">未使用</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell" style="font-size: 11px">
          {{ coupon.startTime|formatDate }}至{{ coupon.endTime|formatDate }}
        </el-col>
        <el-col :span="4" class="table-cell">{{ coupon.publishCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.receiveCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.publishCount-coupon.receiveCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.useCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.publishCount-coupon.useCount }}</el-col>
      </el-row>
    </div>
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
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="使用状态：">
            <el-select v-model="listQuery.eq_use_status" placeholder="全部" clearable class="input-width">
              <el-option key="SW2401" label="未使用" value="SW2401"/>
              <el-option key="SW2402" label="已使用" value="SW2402"/>
              <el-option key="SW2403" label="已过期" value="SW2403"/>
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号：">
            <el-input v-model="listQuery.eq_order_no" class="input-width" placeholder="订单编号"/>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        ref="couponHistoryTable"
        :data="list"
        style="width: 100%;"
        border>
        <el-table-column label="优惠码" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.couponCode }}</template>
        </el-table-column>
        <el-table-column label="领取会员" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.nickName }}</template>
        </el-table-column>
        <el-table-column label="领取方式" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.getType | formatGetType }}</template>
        </el-table-column>
        <el-table-column label="领取时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.addTime }}</template>
        </el-table-column>
        <el-table-column label="当前状态" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.useStatus | formatCouponDetailUseType }}</template>
        </el-table-column>
        <el-table-column label="使用时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.useTime }}</template>
        </el-table-column>
        <el-table-column label="订单编号" align="center">
          <template slot-scope="scope">{{ scope.row.orderNo === null?'未使用':scope.row.orderNo }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total"
        background
        layout="total, sizes,prev, pager, next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date'
import { getObj } from '@/api/market/coupon/index'
import { page } from '@/api/market/couponDetail/index'

const defaultListQuery = {
  page: 1,
  limit: 10,
  eq_use_status: null,
  eq_order_no: null,
  eq_coupon_id: null
}
export default {
  name: 'CouponDetail',
  filters: {
    typeFilter: function(val) {
      const map = {
        'SW2201': '全场赠送',
        'SW2202': '会员赠送',
        'SW2203': '购物赠送',
        'SW2204': '注册赠送',
        'SW2205': '兑换赠送'
      }
      return map[val]
    },
    useTypeFilter: function(val) {
      const map = {
        'SW2301': '全场通用',
        'SW2302': '指定分类',
        'SW2303': '指定商品'
      }
      return map[val]
    },
    formatDate(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatStatus(endTime) {
      const now = formatDate(new Date(), 'yyyy-MM-dd')
      if (endTime > now) {
        return '未过期'
      } else {
        return '已过期'
      }
    },
    formatGetType(type) {
      if (type === 'SW2501') {
        return '主动获取'
      } else {
        return '后台赠送'
      }
    },
    formatCouponDetailUseType(useType) {
      if (useType === 'SW2401') {
        return '未使用'
      } else if (useType === 'SW2402') {
        return '已使用'
      } else {
        return '已过期'
      }
    },
    formatTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      coupon: {},
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      list: null
    }
  },
  created() {
    console.log(this.$route.query.id)
    getObj(this.$route.query.id).then(response => {
      this.coupon = response.data.obj
    })
    this.listQuery.eq_coupon_id = this.$route.query.id
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        console.log(response)
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.listQuery.couponId = this.$route.query.id
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>
<style scoped>
  .app-container {
    width: 80%;
    margin: 20px auto;
  }

  .filter-container {
    margin-top: 20px;
  }

  .pagination-container{
    float: right;
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>

