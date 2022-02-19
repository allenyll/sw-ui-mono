<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="customerBalanceDetailManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_balance_detail">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="">
        <template slot-scope="scope">
          <span>{{ scope.row.fkCustomerId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="使用金额">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="使用时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="使用状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="充值来源">
        <template slot-scope="scope">
          <span>{{ scope.row.channelId }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="customerBalanceDetailManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="customerBalanceDetailManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="" prop="fkCustomerId">
          <el-input v-model="form.fkCustomerId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="使用金额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入使用金额"/>
        </el-form-item>
        <el-form-item label="使用时间" prop="time">
          <el-input v-model="form.time" placeholder="请输入使用时间"/>
        </el-form-item>
        <el-form-item label="使用状态" prop="status">
          <el-input v-model="form.status" placeholder="请输入使用状态"/>
        </el-form-item>
        <el-form-item label="充值来源" prop="channelId">
          <el-input v-model="form.channelId" placeholder="请输入充值来源"/>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/customer/customerBalanceDetail/index'
import { mapGetters } from 'vuex'
export default {
  name: 'CustomerBalanceDetail',
  data() {
    return {
      form: {
        fkCustomerId: undefined,
        balance: undefined,
        time: undefined,
        status: undefined,
        channelId: undefined
      },
      rules: {
        fkCustomerId: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ], balance: [
          {
            required: true,
            message: '请输入使用金额',
            trigger: 'blur'
          }
        ], time: [
          {
            required: true,
            message: '请输入使用时间',
            trigger: 'blur'
          }
        ], status: [
          {
            required: true,
            message: '请输入使用状态',
            trigger: 'blur'
          }
        ], channelId: [
          {
            required: true,
            message: '请输入充值来源',
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
      customerBalanceDetailManager_btn_edit: false,
      customerBalanceDetailManager_btn_del: false,
      customerBalanceDetailManager_btn_add: false,
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
    this.customerBalanceDetailManager_btn_edit = this.elements['customer:customerBalanceDetail:edit']
    this.customerBalanceDetailManager_btn_del = this.elements['customer:customerBalanceDetail:delete']
    this.customerBalanceDetailManager_btn_add = this.elements['customer:customerBalanceDetail:add']
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
        fkCustomerId: undefined,
        balance: undefined,
        time: undefined,
        status: undefined,
        channelId: undefined
      }
    }
  }
}
</script>
