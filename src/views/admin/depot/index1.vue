<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="depotManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="ID" width="0">
        <template scope="scope">
          <span>{{ scope.row.pkDepotId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="名称">
        <template scope="scope">
          <span>{{ scope.row.depotName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="编码">
        <template scope="scope">
          <span>{{ scope.row.depotCode }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="上级部门">
        <template scope="scope">
          <span>{{ scope.row.parentDepotName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="最后时间">
        <template scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="234"> <template scope="scope">
        <el-button v-if="depotManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="depotManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="depotName">
          <el-input v-model="form.depotName" placeholder="请输入部门名称"/>
        </el-form-item>
        <el-form-item label="编码" prop="depotCode">
          <el-input v-model="form.depotCode" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="上级部门" placeholder="请选择部门" prop="parentDepotName">
          <el-input v-model="form.parentDepotName" style="width:80%; float:left;"/>
          <el-button style="margin-left:10px;" type="primary" icon="el-icon-menu" @click="dialogDepotVisible = true">组织树</el-button>
        </el-form-item>
        <el-form-item v-if="showDeoptId" label="部门" placeholder="请选择部门" prop="parentDepotId">
          <el-input v-model="form.parentDepotId"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入序号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDepotVisible" title="组织" width="20%">
      <el-row style="margin:0 auto;">
        <el-col :span="15" style="margin-left:30px;">
          <el-input v-model="filterDepotText" placeholder="输入关键字过滤" style="margin-bottom:15px;"/>
          <el-tree ref="depotTree" :data="depotTreeData" :props="defaultProps" :filter-node-method="filterNode" class="filter-tree" node-key="id" highlight-current show-checkbox default-expand-all check-strictly/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleDepot">取 消</el-button>
        <el-button type="primary" @click="configDepot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/admin/depot/index'
import { getDepotTree } from '@/api/admin/depot/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Depot',
  data() {
    return {
      form: {
        depotName: undefined,
        depotCode: undefined,
        parentDepotName: undefined,
        parentDepotId: undefined,
        sort: undefined
      },
      rules: {
        depotName: [
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
        account: [
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
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterDepotText: '',
      depotTreeData: [],
      dialogDepotVisible: false,
      show: false,
      showDeoptId: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      depotManager_btn_edit: false,
      depotManager_btn_del: false,
      depotManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  watch: {
    filterDepotText(val) {
      this.$refs.depotTree.filter(val)
    }
  },
  created() {
    this.getList()
    this.getDepotTreeList()
    this.depotManager_btn_edit = this.elements['sys:depot:edit']
    this.depotManager_btn_del = this.elements['sys:depot:delete']
    this.depotManager_btn_add = this.elements['sys:depot:add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
          this.list = response.data.depotList
          this.total = response.data.total
          this.listLoading = false
        })
    },
    getDepotTreeList() {
      getDepotTree().then(data => {
        this.depotTreeData = data.data.depotTree
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    cancleDepot() {
      this.filterDepotText = ''
      this.dialogDepotVisible = false
    },
    configDepot() {
      const keyArr = this.$refs.depotTree.getCheckedKeys()
      if (keyArr.length < 1) {
        this.$notify({
          title: '错误',
          message: '请选择一条数据',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (keyArr.length > 1) {
        this.$notify({
          title: '错误',
          message: '只能选择一个父节点',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.form.fkDepotId = keyArr[0]
      getObj(keyArr[0]).then(response => {
        console.log(response)
        this.form.depotName = response.data.sysDepot.depotName
      })
      this.dialogDepotVisible = false
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
      getObj(row.pkDepotId)
        .then(response => {
          this.form = response.data.sysDepot
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
          delObj(row.pkDepotId)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
              // const index = this.list.indexOf(row);
              // this.list.splice(index, 1);
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
          putObj(this.form.pkDepotId, this.form).then(() => {
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
        depotName: undefined,
        depotCode: undefined,
        parentDepotName: undefined,
        parentDepotId: undefined,
        sort: undefined
      }
    }
  }
}
</script>
