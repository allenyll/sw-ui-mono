<template>
  <div class="app-container calendar-list-container">
    <el-card class="search-container" shadow="never">
      <div style="height: 32px; margin-bottom: 5px;">
        <i class="el-icon-search"/>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" size="small" @click="handleFilter()">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" size="small" @click="handleReset()">重置</el-button>
      </div>
      <div>
        <el-form :inline="true" :model="listQuery" size="small">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名：">
                <el-input v-model="listQuery.like_customer_name" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="账户：">
                <el-input v-model="listQuery.like_customer_account" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号：">
                <el-input v-model="listQuery.like_phone" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <div style="margin-top:5px;">
        <FilenameOption v-model="filename" />
        <AutoWidthOption v-model="autoWidth" />
        <BookTypeOption v-model="bookType" />
        <el-button v-if="customerManager_btn_add" class="filter-item" style="margin:0 0 20px 20px; float:right;" type="primary" @click="handleCreate">添加</el-button>
        <el-button :loading="downloadLoading" style="float:right;" type="primary" icon="document" @click="handleDownload">导出</el-button>
      </div>
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column v-if="show" align="center" label="主键ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" min-width="50" height="50" >
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户">
        <template slot-scope="scope">
          <span>{{ scope.row.customerAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | sexFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="customerManager_btn_edit" size="small" type="success" icon="el-icon-edit" @click="handleUpdate(scope.row)">查看
          </el-button>
          <!-- <el-button v-if="customerManager_btn_del" size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
            </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30,40,50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入姓名" disabled/>
        </el-form-item>
        <el-form-item label="账户" prop="customerAccount">
          <el-input v-if="dialogStatus == 'create'" v-model="form.customerAccount" placeholder="请输入账户"/>
          <el-input v-else v-model="form.customerAccount" placeholder="请输入账户" disabled/>
        </el-form-item>
        <el-form-item label="状态" placeholder="请选择状态" prop="status" disabled>
          <el-radio v-model="form.status" disabled label="SW0001">启用</el-radio>
          <el-radio v-model="form.status" disabled label="SW0002">冻结</el-radio>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" class="filter-item" placeholder="请选择" disabled>
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" disabled/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" disabled/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <!-- <el-button v-else type="primary" @click="update('form')">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/customer/customer/index'
import { mapGetters } from 'vuex'

import FilenameOption from '@/components/excel/FilenameOption'
import BookTypeOption from '@/components/excel/BookTypeOption'
import AutoWidthOption from '@/components/excel/AutoWidthOption'

export default {
  name: 'Customer',
  components: { FilenameOption, BookTypeOption, AutoWidthOption },
  filters: {
    sexFilter: function(val) {
      const map = {
        'SW0201': '男',
        'SW0200': '女'
      }
      return map[val]
    },
    statusFilter: function(val) {
      const map = {
        'SW0001': '启用',
        'SW0002': '冻结'
      }
      return map[val]
    }
  },
  data() {
    return {
      form: {
        customerName: undefined,
        customerAccount: undefined,
        nickName: undefined,
        gender: '男',
        phone: undefined,
        email: undefined,
        status: 'SW0001'
      },
      rules: {
        customerName: [
          {
            required: true,
            message: '请输入用户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        customerAccount: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      show: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        like_customer_name: '',
        like_customer_account: '',
        like_phone: ''
      },
      sexOptions: [
        {
          'name': '男',
          'value': 'SW0201'
        },
        {
          'name': '女',
          'value': 'SW0200'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      customerManager_btn_edit: false,
      customerManager_btn_del: false,
      customerManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      configCustomerId: '',
      downloadLoading: false,
      filename: '',
      bookType: 'xlsx',
      autoWidth: true
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  watch: {
  },
  created() {
    this.getList()
    this.customerManager_btn_edit = this.elements['customer:customer:edit']
    this.customerManager_btn_del = this.elements['customer:customer:delete']
    this.customerManager_btn_add = this.elements['customer:customer:add']
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
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
        limit: 20,
        like_customer_name: '',
        like_customer_account: '',
        like_phone: ''
      }
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
              this.getList()
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
      this.$refs[formName].resetFields()
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
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '账户', '手机号', '邮箱', '性别', '国家', '省份', '城市']
        const filterVal = ['customerName', 'customerAccount', 'phone', 'email', 'gender', 'country', 'province', 'city']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          bookType: this.bookType,
          autoWidth: this.autoWidth
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'gender') {
          console.log(v[j])
          if (v[j] === 'SW0200') {
            return '女'
          } else {
            return '男'
          }
        } else {
          return v[j]
        }
      }))
    },
    resetTemp() {
      this.form = {
        customerName: undefined,
        customerAccount: undefined,
        nickName: undefined,
        gender: '男',
        phone: undefined,
        email: undefined,
        status: 'SW0001'
      }
    }
  }
}
</script>
<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>

