<template>
  <el-row>
    <el-col>
      <el-card>
        <div slot="header" class="clearfix">
          <span>编辑字典</span>
          <el-button style="float: right;" size="small" type="primary" @click="update('form')">保存</el-button>
        </div>
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
      </el-card>
      <el-card v-if="showChild">
        <div slot="header" class="clearfix">
          <span>字典子项列表</span>
        </div>
        <el-table v-loading.body="listLoading" :key="tableKey" :data="list" :default-sort = "{prop: 'code', order: 'ascending'}" border fit highlight-current-row style="width: 100%">
          <el-table-column v-if="show" align="center" label="ID" width="0">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" sortable label="编码" prop="code">
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
          <el-table-column align="center" label="创建时间" prop="addTime">
            <template slot-scope="scope">
              <span>{{ scope.row.addTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300"> <template slot-scope="scope">
            <el-button type="success" size="small" icon="el-icon-edit" @click="handleUpdateChild(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDeleteChild(scope.row)">删除
            </el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <el-dialog :visible.sync="dialogFormVisible" title="编辑子项字典">
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
        <el-button type="primary" @click="updateChild('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { getObj, delObj, putObj, getParent, getChild } from '@/api/admin/dict/index'
export default {
  name: 'ChildDict',
  filters: {
    statusFilter: function(val) {
      console.log(val)
      const statusMap = {
        'SW1301': '停用',
        'SW1302': '启用'
      }
      return statusMap[val]
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
      tableKey: 0,
      dictId: 0,
      dialogFormVisible: false,
      showChild: false
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.dictId = this.$route.query.id
    this.getObj(this.dictId)
    this.getChildList(this.dictId)
    this.getParentDict()
  },
  methods: {
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
    getChildList(id) {
      getChild(id).then(response => {
        const size = response.data.list
        if (response.data.list.length > 0) {
          this.showChild = true
        }
        this.list = response.data.list
        this.listLoading = false
      })
    },
    getObj(id) {
      getObj(id)
        .then(response => {
          this.form = response.data.obj
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
          putObj(this.form.id, this.form).then(() => {
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
    updateChild(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getChildList(this.dictId)
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
    handleUpdateChild(row) {
      getObj(row.id)
        .then(response => {
          this.form = response.data.obj
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
    },
    handleDeleteChild(row) {
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
              this.getChildList(this.dictId)
            })
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
