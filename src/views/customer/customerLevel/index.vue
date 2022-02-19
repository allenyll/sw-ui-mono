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
              <el-form-item label="等级名称：">
                <el-input v-model="listQuery.like_level_name" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <el-button v-if="customerLevelManager_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="level-table-expand" label-width="200px">
            <el-form-item label="每次评价获取的成长值">
              <span>{{ props.row.commentGrowthPoint }}</span>
            </el-form-item>
            <el-form-item label="是否为默认等级">
              <el-tag :type="props.row.isDefault | isOrNoFilter">{{ props.row.isDefault | isFilter }}</el-tag>
            </el-form-item>
            <el-form-item label="是否有免邮特权">
              <el-tag :type="props.row.priviledgeFreeFreight | isOrNoFilter">{{ props.row.priviledgeFreeFreight | isFilter }}</el-tag>
            </el-form-item>
            <el-form-item label="是否有签到特权">
              <el-tag :type="props.row.priviledgeSignIn | isOrNoFilter">{{ props.row.priviledgeSignIn | isFilter }}</el-tag>
            </el-form-item>
            <el-form-item label="是否有评论获奖励特权">
              <el-tag :type="props.row.priviledgeComment | isOrNoFilter">{{ props.row.priviledgeComment | isFilter }}</el-tag>
            </el-form-item>
            <el-form-item label="是否有专享活动特权">
              <el-tag :type="props.row.priviledgePromotion | isOrNoFilter">{{ props.row.priviledgePromotion | isFilter }}</el-tag>
            </el-form-item>
            <el-form-item label="是否有会员价格特权">
              <el-tag :type="props.row.priviledgeMemberPrice | isOrNoFilter">{{ props.row.priviledgeMemberPrice | isFilter }}</el-tag>
            </el-form-item>
            <el-form-item label="是否有生日特权">
              <el-tag :type="props.row.priviledgeBirthday | isOrNoFilter">{{ props.row.priviledgeBirthday | isFilter }}</el-tag>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-if="show" align="center" label="pk_level_id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="等级名称">
        <template slot-scope="scope">
          <span>{{ scope.row.levelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="等级积分">
        <template slot-scope="scope">
          <span>{{ scope.row.growthPoint }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="免运费标准">
        <template slot-scope="scope">
          <span>{{ scope.row.freeFreightPoint }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | isUsedTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="customerLevelManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="customerLevelManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="等级名称" prop="levelName">
          <el-input v-model="form.levelName" placeholder="请输入等级名称"/>
        </el-form-item>
        <el-form-item label="等级积分" prop="growthPoint">
          <el-input v-model="form.growthPoint" placeholder="请输入等级积分"/>
        </el-form-item>
        <el-form-item label="免运费标准" prop="freeFreightPoint">
          <el-input v-model="form.freeFreightPoint" placeholder="请输入免运费标准"/>
        </el-form-item>
        <el-form-item label="每次评价获取的成长值" prop="commentGrowthPoint">
          <el-input v-model="form.commentGrowthPoint" placeholder="请输入每次评价获取的成长值"/>
        </el-form-item>
        <el-form-item label="状态" placeholder="请选择状态" prop="status">
          <el-radio v-model="form.status" label="SW1302">启用</el-radio>
          <el-radio v-model="form.status" label="SW1301">停用</el-radio>
        </el-form-item>
        <el-form-item label="是否为默认等级" prop="isDefault">
          <el-radio v-model="form.isDefault" label="SW1001">是</el-radio>
          <el-radio v-model="form.isDefault" label="SW1002">否</el-radio>
        </el-form-item>
        <el-form-item label="是否有免邮特权" prop="priviledgeFreeFreight">
          <el-radio v-model="form.priviledgeFreeFreight" label="SW1001">是</el-radio>
          <el-radio v-model="form.priviledgeFreeFreight" label="SW1002">否</el-radio>
        </el-form-item>
        <el-form-item label="是否有签到特权" prop="priviledgeSignIn">
          <el-radio v-model="form.priviledgeSignIn" label="SW1001">是</el-radio>
          <el-radio v-model="form.priviledgeSignIn" label="SW1002">否</el-radio>
        </el-form-item>
        <el-form-item label="是否有评论获奖励特权" prop="priviledgeComment">
          <el-radio v-model="form.priviledgeComment" label="SW1001">是</el-radio>
          <el-radio v-model="form.priviledgeComment" label="SW1002">否</el-radio>
        </el-form-item>
        <el-form-item label="是否有专享活动特权" prop="priviledgePromotion">
          <el-radio v-model="form.priviledgePromotion" label="SW1001">是</el-radio>
          <el-radio v-model="form.priviledgePromotion" label="SW1002">否</el-radio>
        </el-form-item>
        <el-form-item label="是否有会员价格特权" prop="priviledgeMemberPrice">
          <el-radio v-model="form.priviledgeMemberPrice" label="SW1001">是</el-radio>
          <el-radio v-model="form.priviledgeMemberPrice" label="SW1002">否</el-radio>
        </el-form-item>
        <el-form-item label="是否有生日特权" prop="priviledgeBirthday">
          <el-radio v-model="form.priviledgeBirthday" label="SW1001">是</el-radio>
          <el-radio v-model="form.priviledgeBirthday" label="SW1002">否</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/customer/customerLevel/index'
import { mapGetters } from 'vuex'
export default {
  name: 'CustomerLevel',
  filters: {
    statusFilter: function(val) {
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
    },
    isFilter: function(val) {
      const map = {
        'SW1001': '是',
        'SW1002': '否'
      }
      return map[val]
    },
    isOrNoFilter: function(val) {
      const map = {
        'SW1001': 'success',
        'SW1002': 'danger'
      }
      return map[val]
    }
  },
  data() {
    return {
      form: {
        levelName: undefined,
        growthPoint: undefined,
        status: 'SW1302',
        isDefault: undefined,
        freeFreightPoint: undefined,
        commentGrowthPoint: undefined,
        priviledgeFreeFreight: undefined,
        priviledgeSignIn: undefined,
        priviledgeComment: undefined,
        priviledgePromotion: undefined,
        priviledgeMemberPrice: undefined,
        priviledgeBirthday: undefined,
        remark: undefined
      },
      rules: {
        levelName: [
          {
            required: true,
            message: '请输入等级名称',
            trigger: 'blur'
          }
        ],
        growthPoint: [
          {
            required: true,
            message: '请输入等级积分',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请输入状态',
            trigger: 'blur'
          }
        ],
        isDefault: [
          {
            required: true,
            message: '请输入是否为默认等级',
            trigger: 'blur'
          }
        ],
        freeFreightPoint: [
          {
            required: true,
            message: '请输入免运费标准',
            trigger: 'blur'
          }
        ],
        commentGrowthPoint: [
          {
            required: true,
            message: '请输入每次评价获取的成长值',
            trigger: 'blur'
          }
        ],
        priviledgeFreeFreight: [
          {
            required: true,
            message: '请输入是否有免邮特权',
            trigger: 'blur'
          }
        ],
        priviledgeSignIn: [
          {
            required: true,
            message: '请输入是否有签到特权',
            trigger: 'blur'
          }
        ], priviledgeComment: [
          {
            required: true,
            message: '请输入是否有评论获奖励特权',
            trigger: 'blur'
          }
        ],
        priviledgePromotion: [
          {
            required: true,
            message: '请输入是否有专享活动特权',
            trigger: 'blur'
          }
        ],
        priviledgeMemberPrice: [
          {
            required: true,
            message: '请输入是否有会员价格特权',
            trigger: 'blur'
          }
        ],
        priviledgeBirthday: [
          {
            required: true,
            message: '请输入是否有生日特权',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        like_level_name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      customerLevelManager_btn_edit: false,
      customerLevelManager_btn_del: false,
      customerLevelManager_btn_add: false,
      textMap: {
        update: '编辑',
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
    this.customerLevelManager_btn_edit = this.elements['customer:customerLevel:edit']
    this.customerLevelManager_btn_del = this.elements['customer:customerLevel:delete']
    this.customerLevelManager_btn_add = this.elements['customer:customerLevel:add']
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
        like_level_name: '',
        page: 1,
        limit: 20
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
        levelName: undefined,
        growthPoint: undefined,
        status: 'SW1302',
        isDefault: 'SW1002',
        freeFreightPoint: undefined,
        commentGrowthPoint: undefined,
        priviledgeFreeFreight: 'SW1002',
        priviledgeSignIn: 'SW1002',
        priviledgeComment: 'SW1002',
        priviledgePromotion: 'SW1002',
        priviledgeMemberPrice: 'SW1002',
        priviledgeBirthday: 'SW1002',
        remark: undefined
      }
    }
  }
}
</script>
<style>
  .level-table-expand {
    font-size: 0;
  }
  .level-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .level-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
