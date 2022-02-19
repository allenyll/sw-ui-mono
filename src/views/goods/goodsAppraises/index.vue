<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="goodsAppraisesManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_appraise_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkAppraiseId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单Id">
        <template slot-scope="scope">
          <span>{{ scope.row.fkOrderId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="商品Id">
        <template slot-scope="scope">
          <span>{{ scope.row.fkGoodsId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="会员Id">
        <template slot-scope="scope">
          <span>{{ scope.row.fkCustomerId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="商品评分">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsScore }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="服务评分">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceScore }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="时效评分">
        <template slot-scope="scope">
          <span>{{ scope.row.timeScore }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="点评内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="回复内容">
        <template slot-scope="scope">
          <span>{{ scope.row.replyContent }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="回复时间">
        <template slot-scope="scope">
          <span>{{ scope.row.replyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="上传图片">
        <template slot-scope="scope">
          <span>{{ scope.row.imageUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="是否显示">
        <template slot-scope="scope">
          <span>{{ scope.row.isShow }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="是否有效">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="goodsAppraisesManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="goodsAppraisesManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="订单Id" prop="fkOrderId">
          <el-input v-model="form.fkOrderId" placeholder="请输入订单Id"/>
        </el-form-item>
        <el-form-item label="商品Id" prop="fkGoodsId">
          <el-input v-model="form.fkGoodsId" placeholder="请输入商品Id"/>
        </el-form-item>
        <el-form-item label="会员Id" prop="fkCustomerId">
          <el-input v-model="form.fkCustomerId" placeholder="请输入会员Id"/>
        </el-form-item>
        <el-form-item label="商品评分" prop="goodsScore">
          <el-input v-model="form.goodsScore" placeholder="请输入商品评分"/>
        </el-form-item>
        <el-form-item label="服务评分" prop="serviceScore">
          <el-input v-model="form.serviceScore" placeholder="请输入服务评分"/>
        </el-form-item>
        <el-form-item label="时效评分" prop="timeScore">
          <el-input v-model="form.timeScore" placeholder="请输入时效评分"/>
        </el-form-item>
        <el-form-item label="点评内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入点评内容"/>
        </el-form-item>
        <el-form-item label="回复内容" prop="replyContent">
          <el-input v-model="form.replyContent" placeholder="请输入回复内容"/>
        </el-form-item>
        <el-form-item label="回复时间" prop="replyTime">
          <el-input v-model="form.replyTime" placeholder="请输入回复时间"/>
        </el-form-item>
        <el-form-item label="上传图片" prop="imageUrl">
          <el-input v-model="form.imageUrl" placeholder="请输入上传图片"/>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-input v-model="form.isShow" placeholder="请输入是否显示"/>
        </el-form-item>
        <el-form-item label="是否有效" prop="status">
          <el-input v-model="form.status" placeholder="请输入是否有效"/>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/goods/goodsAppraises/index'
import { mapGetters } from 'vuex'
export default {
  name: 'GoodsAppraises',
  data() {
    return {
      form: {
        fkOrderId: undefined,
        fkGoodsId: undefined,
        fkCustomerId: undefined,
        goodsScore: undefined,
        serviceScore: undefined,
        timeScore: undefined,
        content: undefined,
        replyContent: undefined,
        replyTime: undefined,
        imageUrl: undefined,
        isShow: undefined,
        status: undefined
      },
      rules: {
        fkOrderId: [
          {
            required: true,
            message: '请输入订单Id',
            trigger: 'blur'
          }
        ], fkGoodsId: [
          {
            required: true,
            message: '请输入商品Id',
            trigger: 'blur'
          }
        ], fkCustomerId: [
          {
            required: true,
            message: '请输入会员Id',
            trigger: 'blur'
          }
        ], goodsScore: [
          {
            required: true,
            message: '请输入商品评分',
            trigger: 'blur'
          }
        ], serviceScore: [
          {
            required: true,
            message: '请输入服务评分',
            trigger: 'blur'
          }
        ], timeScore: [
          {
            required: true,
            message: '请输入时效评分',
            trigger: 'blur'
          }
        ], content: [
          {
            required: true,
            message: '请输入点评内容',
            trigger: 'blur'
          }
        ], replyContent: [
          {
            required: true,
            message: '请输入回复内容',
            trigger: 'blur'
          }
        ], replyTime: [
          {
            required: true,
            message: '请输入回复时间',
            trigger: 'blur'
          }
        ], imageUrl: [
          {
            required: true,
            message: '请输入上传图片',
            trigger: 'blur'
          }
        ], isShow: [
          {
            required: true,
            message: '请输入是否显示',
            trigger: 'blur'
          }
        ], status: [
          {
            required: true,
            message: '请输入是否有效',
            trigger: 'blur'
          }
        ] },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      goodsAppraisesManager_btn_edit: false,
      goodsAppraisesManager_btn_del: false,
      goodsAppraisesManager_btn_add: false,
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
    this.goodsAppraisesManager_btn_edit = this.elements['goods:goodsAppraises:edit']
    this.goodsAppraisesManager_btn_del = this.elements['goods:goodsAppraises:delete']
    this.goodsAppraisesManager_btn_add = this.elements['goods:goodsAppraises:add']
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
      getObj(row.pkAppraiseId).then(response => {
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
        delObj(row.pkAppraiseId)
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
          putObj(this.form.pkAppraiseId, this.form).then(() => {
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
        fkOrderId: undefined,
        fkGoodsId: undefined,
        fkCustomerId: undefined,
        goodsScore: undefined,
        serviceScore: undefined,
        timeScore: undefined,
        content: undefined,
        replyContent: undefined,
        replyTime: undefined,
        imageUrl: undefined,
        isShow: undefined,
        status: undefined
      }
    }
  }
}
</script>
