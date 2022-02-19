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
              <el-form-item label="字典名称：">
                <el-input v-model="listQuery.like_name" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="字典编码：">
                <el-input v-model="listQuery.eq_code" class="input-width" placeholder="手工录入，精确查询"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <el-button v-if="dictManager_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>

    <el-table
      v-loading.body="listLoading"
      :key="tableKey"
      :data="list"
      :default-sort = "{prop: 'code', order: 'ascending'}"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column v-if="show" align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码" sortable prop="code">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="说明">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300"> <template slot-scope="scope">
        <el-button size="small" type="info" icon="el-icon-plus" @click="handleAddChild(scope.row)">添加子项
        </el-button>
        <router-link :to="{ path:'/sys/dict/edit',query: {id:scope.row.id} }">
          <el-button v-if="dictManager_btn_edit" type="success" size="small" icon="el-icon-edit">编辑</el-button>
        </router-link>
        <el-button v-if="dictManager_btn_del" size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30,40,50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="父字典" prop="parentId">
          <el-select v-model="form.parentId" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="SW1301">停用</el-radio>
          <el-radio v-model="form.status" label="SW1302">启用</el-radio>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="form.description" type="textarea"/>
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
import { page, addObj, getObj, delObj, putObj, getParent } from '@/api/admin/dict/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Dict',
  components: {
    'child-dict': () => import('./components/childDict')
  },
  filters: {
    statusFilter: function(val) {
      const map = {
        'SW1301': '停用',
        'SW1302': '启用'
      }
      return map[val]
    }
  },
  data() {
    return {
      form: {
        name: undefined,
        code: undefined,
        status: 'SW1302',
        parentId: undefined,
        description: undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          }
        ]
      },
      options: [
        {
          label: '父字典',
          value: '0'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      show: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        like_name: '',
        eq_code: '',
        eq_parent_id: '0',
        order_code: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dictManager_btn_edit: false,
      dictManager_btn_del: false,
      dictManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
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
    this.getList(data => {
      if (!data) {
        return
      }
      this.getParentDict()
    })
    this.dictManager_btn_edit = this.elements['sys:dict:edit']
    this.dictManager_btn_del = this.elements['sys:dict:delete']
    this.dictManager_btn_add = this.elements['sys:dict:add']
  },
  methods: {
    getList(callback) {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
          callback(true)
        }).catch((reject) => {
          callback(false)
        })
    },
    getParentDict() {
      getParent()
        .then(response => {
          var dataList = response.data.list
          for (var i = 0; i < dataList.length; i++) {
            var dict = {
              label: dataList[i].name,
              value: dataList[i].id
            }
            this.options.push(dict)
          }
        })
    },
    handleFilter() {
      this.getList(data => {})
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        like_name: '',
        eq_code: '',
        eq_parent_id: '0',
        order_code: true
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList(data => {})
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(data => {})
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleAddChild(row) {
      getObj(row.id)
        .then(response => {
          this.dialogFormVisible = true
          this.form.parentId = response.data.obj.id
          this.dialogStatus = 'create'
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
              this.getList(data => {})
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
              this.getList(data => {})
              this.getParentDict()
              this.resetTemp()
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
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList(data => {})
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
        name: undefined,
        code: undefined,
        status: 'SW1302',
        parentId: undefined,
        description: undefined
      }
    }
  }
}
</script>
