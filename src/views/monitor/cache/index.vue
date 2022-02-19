<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--<el-input v-model="listQuery.like_key" style="width: 200px;" class="filter-item" placeholder="缓存键" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>-->
      <el-button v-if="cacheManager_btn_deleteAll" class="filter-item" type="danger" icon="el-icon-delete" @click="handleClear">清空</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="缓存键">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="缓存值">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="cacheManager_btn_del" size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>-->
  </div>
</template>

<script>
import { page, delObj, delAllObj } from '@/api/monitor/cache/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Cache',
  data() {
    return {
      form: {

      },

      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        like_key: ''
      },
      logManager_btn_del: false,
      cacheManager_btn_deleteAll: false,
      tableKey: 0
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  created() {
    this.getList()
    this.cacheManager_btn_del = this.elements['sys:cache:delete']
    this.cacheManager_btn_deleteAll = this.elements['sys:cache:deleteAll']
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
    handleDelete(row) {
      this.$confirm('此操作将永久删除缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.key)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
        })
    },
    handleClear() {
      this.$confirm('此操作将清空缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delAllObj()
            .then(() => {
              this.$notify({
                title: '成功',
                message: '清空成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
        })
    }
  }
}
</script>
