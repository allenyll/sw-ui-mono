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
            <el-col :span="4">
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
      <el-button v-if="categoryManager_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>
    <el-table :data="treeData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
      <el-table-column v-if="show" prop="id" label="id" sortable/>
      <el-table-column prop="name" align="center" label="分类名称" sortable/>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.url" min-width="50" height="50" >
        </template>
      </el-table-column>
      <el-table-column prop="code" align="center" sortable label="编码"/>
      <el-table-column align="center" prop="isUsed" label="是否启用"/>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="categoryManager_btn_edit" size="small" icon="el-icon-edit" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="categoryManager_btn_del" size="small" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="closeDialog()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="分类编码" prop="categoryNo">
          <el-input v-model="form.categoryNo" placeholder="请输入分类编码"/>
        </el-form-item>
        <el-form-item label="上级分类" placeholder="请选择父节点" prop="parentCategoryName">
          <el-input v-model="form.parentCategoryName" style="width:75%; float:left;"/>
          <el-button style="margin-left:10px;" type="primary" icon="el-icon-menu" @click="dialogCategoryVisible = true">上级分类</el-button>
        </el-form-item>
        <el-form-item v-if="parentCategoryId" label="父级分类" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父级id"/>
        </el-form-item>
        <el-form-item label="层级" prop="categoryLevel">
          <el-input v-model="form.categoryLevel" placeholder="请输入层级"/>
        </el-form-item>
        <el-form-item label="顺序" prop="categorySeq">
          <el-input v-model="form.categorySeq" placeholder="请输入顺序"/>
        </el-form-item>
        <el-form-item label="是否最有一层" prop="isDefault">
          <el-radio v-model="form.isEnd" label="SW1001">是</el-radio>
          <el-radio v-model="form.isEnd" label="SW1002">否</el-radio>
        </el-form-item>
        <el-form-item label="是否启用" prop="isUsed">
          <el-radio v-model="form.isUsed" label="SW1301">停用</el-radio>
          <el-radio v-model="form.isUsed" label="SW1302">启用</el-radio>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述"/>
        </el-form-item>
        <el-form-item label="图片">
          <multi-upload
            v-if="form.id"
            ref="upload"
            v-model="fileList"
            :max-count="maxCount"
            :upload-id="form.id"
            upload-type="SW1802"
            style="display: inline-block;margin-left: 10px"
            @removeFile="removeFile"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogCategoryVisible" title="商品分类" width="24%" @close="closeCategoryTree">
      <el-row style="margin:0 auto;">
        <el-col :span="15" style="margin-left:30px;">
          <el-input v-model="filterCategoryText" placeholder="输入关键字过滤" style="margin-bottom:15px;"/>
          <el-tree
            ref="categoryTree"
            :data="categoryTreeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :default-checked-keys="checkedCategory"
            class="filter-tree"
            node-key="id"
            highlight-current
            show-checkbox
            default-expand-all
            check-strictly/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleCategory">取 消</el-button>
        <el-button type="primary" @click="configCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import multiUpload from '@/components/Upload/multiUpload'
