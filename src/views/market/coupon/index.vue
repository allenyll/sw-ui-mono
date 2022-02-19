<template>
  <div class="app-container calendar-list-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"/>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          size="small"
          @click="handleFilter()">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          size="small"
          @click="handleReset()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="优惠券名称：">
            <el-input v-model="listQuery.like_name" class="" placeholder="优惠券名称"/>
          </el-form-item>
          <el-form-item label="优惠券类型：">
            <el-select v-model="listQuery.eq_type" placeholder="全部" clearable class="">
              <el-option key="" label="全部" value=""/>
              <el-option key="SW2201" label="全场赠送" value="SW2201"/>
              <el-option key="SW2202" label="会员赠送" value="SW2202"/>
              <el-option key="SW2203" label="购物赠送" value="SW2203"/>
              <el-option key="SW2204" label="注册赠送" value="SW2204"/>
              <el-option key="SW2205" label="兑换赠送" value="SW2205"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <el-button v-if="couponManager_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="面值">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用门槛">
        <template slot-scope="scope">
          <span>{{ scope.row.minPoint }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效期" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}至{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.endTime | formatStatus }}</template>
      </el-table-column>
      <el-table-column align="center" label="使用类型">
        <template slot-scope="scope">
          <span>{{ scope.row.useType | useTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="250px">
        <template slot-scope="scope">
          <!--v-if="couponManager_btn_detail" -->
          <el-button size="mini" type="text" @click="handlePublish(scope.$index, scope.row)">发放
          </el-button>
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">详情
          </el-button>
          <el-button v-if="couponManager_btn_edit" size="mini" type="text" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="couponManager_btn_del" size="mini" type="text" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="优惠券类型" prop="type">
          <el-select v-model="form.type" placeholder="全部" clearable class="input-width">
            <el-option key="SW2201" label="全场赠送" value="SW2201"/>
            <el-option key="SW2202" label="会员赠送" value="SW2202"/>
            <el-option key="SW2203" label="购物赠送" value="SW2203"/>
            <el-option key="SW2204" label="注册赠送" value="SW2204"/>
            <el-option key="SW2205" label="兑换赠送" value="SW2205"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" class="input-width"/>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" class="input-width"/>
        </el-form-item>
        <el-form-item label="面值" prop="amount">
          <el-input v-model="form.amount" placeholder="只能输入正整数" class="input-width"/>
        </el-form-item>
        <el-form-item label="发行数量" prop="publishCount">
          <el-input v-model="form.publishCount" placeholder="只能输入正整数" class="input-width"/>
        </el-form-item>
        <el-form-item label="每人限领：">
          <el-input v-model="form.perLimit" placeholder="只能输入正整数" class="input-width">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item label="使用门槛：" prop="minPoint">
          <el-input v-model.number="form.minPoint" placeholder="只能输入正整数" class="input-width">
            <template slot="prepend">满</template>
            <template slot="append">元可用</template>
          </el-input>
        </el-form-item>
        <el-form-item label="有效期：">
          <el-date-picker v-model="form.startTime" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd" style="width: 150px"/>
          <span style="margin-left: 20px;margin-right: 20px">至</span>
          <el-date-picker v-model="form.endTime" type="date" placeholder="选择结束时间" value-format="yyyy-MM-dd" style="width: 150px"/>
        </el-form-item>
        <el-form-item label="使用类型">
          <el-radio-group v-model="form.useType">
            <el-radio-button label="SW2301">全场通用</el-radio-button>
            <!--            <el-radio-button label="SW2302">指定分类</el-radio-button>-->
            <el-radio-button label="SW2303">指定商品</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!--        <el-form-item v-show="form.useType === 'SW2302'">-->
        <!--          <el-cascader-->
        <!--            :props="categoryProps"-->
        <!--            v-model="selectCategory"-->
        <!--            :options="categoryOptions"-->
        <!--            placeholder="请选择分类名称"-->
        <!--          />-->
        <!--          <el-button @click="handleAddGoodsCategoryRelation()">添加</el-button>-->
        <!--          <el-table-->
        <!--            ref="productCateRelationTable"-->
        <!--            :data="form.productCategoryRelationList"-->
        <!--            style="width: 100%;margin-top: 20px"-->
        <!--            border>-->
        <!--            <el-table-column label="分类名称" align="center">-->
        <!--              <template slot-scope="scope">{{ scope.row.parentCategoryName }}>{{ scope.row.productCategoryName }}</template>-->
        <!--            </el-table-column>-->
        <!--            <el-table-column label="操作" align="center" width="100">-->
        <!--              <template slot-scope="scope">-->
        <!--                <el-button-->
        <!--                  size="mini"-->
        <!--                  type="text"-->
        <!--                  @click="handleDeleteGoodsCateRelation(scope.$index, scope.row)">删除-->
        <!--                </el-button>-->
        <!--              </template>-->
        <!--            </el-table-column>-->
        <!--          </el-table>-->
        <!--        </el-form-item>-->
        <el-form-item v-show="form.useType==='SW2303'">
          <el-select
            v-model="selectGoods"
            :remote-method="searchGoodsMethod"
            :loading="selectGoodsLoading"
            filterable
            remote
            reserve-keyword
            placeholder="商品名称/商品货号">
            <el-option
              v-for="item in selectGoodsOptions"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item.goodsId">
              <span style="float: left">{{ item.goodsName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">NO.{{ item.goodsCode }}</span>
            </el-option>
          </el-select>
          <el-button @click="handleAddGoodsRelation()">添加</el-button>
          <el-table
            ref="goodsRelationTable"
            :data="form.couponGoodsList"
            style="width: 85%;margin-top: 20px"
            border>
            <el-table-column label="商品名称" align="center">
              <template slot-scope="scope">{{ scope.row.goodsName }}</template>
            </el-table-column>
            <el-table-column label="货号" align="center" width="120" >
              <template slot-scope="scope">NO.{{ scope.row.goodsCode }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDeleteGoodsRelation(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            :rows="5"
            v-model="form.note"
            class="input-width"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogCouponPublishVisible" title="优惠券发放" width="800px">
      <div class="filter-container">
        <el-input v-model="dialogListQuery.like_customer_name" style="width: 200px;" class="filter-item" placeholder="姓名" @keyup.enter.native="handleFilter"/>
        <el-input v-model="dialogListQuery.like_customer_account" style="width: 200px;" class="filter-item" placeholder="账户" @keyup.enter.native="handleFilter"/>
        <el-input v-model="dialogListQuery.like_phone" style="width: 200px;" class="filter-item" placeholder="手机号" @keyup.enter.native="handleFilter"/>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleDialogFilter">搜索</el-button>
      </div>
      <el-table v-loading.body="dialogListLoading" :key="dialogTableKey" :data="customerList" element-loading-text="拼命加载中" border fit highlight-current-row style="width: 100%">
        <el-table-column v-if="show" align="center" label="主键ID">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.customerName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户">
          <template slot-scope="scope">
            <span>{{ scope.row.customerAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="publishCoupon(scope.row)">发放
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!dialogListLoading" class="pagination-container">
        <el-pagination :current-page.sync="dialogListQuery.page" :page-sizes="[10,20,30,40,50]" :page-size="dialogListQuery.limit" :total="dialogTotal" layout="total, sizes, prev, pager, next, jumper" @size-change="handleDialogSizeChange" @current-change="handleDialogCurrentChange"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj, publishCoupon } from '@/api/market/coupon/index'
import { page as customerPage } from '@/api/customer/customer/index'
import { mapGetters } from 'vuex'
import { categoryTree } from '@/api/goods/category/index'
import { getGoodsList } from '@/api/goods/goods/index'
import { formatDate } from '@/utils/date'
export default {
  name: 'Coupon',
  filters: {
    typeFilter: function(val) {
      const map = {
        'SW2201': '全场赠送',
        'SW2202': '会员赠送',
        'SW2203': '购物赠送',
        'SW2204': '注册赠送',
        'SW2205': '兑换赠送'
      }
      return map[val]
    },
    useTypeFilter: function(val) {
      const map = {
        'SW2301': '全场通用',
        'SW2302': '指定分类',
        'SW2303': '指定商品'
      }
      return map[val]
    },
    formatStatus(endTime) {
      const now = formatDate(new Date(), 'yyyy-MM-dd')
      console.log(now)
      if (endTime > now) {
        return '未过期'
      } else {
        return '已过期'
      }
    }
  },
  data() {
    return {
      categoryProps: {
        value: 'id'
      },
      form: {
        name: undefined,
        code: undefined,
        amount: undefined,
        type: undefined,
        count: undefined,
        perLimit: undefined,
        minPoint: undefined,
        startTime: undefined,
        endTime: undefined,
        useType: 'SW2301',
        note: undefined,
        publishCount: undefined,
        useCount: undefined,
        receiveCount: undefined,
        enableTime: undefined,
        couponGoodsList: []
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ], code: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ], amount: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ], type: [
          {
            required: true,
            message: '请输入优惠券类型',
            trigger: 'blur'
          }
        ], count: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          }
        ], perLimit: [
          {
            required: true,
            message: '请输入每人限领张数',
            trigger: 'blur'
          }
        ], minPoint: [
          {
            required: true,
            message: '请输入使用门槛；0表示无门槛',
            trigger: 'blur'
          }
        ], startTime: [
          {
            required: true,
            message: '请输入开始时间',
            trigger: 'blur'
          }
        ], endTime: [
          {
            required: true,
            message: '请输入结束时间',
            trigger: 'blur'
          }
        ], useType: [
          {
            required: true,
            message: '请输入使用类型：全场通用；指定分类；指定商品',
            trigger: 'blur'
          }
        ], note: [
          {
            required: true,
            message: '请输入备注',
            trigger: 'blur'
          }
        ], publishCount: [
          {
            required: true,
            message: '请输入发行数量',
            trigger: 'blur'
          }
        ], useCount: [
          {
            required: true,
            message: '请输入已使用数量',
            trigger: 'blur'
          }
        ], receiveCount: [
          {
            required: true,
            message: '请输入领取数量',
            trigger: 'blur'
          }
        ], enableTime: [
          {
            required: true,
            message: '请输入可以领取的日期',
            trigger: 'blur'
          }
        ] },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        like_name: undefined,
        eq_type: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      couponManager_btn_edit: false,
      couponManager_btn_del: false,
      couponManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      typeOptions: [],
      selectCategory: [],
      categoryOptions: [],
      selectGoodsOptions: [],
      selectGoods: null,
      selectGoodsLoading: false,
      selectGoodsCate: null,
      productCateOptions: [],
      dialogCouponPublishVisible: false,
      customerList: null,
      dialogTotal: null,
      dialogListLoading: true,
      dialogListQuery: {
        page: 1,
        limit: 10,
        like_customer_name: '',
        like_customer_account: '',
        like_phone: ''
      },
      dialogTableKey: 0,
      tempCouponId: ''
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  watch: {
    selectCategory: function(newValue) {
      /* if (newValue != null && newValue.length >= 1) {
        this.value.fkCategoryId = newValue[newValue.length - 1]
        console.log(this.value.fkCategoryId)
      } else {
        this.value.fkCategoryId = null
      }*/
    }
  },
  created() {
    this.getList(data => {
      if (!data) {
        return
      }
      this.categoryTreeList()
      this.getCustomerList()
    })
    this.couponManager_btn_edit = this.elements['market:coupon:edit']
    this.couponManager_btn_del = this.elements['market:coupon:delete']
    this.couponManager_btn_add = this.elements['market:coupon:add']
  },
  methods: {
    getList(callback) {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        callback(true)
      }).catch((reject) => {
        callback(false)
      })
    },
    getCustomerList() {
      this.dialogListLoading = true
      customerPage(this.dialogListQuery)
        .then(response => {
          this.customerList = response.data.list
          this.dialogTotal = response.data.total
          this.dialogListLoading = false
        })
    },
    categoryTreeList() {
      categoryTree().then(res => {
        const tree = this.getTreeOptions(res.data.categoryTree)
        this.categoryOptions = tree
      })
    },
    publishCoupon(row) {
      this.$confirm('确认发放给用户' + row.customerName + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        publishCoupon(this.tempCouponId, row.id).then(res => {
          if (res.code === '100000') {
            this.$message({
              message: '发放成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      })
    },
    // 递归遍历分类树，去掉顶级节点和把子节点为空的定义成undefined
    getTreeOptions(data) {
      // 去掉顶级节点
      if (data[0].id === '0') {
        data = data[0].children
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // 如果子节点为空数组，定义为undefined
          data[i].children = undefined
        } else {
          // 不为空，继续遍历
          this.getTreeOptions(data[i].children)
        }
      }
      return data
    },
    searchGoodsMethod(query) {
      if (query !== '') {
        this.loading = true
        getGoodsList({ keyword: query }).then(response => {
          this.loading = false
          if (response.data.code === '100000') {
            const goodsList = response.data.list
            this.selectGoodsOptions = []
            for (let i = 0; i < goodsList.length; i++) {
              const item = goodsList[i]
              this.selectGoodsOptions.push({ goodsId: item.id, goodsName: item.goodsName, goodsCode: item.goodsCode })
            }
          } else {
            this.selectGoodsOptions = []
          }
        })
      } else {
        this.selectGoodsOptions = []
      }
    },
    handleAddGoodsRelation() {
      console.log(this.selectGoods)
      if (this.selectGoods === null && this.selectGoods.length === 0) {
        this.$message({
          message: '请先选择商品分类',
          type: 'warning'
        })
        return
      }
      if (this.form.couponGoodsList.length > 0) {
        for (let i = 0; i < this.form.couponGoodsList.length; i++) {
          if (this.form.couponGoodsList[i].goodsId === this.selectGoods) {
            this.$message({
              message: '请勿重复添加商品',
              type: 'warning'
            })
            return
          }
        }
      }
      this.form.couponGoodsList.push(this.getGoodsById(this.selectGoods))
      this.selectGoods = null
      console.log(this.form.couponGoodsList)
    },
    getGoodsById(id) {
      console.log((this.selectGoodsOptions))
      for (let i = 0; i < this.selectGoodsOptions.length; i++) {
        if (id === this.selectGoodsOptions[i].goodsId) {
          return this.selectGoodsOptions[i]
        }
      }
      return null
    },
    handleDeleteGoodsRelation(index, row) {
      this.form.couponGoodsList.splice(index, 1)
    },
    handlePublish(index, row) {
      this.dialogCouponPublishVisible = true
      this.tempCouponId = row.id
      console.log(this.tempCouponId)
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        like_name: undefined,
        eq_type: undefined
      }
    },
    handleDetail(index, row) {
      this.$router.push({ path: '/market/couponDetail', query: { id: row.id }})
    },
    handleFilter() {
      this.getList(data => {})
    },
    handleDialogFilter() {
      this.getCustomerList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList(data => {})
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(data => {})
    },
    handleDialogSizeChange(val) {
      this.dialogListQuery.limit = val
      this.getCustomerList()
    },
    handleDialogCurrentChange(val) {
      this.dialogListQuery.page = val
      this.getCustomerList()
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
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.id, this.form).then(() => {
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
    resetTemp() {
      this.form = {
        name: undefined,
        code: undefined,
        amount: undefined,
        type: undefined,
        count: undefined,
        perLimit: undefined,
        minPoint: undefined,
        startTime: undefined,
        endTime: undefined,
        useType: 'SW2301',
        note: undefined,
        publishCount: undefined,
        useCount: undefined,
        receiveCount: undefined,
        enableTime: undefined,
        couponGoodsList: []
      }
    }
  }
}
</script>
<style scoped>
  .input-width {
    width: 60%;
  }
</style>
