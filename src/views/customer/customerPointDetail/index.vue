<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select v-model="listQuery.eq_type" placeholder="请选择积分类型" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.name" :value="item.value"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <!-- <el-button class="filter-item" v-if="customerPointDetailManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button> -->
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" :row-class-name="tableRowClassName" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_point_detail_id" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" align="center" label="用户id" >
        <template slot-scope="scope">
          <span>{{ scope.row.customerId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分">
        <template slot-scope="scope">
          <span>{{ scope.row.point }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="过期时间">
        <template slot-scope="scope">
          <span>{{ scope.row.expiredTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="获得时间">
        <template slot-scope="scope">
          <span>{{ scope.row.getTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
        <el-button v-if="customerPointDetailManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="customerPointDetailManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column> -->
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from '@/api/customer/customerPointDetail/index'
import { mapGetters } from 'vuex'
export default {
  name: 'CustomerPointDetail',
  filters: {
    typeFilter: function(val) {
      const map = {
        'SW0501': '收入',
        'SW0502': '支出'
      }
      return map[val]
    }
  },
  data() {
    return {
      form: {
        customerId: undefined,
        point: undefined,
        type: undefined,
        expiredTime: undefined,
        getTime: undefined,
        remark: undefined,
        isDeleted: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        eq_status: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      customerPointDetailManager_btn_edit: false,
      customerPointDetailManager_btn_del: false,
      customerPointDetailManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      customerId: '',
      typeOptions: [
        {
          'value': 'SW0501',
          'name': '收入'
        },
        {
          'value': 'SW0502',
          'name': '支出'
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
    this.customerId = this.$route.query.id
    this.getList(this.customerId)
    this.customerPointDetailManager_btn_edit = this.elements['customer:customerPointDetail:edit']
    this.customerPointDetailManager_btn_del = this.elements['customer:customerPointDetail:delete']
    this.customerPointDetailManager_btn_add = this.elements['customer:customerPointDetail:add']
  },
  methods: {
    getList(id) {
      this.listLoading = true
      this.listQuery.eq_fk_customer_id = id
      page(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.type === 'SW0501') {
        return 'warning-row'
      } else if (row.type === 'SW0502') {
        return 'success-row'
      }
      return ''
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
      getObj(row.id)
        .then(response => {
          this.form = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
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
          addObj(this.form)
            .then(() => {
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
        customerId: undefined,
        point: undefined,
        type: undefined,
        expiredTime: undefined,
        getTime: undefined,
        remark: undefined,
        isDeleted: undefined
      }
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

