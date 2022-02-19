<template>
  <div class="app-container calendar-list-container">
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.tableName" style="width: 200px;" class="filter-item" placeholder="表名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div> -->
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
              <el-form-item label="字典名称：">
                <el-input v-model="listQuery.tableName" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="表名">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="引擎">
        <template slot-scope="scope">
          <span>{{ scope.row.engine }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="表注释">
        <template slot-scope="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-if="generatorManager_btn_generator" size="small" type="success" icon="el-icon-edit" @click="generator(scope.row)">生成代码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" title="代码生成配置">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="表名称" prop="tableName">
          <el-input v-model="form.tableName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="表前缀" prop="tablePrefix">
          <el-select v-model="form.tablePrefix" class="filter-item" placeholder="请选择">
            <el-option v-for="item in tablePrefixOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类名" prop="className">
          <el-input v-model="form.className" placeholder="请输入类名"/>
        </el-form-item>
        <el-form-item label="包名" prop="packageName">
          <el-select v-model="form.packageName" class="filter-item" placeholder="请选择">
            <el-option v-for="item in packageOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="模块名称" prop="modelName">
          <el-select v-model="form.modelName" class="filter-item" placeholder="请选择">
            <el-option v-for="item in modelNameOptions" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="generatorCode('form')">生成代码</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { page, generator } from '@/api/monitor/generator/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Generator',
  data() {
    return {
      form: {
        tableName: undefined,
        tablePrefix: undefined,
        className: undefined,
        packageName: undefined,
        modelName: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        tableName: ''
      },
      generatorManager_btn_edit: '1',
      generatorManager_btn_del: '1',
      generatorManager_btn_add: '1',
      generatorManager_btn_generator: false,
      textMap: {
        check: '查看',
        update: '编辑',
        create: '创建'
      },
      dialogFormVisible: false,
      tableKey: 0,
      packageOptions: [
        {
          'name': 'user',
          'value': 'com.sw.system.user'
        },
        {
          'name': 'order',
          'value': 'com.sw.admin.order'
        },
        {
          'name': 'market',
          'value': 'com.sw.admin.market'
        },
        {
          'name': 'file',
          'value': 'com.sw.admin.file'
        },
        {
          'name': 'market',
          'value': 'com.sw.admin.member'
        },
        {
          'name': 'product',
          'value': 'com.sw.admin.product'
        },
        {
          'name': 'job',
          'value': 'com.sw.job'
        },
        {
          'name': 'common',
          'value': 'com.sw.common'
        },
        {
          'name': 'admin',
          'value': 'com.sw.admin'
        },
        {
          'name': 'shop',
          'value': 'com.sw.admin.shop'
        }
      ],
      modelNameOptions: [
        {
          'name': 'user',
          'value': 'user'
        },
        {
          'name': 'member',
          'value': 'member'
        },
        {
          'name': 'product',
          'value': 'product'
        },
        {
          'name': 'pay',
          'value': 'pay'
        },
        {
          'name': 'order',
          'value': 'order'
        },
        {
          'name': 'market',
          'value': 'market'
        },
        {
          'name': 'shop',
          'value': 'shop'
        },
        {
          'name': 'cms',
          'value': 'cms'
        },
        {
          'name': 'job',
          'value': 'job'
        }
      ],
      tablePrefixOptions: [
        {
          'name': 'sys',
          'value': 'sys_'
        },
        {
          'name': 'snu',
          'value': 'snu_'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  created() {
    this.getList()
    this.generatorManager_btn_generator = this.elements['sys:generator:gen']
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
        page: 1,
        limit: 10,
        tableName: ''
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
    generator(row) {
      this.dialogFormVisible = true
      this.form.tableName = row.tableName
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    generatorCode(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          generator(this.form)
            .then((response) => {
              const content = response
              const blob = new Blob([content])
              const fileName = 'sw-code.zip'
              if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
              } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
              }
              this.dialogFormVisible = false
              this.resetTemp()
              this.getList()
              this.$notify({
                title: '生成代码成功',
                message: '生成代码成功',
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
        tableName: undefined,
        tablePrefix: undefined,
        className: undefined,
        packageName: undefined,
        modelName: undefined
      }
    }
  }
}
</script>
