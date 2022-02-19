<template>
  <div style="margin-top: 50px">
    <el-form ref="goodsInfoForm" :model="value" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="value.goodsName" placeholder="请输入商品名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品编码" prop="goodsCode">
            <el-input v-model="value.goodsCode" placeholder="请输入商品编码"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品条形码" prop="goodsBarCode">
            <el-input v-model="value.goodsBarCode" placeholder="请输入商品条形码"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品价格" prop="price">
            <el-input v-model="value.price" placeholder="请输入商品价格"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="市场价" prop="marketPrice">
            <el-input v-model="value.marketPrice" placeholder="请输入市场价"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成本价" prop="costPrice">
            <el-input v-model="value.costPrice" placeholder="请输入成本价"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属分类" prop="categoryId">
            <el-cascader
              :props="categoryProps"
              v-model="selectCategory"
              :options="categoryOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="value.brandId" filterable placeholder="请选择">
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unit">
            <el-select v-model="value.unit" filterable placeholder="请选择">
              <el-option
                v-for="item in unitOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品状态" filterable prop="status">
            <el-select v-model="value.status" style="wdith:100%;">
              <el-option key="SW1401" label="上架" value="SW1401"/>
              <el-option key="SW1402" label="下架" value="SW1402"/>
              <el-option key="SW1403" label="预售" value="SW1403"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上架时间" prop="saleTime">
            <el-date-picker
              v-model="value.saleTime"
              type="datetime"
              placeholder="请选择上架时间"
              default-time="12:00:00"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="季节性" prop="season">
            <el-select v-model="value.season" filterable style="wdith:100%;">
              <el-option key="SW1701" label="春季" value="SW1701"/>
              <el-option key="SW1702" label="夏季" value="SW1702"/>
              <el-option key="SW1703" label="秋季" value="SW1703"/>
              <el-option key="SW1704" label="冬季" value="SW1704"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="库存量" prop="stock">
            <el-input v-model="value.stock" placeholder="请输入库存量"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="告警库存" prop="warningStock">
            <el-input v-model="value.warningStock" placeholder="请输入告警库存"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-row>
        <el-col :span="8">
          <el-form-item label="商品积分" prop="goodsIntegral">
            <el-input v-model="value.goodsIntegral" placeholder="请输入商品积分"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品标签" prop="goodsLabel">
            <el-input v-model="value.goodsLabel" placeholder="请输入商品标签"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品排序" prop="goodsSeq">
            <el-input v-model="value.goodsSeq" placeholder="请输入商品排序"/>
          </el-form-item>
        </el-col>
      </el-row>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="总销量" prop="saleNum">
            <el-input v-model="value.saleNum" placeholder="请输入总销量"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访问量" prop="visitNum">
            <el-input v-model="value.visitNum" placeholder="请输入访问量"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品排序" prop="goodsSeq">
            <el-input v-model="value.goodsSeq" placeholder="请输入商品排序"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评价数" prop="appraiseNum">
            <el-input v-model="value.appraiseNum" placeholder="请输入评价数"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="isUsed">
            <el-radio v-model="value.isUsed" label="SW1301">停用</el-radio>
            <el-radio v-model="value.isUsed" label="SW1302">启用</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否有规格" prop="isSpec">
            <el-radio v-model="value.isSpec" label="SW1001">是</el-radio>
            <el-radio v-model="value.isSpec" label="SW1002">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="简介" prop="goodsBrief">
            <el-input v-model="value.goodsBrief" type="textarea" placeholder="请输入简介"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('goodsInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { categoryTree } from '@/api/goods/category/index'
import { getBrandList } from '@/api/goods/brand/index'
import { getList } from '@/api/admin/dict/index'
export default {
  name: 'GoodsInfo',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categoryProps: {
        value: 'id'
      },
      rules: {
        brandId: [
          {
            required: true,
            message: '请输入品牌主键',
            trigger: 'blur'
          }
        ], categoryId: [
          {
            required: true,
            message: '请输入分类主键',
            trigger: 'blur'
          }
        ],
        goodsName: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goodsCode: [
          {
            required: true,
            message: '请输入商品编码',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        stock: [
          {
            required: true,
            message: '请输入库存量',
            trigger: 'blur'
          }
        ],
        season: [
          {
            required: true,
            message: '请输入季节性',
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: '请输入单位',
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
        status: [
          {
            required: true,
            message: '请输入商品状态',
            trigger: 'blur'
          }
        ],
        saleTime: [
          {
            required: true,
            message: '请选择上架时间',
            trigger: 'blur'
          }
        ]
      },
      brandOptions: [],
      categoryOptions: [],
      selectCategory: [],
      unitOptions: [],
      flag: false
    }
  },
  computed: {
    productId: function(newValue) {
      if (!this.isEdit) return
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.handleEdit(this.value.parentCategoryId, this.value.categoryId)
      return this.value.id
    }
  },
  watch: {
    productId() {
      return this.value.id
    },
    selectCategory: function(newValue) {
      console.log(newValue)
      console.log(newValue.length)
      if (newValue != null && newValue.length >= 1) {
        this.value.categoryId = newValue[newValue.length - 1]
        console.log(this.value.categoryId)
      } else {
        this.value.categoryId = null
      }
    }
  },
  created() {
    this.getBrandList((data) => {
      if (!data) {
        // this.value.logOut = true
        return
      }
      this.categoryTreeList()
      this.getUnitList()
    })
  },
  methods: {
    handleEdit(pid, id) {
      if (this.isEdit) {
        if (!this.flag) {
          if (pid !== '' && pid !== null && pid !== undefined) {
            this.selectCategory.push(pid)
          }
          if (id !== '' && id !== null && id !== undefined) {
            this.selectCategory.push(id)
          }
          if (this.selectCategory.length > 0) {
            this.flag = true
          }
        }
      }
    },
    getBrandList(callback) {
      getBrandList().then(response => {
        this.brandOptions = response.data.list
        callback(true)
      }).catch((reject) => {
        callback(false)
      })
    },
    categoryTreeList() {
      categoryTree().then(res => {
        const tree = this.getTreeOptions(res.data.categoryTree)
        this.categoryOptions = tree
      })
    },
    getUnitList() {
      getList('SW16').then(response => {
        this.unitOptions = response.data.list
      })
    },
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('nextStep')
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
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
    }
  }
}
</script>

<style scoped>
  .el-select, .el-cascader, .el-date-editor{
    width: 100%;
  }
</style>