import { tree, addObj, getObj, delObj, putObj, categoryTree } from '@/api/goods/category/index'
import { getSnowFlakeId } from '@/api/goods/goods/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Category',
  components: { multiUpload },
  filters: {
    isUsedFilter: function(val) {
      const map = {
        'SW1301': '停用',
        'SW1302': '启用'
      }
      return map[val]
    },
    isUsedTypeFilter(val) {
      const map = {
        'SW1302': 'success',
        'SW1301': 'info'
      }
      return map[val]
    }
  },
  data() {
    return {
      // columns: [
      //   {
      //     text: '分类名称',
      //     value: 'name'
      //   },
      //   {
      //     text: '图片',
      //     value: 'url',
      //     ifImage: 0
      //   },
      //   {
      //     text: '分类编码',
      //     value: 'code'
      //   },
      //   {
      //     text: '层级',
      //     value: 'level'
      //   },
      //   {
      //     text: '是否启用',
      //     value: 'isUsed'
      //   }
      // ],
      form: {
        id: undefined,
        categoryNo: undefined,
        categoryName: undefined,
        parentId: undefined,
        categoryLevel: undefined,
        description: undefined,
        categorySeq: undefined,
        isEnd: undefined,
        isUsed: undefined,
        parentCategoryName: undefined,
        fileName: undefined
      },
      rules: {
        categoryNo: [
          {
            required: true,
            message: '请输入分类编码',
            trigger: 'blur'
          }
        ],
        categoryName: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ],
        parentId: [
          {
            required: true,
            message: '请输入父级id',
            trigger: 'blur'
          }
        ],
        categoryLevel: [
          {
            required: true,
            message: '请输入层级',
            trigger: 'blur'
          }
        ],
        categorySeq: [
          {
            required: true,
            message: '请输入顺序',
            trigger: 'blur'
          }
        ],
        isUsed: [
          {
            required: true,
            message: '请输入是否启用',
            trigger: 'blur'
          }
        ],
        parentCategoryName: [
          {
            required: true,
            message: '请选择上级分类',
            trigger: 'blur'
          }
        ]
      },
      treeData: [],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      parentOptions: [],
      dialogFormVisible: false,
      dialogCategoryVisible: false,
      dialogStatus: '',
      categoryManager_btn_edit: false,
      categoryManager_btn_del: false,
      categoryManager_btn_add: false,
      parentCategoryId: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      nameMap: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterCategoryText: '',
      categoryTreeData: [],
      // 图片列表（用于在上传组件中回显图片）
      fileList: [],
      fileUrl: '',
      maxCount: 1,
      checkedCategory: []
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ]),
    convert: function() {
      return this.nameMap
    }
  },
  created() {
    this.getList(data => {
      if (!data) {
        return
      }
      this.getCategoryTree()
    })
    this.categoryManager_btn_edit = this.elements['goods:category:edit']
    this.categoryManager_btn_del = this.elements['goods:category:delete']
    this.categoryManager_btn_add = this.elements['goods:category:add']
  },
  methods: {
    getSnowFlakeId() {
      return getSnowFlakeId().then(res => {
        return res.data.id
      })
    },
    getList(callback) {
      this.listLoading = true
      tree(this.listQuery)
        .then(response => {
          this.treeData = response.data.list
          this.listLoading = false
          callback(true)
        }).catch((reject) => {
          callback(false)
        })
    },
    getCategoryTree() {
      categoryTree().then(response => {
        this.categoryTreeData = response.data.categoryTree
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    closeCategoryTree() {
      this.filterCategoryText = ''
      this.checkedCategory = []
      this.$refs.categoryTree.setCheckedKeys([])
    },
    cancleCategory() {
      this.filterCategoryText = ''
      this.checkedCategory = []
      this.$refs.categoryTree.setCheckedKeys([])
      this.dialogCategoryVisible = false
    },
    configCategory() {
      const keyArr = this.$refs.categoryTree.getCheckedKeys()
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
      this.form.parentId = keyArr[0]
      getObj(keyArr[0]).then(response => {
        this.form.parentCategoryName = response.data.obj.categoryName
      })
      this.filterCategoryText = ''
      this.checkedCategory = []
      this.$refs.categoryTree.setCheckedKeys([])
      this.dialogCategoryVisible = false
    },
    removeFile(fileList) {
      this.fileList = fileList
    },
    handleFilter() {
      this.getList(data => {})
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        name: undefined
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
      this.getSnowFlakeId().then(id => {
        this.form.id = id
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      })
    },
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          const fileUrl = response.data.file.fileUrl
          this.fileUrl = fileUrl
          if (fileUrl !== undefined && fileUrl !== '' && fileUrl !== null) {
            var data = {
              id: response.data.file.id,
              name: '分类',
              url: response.data.file.fileUrl
            }
            this.fileList.push(data)
          }
          this.checkedCategory = [response.data.obj.parentId]
          this.form = response.data.obj
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
              this.getCategoryTree()
            })
        })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.form.fileList = this.fileList
          console.log(this.form)
          addObj(this.form)
            .then(() => {
              this.dialogFormVisible = false
              this.getList(data => {})
              this.getCategoryTree()
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
      this.fileList = []
      set[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          console.log(this.fileList)
          this.form.fileList = this.fileList
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList(data => {})
            this.getCategoryTree()
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
        categoryNo: undefined,
        categoryName: undefined,
        parentId: undefined,
        categoryLevel: undefined,
        description: undefined,
        categorySeq: undefined,
        isEnd: 'SW1001',
        isUsed: 'SW1302',
        parentCategoryName: undefined,
        fileName: undefined
      }
    },
    closeDialog() {
      this.fileList = []
    }
  }
}
</script>
