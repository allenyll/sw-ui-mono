<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="transactionManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_transaction_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkTransactionId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="交易单号">
        <template slot-scope="scope">
          <span>{{ scope.row.transactionNo }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="交易人">
        <template slot-scope="scope">
          <span>{{ scope.row.fkCustomerId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="交易金额">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="使用的积分">
        <template slot-scope="scope">
          <span>{{ scope.row.integral }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="支付渠道">
        <template slot-scope="scope">
          <span>{{ scope.row.payChannel }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="支付来源">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="交易状态 SW1201 未完成  SW1202 已完成 SW1203 取消 SW1204 异常">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="支付时间">
        <template slot-scope="scope">
          <span>{{ scope.row.transactionTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="transactionManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="transactionManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="交易单号" prop="transactionNo">
          <el-input v-model="form.transactionNo" placeholder="请输入交易单号"/>
        </el-form-item>
        <el-form-item label="交易人" prop="fkCustomerId">
          <el-input v-model="form.fkCustomerId" placeholder="请输入交易人"/>
        </el-form-item>
        <el-form-item label="交易金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入交易金额"/>
        </el-form-item>
        <el-form-item label="使用的积分" prop="integral">
          <el-input v-model="form.integral" placeholder="请输入使用的积分"/>
        </el-form-item>
        <el-form-item label="支付渠道" prop="payChannel">
          <el-input v-model="form.payChannel" placeholder="请输入支付渠道"/>
        </el-form-item>
        <el-form-item label="支付来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入支付来源"/>
        </el-form-item>
        <el-form-item label="交易状态 SW1201 未完成  SW1202 已完成 SW1203 取消 SW1204 异常" prop="status">
          <el-input v-model="form.status" placeholder="请输入交易状态 SW1201 未完成  SW1202 已完成 SW1203 取消 SW1204 异常"/>
        </el-form-item>
        <el-form-item label="支付时间" prop="transactionTime">
          <el-input v-model="form.transactionTime" placeholder="请输入支付时间"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/pay/transaction/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Transaction',
  data() {
    return {
      form: {
        transactionNo: undefined,
        fkCustomerId: undefined,
        amount: undefined,
        integral: undefined,
        payChannel: undefined,
        source: undefined,
        status: undefined,
        transactionTime: undefined,
        remark: undefined
      },
      rules: {
        transactionNo: [
          {
            required: true,
            message: '请输入交易单号',
            trigger: 'blur'
          }
        ], fkCustomerId: [
          {
            required: true,
            message: '请输入交易人',
            trigger: 'blur'
          }
        ], amount: [
          {
            required: true,
            message: '请输入交易金额',
            trigger: 'blur'
          }
        ], integral: [
          {
            required: true,
            message: '请输入使用的积分',
            trigger: 'blur'
          }
        ], payChannel: [
          {
            required: true,
            message: '请输入支付渠道',
            trigger: 'blur'
          }
        ], source: [
          {
            required: true,
            message: '请输入支付来源',
            trigger: 'blur'
          }
        ], status: [
          {
            required: true,
            message: '请输入交易状态 SW1201 未完成  SW1202 已完成 SW1203 取消 SW1204 异常',
            trigger: 'blur'
          }
        ], transactionTime: [
          {
            required: true,
            message: '请输入支付时间',
            trigger: 'blur'
          }
        ], remark: [
          {
            required: true,
            message: '请输入备注',
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
      transactionManager_btn_edit: false,
      transactionManager_btn_del: false,
      transactionManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  created() {
    this.getList()
    this.transactionManager_btn_edit = this.elements['pay:transaction:edit']
    this.transactionManager_btn_del = this.elements['pay:transaction:delete']
    this.transactionManager_btn_add = this.elements['pay:transaction:add']
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
      getObj(row.pkTransactionId).then(response => {
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
        delObj(row.pkTransactionId)
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
          putObj(this.form.pkTransactionId, this.form).then(() => {
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
        transactionNo: undefined,
        fkCustomerId: undefined,
        amount: undefined,
        integral: undefined,
        payChannel: undefined,
        source: undefined,
        status: undefined,
        transactionTime: undefined,
        remark: undefined
      }
    }
  }
}
</script>
