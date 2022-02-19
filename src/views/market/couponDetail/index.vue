<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="couponDetailManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_detail_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkDetailId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="优惠券ID">
        <template slot-scope="scope">
          <span>{{ scope.row.fkCouponId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="会员ID">
        <template slot-scope="scope">
          <span>{{ scope.row.fkCustomerId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="优惠券编码">
        <template slot-scope="scope">
          <span>{{ scope.row.couponCode }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="会员名称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="获取方式">
        <template slot-scope="scope">
          <span>{{ scope.row.getType }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="使用状态">
        <template slot-scope="scope">
          <span>{{ scope.row.useStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="使用时间">
        <template slot-scope="scope">
          <span>{{ scope.row.useTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单主键">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单编码">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="couponDetailManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="couponDetailManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="优惠券ID" prop="fkCouponId">
          <el-input v-model="form.fkCouponId" placeholder="请输入优惠券ID"/>
        </el-form-item>
        <el-form-item label="会员ID" prop="fkCustomerId">
          <el-input v-model="form.fkCustomerId" placeholder="请输入会员ID"/>
        </el-form-item>
        <el-form-item label="优惠券编码" prop="couponCode">
          <el-input v-model="form.couponCode" placeholder="请输入优惠券编码"/>
        </el-form-item>
        <el-form-item label="会员名称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入会员名称"/>
        </el-form-item>
        <el-form-item label="获取方式" prop="getType">
          <el-input v-model="form.getType" placeholder="请输入获取方式"/>
        </el-form-item>
        <el-form-item label="使用状态" prop="useStatus">
          <el-input v-model="form.useStatus" placeholder="请输入使用状态"/>
        </el-form-item>
        <el-form-item label="使用时间" prop="useTime">
          <el-input v-model="form.useTime" placeholder="请输入使用时间"/>
        </el-form-item>
        <el-form-item label="订单主键" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单主键"/>
        </el-form-item>
        <el-form-item label="订单编码" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单编码"/>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/market/couponDetail/index'
import { mapGetters } from 'vuex'
export default {
  name: 'CouponDetail',
  data() {
    return {
      form: {
        fkCouponId: undefined,
        fkCustomerId: undefined,
        couponCode: undefined,
        nickName: undefined,
        getType: undefined,
        useStatus: undefined,
        useTime: undefined,
        orderId: undefined,
        orderNo: undefined
      },
      rules: {
        fkCouponId: [
          {
            required: true,
            message: '请输入优惠券ID',
            trigger: 'blur'
          }
        ], fkCustomerId: [
          {
            required: true,
            message: '请输入会员ID',
            trigger: 'blur'
          }
        ], couponCode: [
          {
            required: true,
            message: '请输入优惠券编码',
            trigger: 'blur'
          }
        ], nickName: [
          {
            required: true,
            message: '请输入会员名称',
            trigger: 'blur'
          }
        ], getType: [
          {
            required: true,
            message: '请输入获取方式',
            trigger: 'blur'
          }
        ], useStatus: [
          {
            required: true,
            message: '请输入使用状态',
            trigger: 'blur'
          }
        ], useTime: [
          {
            required: true,
            message: '请输入使用时间',
            trigger: 'blur'
          }
        ], orderId: [
          {
            required: true,
            message: '请输入订单主键',
            trigger: 'blur'
          }
        ], orderNo: [
          {
            required: true,
            message: '请输入订单编码',
            trigger: 'blur'
          }
        ] },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      couponDetailManager_btn_edit: false,
      couponDetailManager_btn_del: false,
      couponDetailManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false
    }
  },
  created() {
    this.getList()
    this.couponDetailManager_btn_edit = this.elements['market:couponDetail:edit']
    this.couponDetailManager_btn_del = this.elements['market:couponDetail:delete']
    this.couponDetailManager_btn_add = this.elements['market:couponDetail:add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
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
      getObj(row.pkDetailId).then(response => {
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
        delObj(row.pkDetailId)
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
          putObj(this.form.pkDetailId, this.form).then(() => {
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
    resetTemp() {
      this.form = {
        fkCouponId: undefined,
        fkCustomerId: undefined,
        couponCode: undefined,
        nickName: undefined,
        getType: undefined,
        useStatus: undefined,
        useTime: undefined,
        orderId: undefined,
        orderNo: undefined
      }
    }
  }
}
</script>
