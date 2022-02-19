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
              <el-form-item label="反馈类型：">
                <el-select v-model="listQuery.eq_type" clearable class="input-width" placeholder="全部" clearable>
                  <el-option
                    v-for="item in feedbackTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <!-- <el-button v-if="feedbackManager_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button> -->
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="意见类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="意见内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="feedbackManager_btn_check" size="small" type="success" @click="handleUpdate(scope.row)">查看
          </el-button>
          <!-- <el-button v-if="feedbackManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="意见类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入意见类型" disabled/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系方式" disabled/>
        </el-form-item>
        <el-form-item label="意见内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入意见内容" disabled/>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/shop/feedback/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Feedback',
  data() {
    return {
      form: {
        type: undefined,
        content: undefined,
        phone: undefined
      },
      rules: {
        type: [
          {
            required: true,
            message: '请输入意见类型',
            trigger: 'blur'
          }
        ], content: [
          {
            required: true,
            message: '请输入意见内容',
            trigger: 'blur'
          }
        ], phone: [
          {
            required: true,
            message: '请输入联系方式',
            trigger: 'blur'
          }
        ] },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        eq_type: ''
      },
      feedbackTypeOptions: [
        {
          label: '商品相关',
          value: '商品相关'
        },
        {
          label: '物流状况',
          value: '物流状况'
        },
        {
          label: '客户服务',
          value: '客户服务'
        },
        {
          label: '优惠活动',
          value: '优惠活动'
        },
        {
          label: '功能异常',
          value: '功能异常'
        },
        {
          label: '产品建议',
          value: '产品建议'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      feedbackManager_btn_edit: false,
      feedbackManager_btn_del: false,
      feedbackManager_btn_add: false,
      feedbackManager_btn_check: false,
      textMap: {
        update: '查看',
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
    this.feedbackManager_btn_edit = this.elements['shop:feedback:edit']
    this.feedbackManager_btn_del = this.elements['shop:feedback:delete']
    this.feedbackManager_btn_add = this.elements['shop:feedback:add']
    this.feedbackManager_btn_check = this.elements['shop:feedback:check']
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
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        eq_type: ''
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
    },
    resetTemp() {
      this.form = {
        type: undefined,
        content: undefined,
        phone: undefined
      }
    }
  }
}
</script>
