<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group style="border:none;">
        <el-button v-if="menuManager_btn_add" type="primary" icon="el-icon-plus" @click="handlerAdd">添加</el-button>
        <el-button v-if="menuManager_btn_edit" type="primary" icon="el-icon-edit" @click="handlerEdit">编辑</el-button>
        <el-button v-if="menuManager_btn_del" type="primary" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col :span="7" style="margin-top:15px;">
        <el-input v-model="filterText" placeholder="输入关键字进行过滤"/>
        <el-tree
          ref="menuTree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          node-key="id"
          highlight-current
          @node-click="getNodeData">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>
              <i><svg-icon :icon-class="data.icon"/></i>&nbsp;{{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="16" style="margin-top:15px;margin-left:15px;">
        <el-card class="box-card">
          <el-form ref="form" :label-position="labelPosition" :model="form" :rules="menuRoles" label-width="80px">
            <el-form-item label="菜单id" prop="id" hidden="true">
              <el-input v-model="form.id"/>
            </el-form-item>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" :disabled="formEdit" placeholder="请输入名称"/>
            </el-form-item>
            <el-form-item label="菜单编码" prop="menuCode">
              <el-input v-model="form.menuCode" :disabled="formEdit" placeholder="请输入菜单编码"/>
            </el-form-item>
            <el-form-item label="父级节点" prop="parentMenuName">
              <el-col :span="19">
                <el-input v-model="form.parentMenuName" :disabled="true" placeholder="请输入父级节点" @click="dialogTableVisible = true"/>
              </el-col>
              <el-button :disabled="formEdit" style="margin-left:10px;" type="primary" icon="el-icon-menu" @click="dialogTableVisible = true">菜单树</el-button>
            </el-form-item>
            <el-form-item label="父级节点" prop="pid" hidden="true">
              <el-col :span="19">
                <el-input v-model="form.pid" :disabled="formEdit" placeholder="请输入父级节点" @click="dialogTableVisible = true"/>
              </el-col>
            </el-form-item>
            <el-form-item label="图标" prop="menuIcon">
              <el-col :span="19">
                <el-input v-model="form.menuIcon" :disabled="true" placeholder="请输入图标"/>
              </el-col>
              <el-button :disabled="formEdit" style="margin-left:10px;" type="primary" icon="el-icon-menu" @click="openIcon">图标表</el-button>
            </el-form-item>
            <el-form-item label="菜单路径" prop="menuUrl">
              <el-input v-model="form.menuUrl" :disabled="formEdit" placeholder="请输入菜单路径"/>
            </el-form-item>
            <el-form-item label="菜单权限" prop="menuPerms">
              <el-input v-model="form.menuPerms" :disabled="formEdit" placeholder="请输入菜单权限"/>
            </el-form-item>
            <el-form-item label="类型" prop="menuType">
              <el-select v-model="form.menuType" :disabled="formEdit" class="filter-item" placeholder="请输入资源请求类型">
                <el-option v-for="item in typeOptions" :key="item.name" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sortNum">
              <el-input v-model="form.sortNum" :disabled="formEdit" placeholder="请输入排序"/>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="update">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="create">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogTableVisible" title="菜单树" width="25%" @close="closeMenuTree">
      <el-row style="margin:0 auto;">
        <el-col :span="15" style="margin-left:30px;">
          <el-input v-model="filterMenuText" placeholder="输入关键字过滤" style="margin-bottom:15px;"/>
          <el-tree
            ref="menuTreeDialog"
            :data="menuTreeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :default-checked-keys="checkedMenu"
            class="filter-tree"
            node-key="id"
            highlight-current
            show-checkbox
            default-expand-all
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
    <icon-vue v-model="iconModel" @sendIcon="getIcon" @closeIconModel="closeIconModel"/>
  </div>
</template>

<script>
import {
  requestTree, getMenuTree, getObj, addObj, delObj, putObj
} from '@/api/admin/menu/index'
import { mapGetters } from 'vuex'
export default {
  name: 'MenuVue',
  components: {
    'menuTreeVue': () => import('./components/menuTree'),
    'iconVue': () => import('./components/icon')
  },
  data() {
    return {
      iconModel: false,
      filterText: '',
      filterMenuText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      dialogTableVisible: false,
      typeOptions: [
        {
          'name': 'menu',
          'value': 'SW0101'
        },
        {
          'name': 'btn',
          'value': 'SW0100'
        }
      ],
      listQuery: {
        like_menu_name: undefined,
        order_sort_num: true
      },
      treeData: [],
      menuTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      checkedMenu: [],
      form: {
        menuCode: undefined,
        menuName: undefined,
        pid: undefined,
        parentMenuName: undefined,
        menuUrl: undefined,
        menuIcon: undefined,
        sortNum: undefined,
        menuType: undefined
      },
      currentId: 0,
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false,
      menuRoles: {
        menuCode: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        menuName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        parentMenuName: [{ required: true, message: '请选择父节点', trigger: 'blur' }],
        menuUrl: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        menuPerms: [{ required: true, message: '请输入权限', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择类型', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    },
    filterMenuText(val) {
      this.$refs.menuTreeDialog.filter(val)
    }
  },
  created() {
    this.getList(data => {
      if (!data) {
        return
      }
      this.getMenuTreeList()
    })
    this.menuManager_btn_add = this.elements['sys:menu:add']
    this.menuManager_btn_del = this.elements['sys:menu:delete']
    this.menuManager_btn_edit = this.elements['sys:menu:edit']
  },
  methods: {
    getList(callback) {
      requestTree(this.listQuery).then(data => {
        this.treeData = data.data.menus
        callback(true)
      }).catch((reject) => {
        callback(false)
      })
    },
    getMenuTreeList() {
      getMenuTree('menu').then(res => {
        console.log(res.data.menuTree)
        this.menuTreeData = res.data.menuTree
      })
    },
    cancleMenu() {
      this.filterMenuText = ''
      this.checkedMenu = []
      this.$refs.menuTreeDialog.setCheckedKeys([])
      this.dialogTableVisible = false
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
      if (keyArr.length > 1) {
        this.$notify({
          title: '错误',
          message: '只能选择一个父节点',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.form.pid = keyArr[0]
      getObj(keyArr[0]).then(response => {
        this.form.parentMenuName = response.data.obj.menuName
      })
      this.filterMenuText = ''
      this.checkedMenu = []
      this.$refs.menuTreeDialog.setCheckedKeys([])
      this.dialogTableVisible = false
    },
    closeMenuTree() {
      this.filterMenuText = ''
      this.checkedMenu = []
      this.$refs.menuTreeDialog.setCheckedKeys([])
    },
    openIcon(index) {
      this.iconModel = true
    },
    closeIconModel() {
      this.iconModel = false
    },
    getIcon(data) {
      this.form.menuIcon = data
      this.iconModel = false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getObj(data.id).then(response => {
        this.form = response.data.obj
      })
      this.currentId = data.id
      this.checkedMenu = [data.parentId]
      this.showElement = true
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false
        this.formStatus = 'update'
      }
    },
    handlerAdd() {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList(data => {})
          this.getMenuTreeList()
          this.resetForm()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          putObj(this.form.id, this.form).then(() => {
            this.getList(data => {})
            this.getMenuTreeList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    create() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.getList(data => {})
            this.getMenuTreeList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    onCancel() {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm() {
      this.form = {
        menuCode: undefined,
        menuName: undefined,
        pid: undefined,
        parentMenuName: undefined,
        menuUrl: undefined,
        menuIcon: undefined,
        sortNum: undefined,
        menuType: undefined
      }
    }
  }
}
</script>

