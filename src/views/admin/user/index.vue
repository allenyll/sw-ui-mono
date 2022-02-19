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
                <el-input v-model="listQuery.like_name" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="账户：">
                <el-input v-model="listQuery.eq_account" class="input-width" placeholder="手工录入，精确查询"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号：">
                <el-input v-model="listQuery.eq_phone" class="input-width" placeholder="手工录入，精确查询"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <el-button v-if="userManager_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>
    <el-row>
      <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column v-if="show" align="center" label="ID">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="部门">
          <template slot-scope="scope">
            <span>{{ scope.row.depotName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.sex | sexFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="SW0001"
              inactive-value="SW0002"
              @change="updateStatus(scope.$index, scope.row.id, scope.row.status)"/>
          </template>
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.status | statusFilter }}</span>
          </template> -->
        </el-table-column>
        <el-table-column align="center" label="操作" width="300"> <template slot-scope="scope">
          <el-button v-if="userManager_btn_edit" size="small" type="success" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="userManager_btn_del" size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
          </el-button>
          <el-button v-if="userManager_btn_config_role" size="small" type="info" icon="el-icon-rank" @click="handleConfig(scope.row)">配置权限
          </el-button>
        </template> </el-table-column>
      </el-table>
    </el-row>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30,40,50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-if="dialogStatus == 'create'" v-model="form.account" placeholder="请输入账户"/>
          <el-input v-else v-model="form.account" placeholder="请输入账户" readonly/>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
          <el-input v-model="form.password" type="password"/>
        </el-form-item>
        <el-form-item label="部门" placeholder="请选择部门" prop="depotName">
          <el-input v-model="form.depotName" style="width:80%; float:left;"/>
          <el-button style="margin-left:10px;" type="primary" icon="el-icon-menu" @click="dialogDepotVisible = true">组织树</el-button>
        </el-form-item>
        <el-form-item v-if="showDeoptId" label="部门" placeholder="请选择部门" prop="fkDepotId">
          <el-input v-model="form.fkDepotId"/>
        </el-form-item>
        <el-form-item label="状态" placeholder="请选择状态" prop="status">
          <el-radio v-model="form.status" label="SW0001">启用</el-radio>
          <el-radio v-model="form.status" label="SW0002">冻结</el-radio>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" class="filter-item" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"/>
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
    <el-dialog :visible.sync="dialogRoleVisible" title="配置权限" >
      <el-transfer
        :filter-method="filterMethod"
        v-model="role"
        :data="roleList"
        filterable
        filter-placeholder="请输入角色名称"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleRole">取 消</el-button>
        <el-button type="primary" @click="configRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj, getDepotObj, getRoleList, setRoles, updateStatus } from '@/api/admin/user/index'
import { getDepotTree } from '@/api/admin/depot/index'
import { mapGetters } from 'vuex'
export default {
  name: 'User',
  filters: {
    statusFilter: function(val) {
      const map = {
        'SW0001': '启用',
        'SW0002': '冻结'
      }
      return map[val]
    },
    sexFilter: function(val) {
      const map = {
        'SW0200': '女',
        'SW0201': '男'
      }
      return map[val]
    }
  },
  data() {
    var checkphone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value && !this.isCellPhone(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的手机号!'))
      } else {
        callback()
      }
    }
    var checkemail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value && !mailReg.test(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的邮箱格式!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        userName: undefined,
        account: undefined,
        depotId: undefined,
        sex: '男',
        password: undefined,
        phone: undefined,
        email: undefined,
        depotName: undefined,
        status: 'SW0001'
      },
      rules: {
        userName: [
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
        ],
        depotName: [
          {
            required: true,
            message: '请选择所属部门',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            validator: checkphone,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: checkemail,
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
        like_user_name: '',
        status: '',
        eq_account: '',
        eq_phone: ''
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
      userManager_btn_edit: false,
      userManager_btn_del: false,
      userManager_btn_add: false,
      userManager_btn_config_role: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      dialogRoleVisible: false,
      roleList: [],
      role: [],
      configUserId: '',
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      }
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  watch: {
    filterDepotText(val) {
      this.$refs.depotTree.filter(val)
    }
  },
  created() {
    this.getList(data => {
      if (!data) {
        return
      }
      this.getDepotTreeList()
    })
    this.userManager_btn_edit = this.elements['sys:user:edit']
    this.userManager_btn_del = this.elements['sys:user:delete']
    this.userManager_btn_add = this.elements['sys:user:add']
    this.userManager_btn_config_role = this.elements['sys:user:configRole']
  },
  methods: {
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      } else {
        return true
      }
    },
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
      this.form.depotId = keyArr[0]
      getDepotObj(keyArr[0]).then(response => {
        this.form.depotName = response.data.obj.depotName
      })
      this.dialogDepotVisible = false
    },
    cancleRole() {
      this.dialogRoleVisible = false
    },
    configRole() {
      if (this.role.length < 1) {
        this.$notify({
          title: '错误',
          message: '请选择一条数据',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (this.role.length > 1) {
        this.$notify({
          title: '错误',
          message: '一个用户只能拥有一个角色',
          type: 'error',
          duration: 2000
        })
        return
      }
      setRoles(this.configUserId, this.role).then(response => {
        this.$notify({
          title: '成功',
          message: '配置成功',
          type: 'success',
          duration: 2000
        })
      })
      this.dialogRoleVisible = false
    },
    handleConfig(row) {
      this.role = []
      this.dialogRoleVisible = true
      this.configUserId = row.id
      getRoleList(row.id).then(response => {
        const roles = response.data.roleList
        const data = []
        if (roles !== undefined && roles.length > 0) {
          for (var i = 0; i < roles.length; i++) {
            data.push({
              label: roles[i].roleName,
              key: roles[i].pkRoleId
            })
          }
        }
        this.roleList = data
        const userRole = response.data.userRole
        if (userRole !== '') {
          this.role.push(
            userRole.pkRoleId
          )
        }
      })
    },
    getRole() {

    },
    handleFilter() {
      this.getList(data => {})
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        like_user_name: '',
        status: '',
        eq_account: '',
        eq_phone: ''
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
    updateStatus(index, id, status) {
      const params = {
        id: id,
        status: status
      }
      updateStatus(params).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
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
          this.form.password = undefined
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
        userName: undefined,
        account: undefined,
        fkDepotId: undefined,
        sex: '男',
        password: undefined,
        phone: undefined,
        email: undefined,
        depotName: undefined,
        status: 'SW0001'
      }
    }
  }
}
</script>
