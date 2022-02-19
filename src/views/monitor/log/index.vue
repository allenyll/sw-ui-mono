<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_account" style="width: 200px;" class="filter-item" placeholder="操作人姓名" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="idShow" align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.pkLogId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="操作">
        <template slot-scope="scope">
          <span>{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="操作时间(ms)">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="500px" align="center" label="操作类">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="日志类型">
        <template slot-scope="scope">
          <span>{{ scope.row.logType | logTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="fkUserIdIfShow" width="200px" align="center" label="操作人ID">
        <template slot-scope="scope">
          <span>{{ scope.row.fkUserId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="操作人">\
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="操作主机">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="logManager_btn_check" size="small" type="success" icon="el-icon-search" @click="checkLogDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 查看页面 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="操作" prop="operation">
          <el-input v-model="form.operation" readonly/>
        </el-form-item>
        <el-form-item label="操作时间(ms)" prop="operateTime">
          <el-input v-model="form.operateTime" readonly/>
        </el-form-item>
        <el-form-item label="日志类型" prop="logType">
          <el-select v-model="form.logType" class="filter-item" placeholder="请选择" readonly>
            <el-option v-for="item in logTypeOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="操作类" prop="className">
          <el-input v-model="form.className" readonly/>
        </el-form-item>
        <el-form-item label="操作人" prop="account">
          <el-input v-model="form.account" readonly/>
        </el-form-item>
        <el-form-item label="操作ip" prop="ip">
          <el-input v-model="form.ip" readonly/>
        </el-form-item>
        <el-form-item label="操作参数" prop="params">
          <el-input v-model="form.params" readonly/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, getObj } from '@/api/monitor/log/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Log',
  filters: {
    logTypeFilter: function(val) {
      const map = {
        'SW0301': '系统日志',
        'SW0302': '操作日志'
      }
      return map[val]
    }
  },
  data() {
    return {
      form: {
        operation: undefined,
        account: undefined,
        operateTime: undefined,
        logType: undefined,
        className: undefined,
        params: undefined,
        ip: undefined
      },
      logTypeOptions: [
        {
          'name': '系统日志',
          'value': 'SW0301'
        },
        {
          'name': '操作日志',
          'value': 'SW0302'
        }
      ],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        like_account: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      logManager_btn_edit: '1',
      logManager_btn_del: '1',
      logManager_btn_add: '1',
      logManager_btn_check: false,
      textMap: {
        check: '查看',
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      idShow: false,
      fkUserIdIfShow: false
    }
  },
  created() {
    this.getList()
    this.logManager_btn_check = this.elements['sys:log:check']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
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
    checkLogDetail(row) {
      getObj(row.id)
        .then(response => {
          this.form = response.data.obj
          this.dialogFormVisible = true
          this.dialogStatus = 'check'
        })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
