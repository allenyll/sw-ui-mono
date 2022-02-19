<template xmlns:on-progress="">
  <div class="app-container calendar-list-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"/>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          size="small"
          @click="handleSearchList()">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          size="small"
          @click="handleResetSearch()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 30px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="商品名称：">
            <el-input v-model="listQuery.like_goods_name" class="input-width" placeholder="商品名称"/>
          </el-form-item>
          <el-form-item label="商品编码：">
            <el-input v-model="listQuery.eq_goods_code" class="input-width" placeholder="商品编号"/>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select v-model="listQuery.eq_brand_id" class="input-width" filterable placeholder="请选择品牌">
              <el-option key="" label="全部" value=""/>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-select v-model="listQuery.eq_category_id" class="input-width" filterable placeholder="请选择分类">
              <el-option key="" label="全部" value=""/>
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态：">
            <el-select v-model="listQuery.eq_is_used" class="input-width" placeholder="请选择启用状态">
              <el-option key="" label="全部" value=""/>
              <el-option key="SW1302" label="启用" value="SW1302"/>
              <el-option key="SW1301" label="停用" value="SW1301"/>
            </el-select>
          </el-form-item>
          <el-form-item label="商品状态：">
            <el-select v-model="listQuery.eq_status" class="input-width" placeholder="请选择商品状态">
              <el-option key="" label="全部" value=""/>
              <el-option key="SW1401" label="上架" value="SW1401"/>
              <el-option key="SW1402" label="下架" value="SW1402"/>
              <el-option key="SW1403" label="预售" value="SW1403"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>数据列表</span>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column v-if="show" align="center" label="pk_goods_id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.fileUrl" min-width="120" height="80" >
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="商品名称">
        <template slot-scope="scope">
          <p>{{ scope.row.goodsName }}</p>
          <p>品牌：{{ brandNameMap[scope.row.brandId] }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" label="商品价格/编码">
        <template slot-scope="scope">
          <p>￥{{ scope.row.price }}</p>
          <p>货号：{{ scope.row.goodsCode }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ categoryNameMap[scope.row.categoryId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存量">
        <template slot-scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" width="140" align="center">
        <template slot-scope="scope">
          <p>启用：
            <el-switch
              v-model="scope.row.isUsed"
              active-value="SW1302"
              inactive-value="SW1301"
              @change="handleLabel(scope.$index, scope.row.id, scope.row.isUsed, 'isUsed')"/>
          </p>
          <p>推荐：
            <el-switch
              v-model="scope.row.isRecom"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.id, scope.row.isRecom, 'isRecom')"/>
          </p>
          <p>规格：
            <el-switch
              v-model="scope.row.isSpec"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.id, scope.row.isSpec, 'isSpec')"/>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="标签" width="140" align="center">
        <template slot-scope="scope">
          <p>精品：
            <el-switch
              v-model="scope.row.isBest"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.id, scope.row.isBest, 'isBest')"/>
          </p>
          <p>热卖：
            <el-switch
              v-model="scope.row.isHot"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.id, scope.row.isHot, 'isHot')"/>
          </p>
          <p>新品：
            <el-switch
              v-model="scope.row.isNew"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.id, scope.row.isNew, 'isNew')"/>
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="SKU库存" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showSkuStockDialog(scope.$index, scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="goodsManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="goodsManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog
      :visible.sync="skuStockForm.dialogVisible"
      title="编辑货品信息"
      width="60%">
      <span>商品货号：</span>
      <span>{{ skuStockForm.goodsCode }}</span>
      <el-input v-model="skuStockForm.keyword" placeholder="按sku编号搜索" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"/>
      </el-input>
      <el-table
        :data="skuStockForm.stockList"
        style="width: 100%;margin-top: 20px"
        border>
        <el-table-column
          label="SKU编号"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"/>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in skuStockForm.specList"
          :label="item"
          :key="item"
          align="center">
          <template slot-scope="scope">
            {{ getSpecs(scope.row, index) }}
          </template>
        </el-table-column>
        <el-table-column
          label="销售价格"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuPrice"/>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuStock"/>
          </template>
        </el-table-column>
        <el-table-column
          label="库存预警值"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.warnStock"/>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="skuStockForm.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSkuStock">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, delObj, putObj, updateLabel, importGoods } from '@/api/goods/goods/index'
import { getSkuStockList, updateSkuStock } from '@/api/goods/sku/index'
import { getFileList, delFile } from '@/api/admin/file/index'
import { getBrandList } from '@/api/goods/brand/index'
import { getCategoryList } from '@/api/goods/category/index'
import { getList } from '@/api/admin/dict/index'
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
const defaultListQuery = {
  page: 1,
  limit: 10,
  name: undefined,
  like_goods_name: '',
  eq_goods_code: '',
  eq_brand_id: '',
  eq_category_id: '',
  eq_is_used: '',
  eq_status: ''
}
export default {
  name: 'Goods',
  components: { Tinymce, UploadExcelComponent },
  filters: {
    statusFilter: function(val) {
      const map = {
        'SW1401': '上架',
        'SW1402': '下架',
        'SW1403': '预售'
      }
      return map[val]
    },
    statusTypeFilter(val) {
      const map = {
        'SW1401': 'success',
        'SW1402': 'danger',
        'SW1403': 'info'
      }
      return map[val]
    },
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
    },
    seasonFilter: function(val) {
      const map = {
        'SW1701': '春季',
        'SW1702': '夏季',
        'SW1703': '秋季',
        'SW1704': '冬季'
      }
      return map[val]
    },
    isOrNoFilter: function(val) {
      const map = {
        'SW1001': '是',
        'SW1002': '否'
      }
      return map[val]
    }

  },
  data() {
    return {
      skuStockForm: {
        dialogVisible: false,
        goodsId: null,
        goodsCode: '',
        stockList: [],
        specList: [],
        keyword: null
      },
      form: {
        brandId: undefined,
        categoryId: undefined,
        unitId: undefined,
        goodsName: undefined,
        goodsCode: undefined,
        goodsBarCode: undefined,
        goodsLabel: undefined,
        price: undefined,
        marketPrice: undefined,
        costPrice: undefined,
        stock: undefined,
        warningStock: undefined,
        goodsIntegral: undefined,
        goodsUrl: undefined,
        goodsBrief: undefined,
        goodsDesc: undefined,
        season: undefined,
        unit: undefined,
        goodsSeq: undefined,
        isUsed: undefined,
        status: undefined,
        isSpec: undefined,
        isBest: undefined,
        isHot: undefined,
        isNew: undefined,
        isRecom: undefined,
        saleNum: undefined,
        saleTime: undefined,
        visitNum: undefined,
        appraiseNum: undefined,
        goodsTips: undefined,
        remark: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: Object.assign({}, defaultListQuery),
      dialogFormVisible: false,
      dialogStatus: '',
      goodsManager_btn_edit: false,
      goodsManager_btn_del: false,
      goodsManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      multipleSelection: [],
      brandMap: [],
      brandOptions: [],
      categoryMap: [],
      categoryOptions: [],
      unitMap: [],
      unitOptions: [],
      dialogImageUrl: '',
      dialogImageVisible: false,
      goodsId: '',
      fileList: [],
      activeName: 'first',
      // 导入参数
      importData: [],
      importHeader: []
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ]),
    brandNameMap: function() {
      return this.brandMap
    },
    categoryNameMap: function() {
      return this.categoryMap
    }
  },
  created() {
    this.getList(data => {
      if (!data) {
        return
      }
      this.getBrandList()
      this.getCategoryList()
      this.getUnitList()
      this.download()
    })
    this.goodsManager_btn_edit = this.elements['goods:goods:edit']
    this.goodsManager_btn_del = this.elements['goods:goods:delete']
    this.goodsManager_btn_add = this.elements['goods:goods:add']
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '导入文件不能大于1M!',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.importData = results
      this.importHeader = header
      this.importGoods()
    },
    importGoods() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const goodsDataList = []
      const goods = {}
      this.importData.map(item => {
        goods.goodsName = item['商品名称']
        goods.goodsCode = item['货号']
        goods.costPrice = item['进货价']
        goods.price = item['批发价']
        goods.marketPrice = item['零售价']
        goods.size = item['尺码'] + ',758986486374273024'
        goods.goodsUrl = item['图片']
        goods.color = item['颜色'] + ',758980036360998912'
        goodsDataList.push(goods)
      })
      importGoods(goodsDataList).then(res => {
        if (res.success) {
          this.getList(data => {})
        } else {
          this.$message({
            message: '导入商品失败：' + res.message,
            type: 'warning',
            duration: 1000
          })
        }
        loading.close()
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleSearchList() {
      this.listQuery.page = 1
      this.getList(data => {})
    },
    closeDialog() {
      this.fileList = []
      this.form.goodsDesc = ''
      this.activeName = 'first'
    },
    download() {
      // download('group1/M00/00/00/rBsAA1yY_5iALGj7AAt46MDfrYg67.jpeg').then(response => {
      //   console.log(response)
      // })
    },
    getFileList(id) {
      const param = {
        id: id,
        type: 'SW1801'
      }
      getFileList(param).then(response => {
        this.fileList = response.data.list
        console.log(this.fileList)
      })
    },
    handleRemove(file, fileList) {
      const param = {
        eq_id: file.id,
        url: file.url
      }
      delFile(param).then(response => {
        if (response.data.code === '100000') {
          this.getFileList(this.goodsId)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.getFileList(this.goodsId)
          this.$notify({
            title: '失败',
            message: response.data.message,
            type: 'fail',
            duration: 2000
          })
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    getBrandList() {
      getBrandList().then(response => {
        this.brandMap = response.data.map
        this.brandOptions = response.data.list
      })
    },
    getCategoryList() {
      getCategoryList().then(response => {
        this.categoryMap = response.data.map
        this.categoryOptions = response.data.list
      })
    },
    getUnitList() {
      getList('SW16').then(response => {
        this.unitMap = response.data.map
        this.unitOptions = response.data.list
      })
    },
    handleFilter() {
      this.getList(data => {})
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$refs.tinymce.setContent(this.form.goodsDesc)
    },
    handleUpdate(row) {
      this.$router.push({ path: '/goods/updateGoods', query: { id: row.id }})
      // this.goodsId = row.id
      // this.getFileList(this.goodsId)
      // getObj(row.id)
      //   .then(response => {
      //     this.form = response.data.obj
      //     this.dialogFormVisible = true
      //     this.dialogStatus = 'update'
      //     this.$refs.tinymce.setContent(this.form.goodsDesc)
      //   })
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
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
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
      const set = this.$refs
      set[formName].resetFields()
      this.activeName = 'first'
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
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
    handleLabel(index, id, status, label) {
      const params = {
        id: id,
        label: label,
        status: status
      }
      updateLabel(params).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    getSpecs(row, index) {
      if (index === 0) {
        return row.value0
      } else if (index === 1) {
        return row.value1
      } else {
        return row.value2
      }
    },
    handleSearchEditSku() {
      getSkuStockList(this.skuStockForm.goodsId, { keyword: this.skuStockForm.keyword }).then(response => {
        this.skuStockForm.specList = response.data.specList
        this.skuStockForm.stockList = response.data.stockList
      })
    },
    showSkuStockDialog(index, row) {
      this.skuStockForm.dialogVisible = true
      this.skuStockForm.goodsId = row.id
      this.skuStockForm.goodsCode = row.goodsCode
      this.skuStockForm.keyword = null
      getSkuStockList(row.id, { keyword: this.skuStockForm.keyword }).then(response => {
        this.skuStockForm.specList = response.data.specList
        this.skuStockForm.stockList = response.data.stockList
      })
    },
    updateSkuStock() {
      if (this.skuStockForm.stockList == null || this.skuStockForm.stockList.length <= 0) {
        this.$message({
          message: '暂无sku信息',
          type: 'warning',
          duration: 1000
        })
        return
      }
      this.$confirm('是否要进行修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSkuStock(this.skuStockForm.goodsId, this.skuStockForm.stockList).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
          this.skuStockForm.dialogVisible = false
        })
      }).catch({})
    },
    resetTemp() {
      this.form = {
        brandId: undefined,
        categoryId: undefined,
        unitId: undefined,
        goodsName: undefined,
        goodsCode: undefined,
        goodsBarCode: undefined,
        goodsLabel: undefined,
        price: undefined,
        marketPrice: undefined,
        costPrice: undefined,
        stock: undefined,
        warningStock: undefined,
        goodsIntegral: undefined,
        goodsUrl: undefined,
        goodsBrief: undefined,
        goodsDesc: '',
        season: undefined,
        unit: undefined,
        goodsSeq: undefined,
        isUsed: 'SW1302',
        status: undefined,
        isSpec: 'SW1002',
        isBest: 'SW1002',
        isHot: 'SW1002',
        isNew: 'SW1001',
        isRecom: 'SW1002',
        saleNum: undefined,
        saleTime: undefined,
        visitNum: undefined,
        appraiseNum: undefined,
        goodsTips: undefined,
        remark: undefined
      }
    }
  }
}
</script>
<style>
  .form .el-select{width:100%;}
  .input-width {
    width: 203px;
  }
</style>
