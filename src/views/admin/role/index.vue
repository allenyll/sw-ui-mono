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
              <el-form-item label="角色名称：">
                <el-input v-model="listQuery.like_role_name" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <el-button v-if="role_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="showId" align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签名">
        <template slot-scope="scope">
          <span>{{ scope.row.roleSign }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300"> <template slot-scope="scope">
        <el-button v-if="role_btn_edit" size="small" type="success" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="role_btn_del" size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
        </el-button>
        <el-button v-if="role_btn_config_menu" size="small" type="info" icon="el-icon-rank" @click="handleConfig(scope.row)">配置菜单
        </el-button>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="签名" prop="roleSign">
          <el-input v-model="form.roleSign" placeholder="请输入签名"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogMenuVisible" :before-close="cancleMenu" title="菜单树" width="20%">
      <el-row style="margin:0 auto;">
        <el-col :span="18" style="margin-left:30px;">
          <el-tree
            ref="menuTreeDialog"
            :data="menuTreeData"
            :props="defaultProps"
            class="filter-tree"
            node-key="id"
            highlight-current
            show-checkbox
            check-strictly>
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <i><svg-icon :icon-class="data.icon"/></i>&nbsp;{{ node.label }}
              </span>
            </span>
          </el-tree>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleMenu">取 消</el-button>
        <el-button type="primary" @click="configMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree } from '@/api/admin/menu/index'
import { page, addObj, getObj, delObj, putObj, setMenus, getRoleMenus } from '@/api/admin/role/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Role',
  data() {
    return {
      form: {
        roleName: undefined,
        roleSign: undefined,
        remark: undefined
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleSign: [
          {
            required: true,
            message: '请输入签名',
            trigger: 'blur'
          }
        ]
      },
      showId: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        like_role_name: ''
      },
      dialogFormVisible: false,
      dialogMenuVisible: false,
      dialogStatus: '',
      role_btn_edit: false,
      role_btn_del: false,
      role_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      }, tableKey: 0,
      // hasMenus: [],
      menuTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      configRoleId: ''
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
      this.getMenuTreeList()
    })
    this.role_btn_edit = this.elements['sys:role:edit']
    this.role_btn_del = this.elements['sys:role:delete']
    this.role_btn_add = this.elements['sys:role:add']
    this.role_btn_config_menu = this.elements['sys:role:configMenu']
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
    getMenuTreeList() {
      getMenuTree('role').then(data => {
        this.menuTreeData = data.data.menuTree
      })
    },
    cancleMenu() {
      this.dialogMenuVisible = false
      // 退出清空选中的菜单
      this.$refs.menuTreeDialog.setCheckedKeys([])
    },
    configMenu() {
      const keyArr = this.$refs.menuTreeDialog.getCheckedKeys()
      if (keyArr.length < 1) {
        this.$notify({
          title: '错误',
          message: '请选择一条数据',
          type: 'error',
          duration: 2000
        })
        return
      }
      setMenus(this.configRoleId, keyArr).then(response => {
        this.$notify({
          title: '成功',
          message: '配置成功',
          type: 'success',
          duration: 2000
        })
      })
      this.dialogMenuVisible = false
    },
    handleFilter() {
      this.getList(data => {})
    },
    handleReset() {
      this.listQuery = {
        like_role_name: ''
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
    handleConfig(row) {
      this.configRoleId = row.id
      getRoleMenus(this.configRoleId).then(response => {
        this.$refs.menuTreeDialog.setCheckedKeys(response.data.list)
      })
      this.dialogMenuVisible = true
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
          // this.$refs.menuTreeDialog.setCheckedKeys([])
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
        roleName: undefined,
        roleSign: undefined,
        remark: undefined
      }
    }
  }
}
</script>
