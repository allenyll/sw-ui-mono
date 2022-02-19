<template>
  <div class="app-container">
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
              <el-form-item label="名称：">
                <el-input v-model="listQuery.name" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <el-button v-if="depot_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>
    <tree-table :data="treeData" :columns="columns" border>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="depot_btn_edit" size="small" icon="el-icon-edit" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="depot_btn_del" size="small" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="depotName">
          <el-input v-model="form.depotName" placeholder="请输入部门名称"/>
        </el-form-item>
        <el-form-item label="编码" prop="depotCode">
          <el-input v-model="form.depotCode" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item :disabled="true" label="上级部门" placeholder="请选择部门" prop="parentDepotName">
          <el-input v-model="form.parentDepotName" style="width:80%; float:left;"/>
          <el-button style="margin-left:10px;" type="primary" icon="el-icon-menu" @click="dialogDepotVisible = true">组织树</el-button>
        </el-form-item>
        <el-form-item v-if="parentDepotId" label="部门" placeholder="请选择部门" prop="pid">
          <el-input v-model="form.pid"/>
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
    <el-dialog :visible.sync="dialogDepotVisible" title="组织" width="20%" @close="closeDepotTree">
      <el-row style="margin:0 auto;">
        <el-col :span="15" style="margin-left:30px;">
          <el-input v-model="filterDepotText" placeholder="输入关键字过滤" style="margin-bottom:15px;"/>
          <el-tree
            ref="depotTree"
            :data="depotTreeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :default-checked-keys="checkDepot"
            class="filter-tree"
            node-key="id"
            highlight-current
            show-checkbox
            default-expand-all
            check-strictly/>
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
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import treeTable from '@/components/TreeTable'
import { addObj, getObj, delObj, putObj, requestTree, getDepotTree } from '@/api/admin/depot/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Depot',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'name',
          width: 200
        },
        // {
        //   text: 'ID',
        //   value: 'id'
        // },
        {
          text: '编码',
          value: 'code'
        }
      ],
      form: {
        depotName: undefined,
        depotCode: undefined,
        parentDepotName: undefined,
        pid: undefined,
        sort: undefined
      },
      rules: {
        depotName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        depotCode: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          }
        ],
        parentDepotName: [
          {
            required: true,
            message: '请选择上级组织',
            trigger: 'blur'
          }
        ]
      },
      treeData: [],
      listQuery: {
        name: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      dialogFormVisible: false,
      dialogDepotVisible: false,
      parentDepotId: false,
      depot_btn_add: false,
      depot_btn_edit: false,
      depot_btn_del: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterDepotText: '',
      depotTreeData: [],
      checkDepot: []
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
    this.depot_btn_add = this.elements['sys:depot:add']
    this.depot_btn_edit = this.elements['sys:depot:edit']
    this.depot_btn_del = this.elements['sys:depot:delete']
  },
  methods: {
    getList(callback) {
      requestTree(this.listQuery).then(data => {
        console.log(data.data.depots)
        this.treeData = data.data.depots
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
      this.checkDepot = []
      this.$refs.depotTree.setCheckedKeys([])
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
      this.form.pid = keyArr[0]
      getObj(keyArr[0]).then(response => {
        this.form.parentDepotName = response.data.obj.depotName
      })
      this.filterDepotText = ''
      this.checkDepot = []
      this.$refs.depotTree.setCheckedKeys([])
      this.dialogDepotVisible = false
    },
    closeDepotTree() {
      this.filterDepotText = ''
      this.checkDepot = []
      this.$refs.depotTree.setCheckedKeys([])
    },
    handleFilter() {
      this.getList(data => {})
    },
    handleReset() {
      this.listQuery = {
        name: ''
      }
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
          this.checkDepot = [response.data.obj.pid]
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
    },
    handleDelete(row) {
      if (row.children.length > 0) {
        this.$notify({
          title: '错误',
          message: '该节点下有子节点，无法删除！',
          type: 'error',
          duration: 2000
        })
        return
      }
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
              this.getDepotTreeList()
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
              this.getDepotTreeList()
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
            this.getDepotTreeList()
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
        depotName: undefined,
        depotCode: undefined,
        parentDepotName: undefined,
        pid: undefined,
        sort: undefined
      }
    },
    message(row) {
      console.log(row.id)
    }
  }
}
</script>
