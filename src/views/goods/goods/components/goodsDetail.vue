<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品基本信息"/>
      <el-step title="填写商品促销"/>
      <el-step title="填写商品属性"/>
      <!--<el-step title="选择商品关联"/>-->
    </el-steps>
    <goods-info
      v-show="showStatus[0]"
      v-model="goodsParam"
      :is-edit="isEdit"
      @nextStep="nextStep"/>
    <goods-promotion
      v-show="showStatus[1]"
      v-model="goodsParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @nextStep="nextStep"/>
    <goods-attr
      v-show="showStatus[2]"
      v-model="goodsParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @nextStep="nextStep"
      @finishCommit="finishCommit"/>
  </el-card>
</template>

<script>
import GoodsInfo from './goodsInfo'
import GoodsPromotion from './goodsPromotion'
import GoodsAttr from './goodsAttr'
import { getObj, createGoods, updateGoods, getSnowFlakeId } from '@/api/goods/goods/index'

const param = {
  id: '',
  brandId: undefined,
  categoryId: undefined,
  parentCategoryId: undefined,
  specCategoryId: undefined,
  parentSpecCategoryId: undefined,
  unitId: undefined,
  goodsName: undefined,
  goodsCode: undefined,
  goodsBarCode: undefined,
  goodsLabel: undefined,
  price: 0,
  marketPrice: 0,
  costPrice: 0,
  stock: 0,
  warningStock: 0,
  goodsIntegral: 0,
  goodsUrl: undefined,
  goodsBrief: undefined,
  goodsDesc: undefined,
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
  saleNum: 0,
  saleTime: undefined,
  visitNum: 0,
  appraiseNum: 0,
  giftGrowth: 0,
  pointLimit: 0,
  weight: 0,
  serviceIds: undefined,
  keywords: undefined,
  promotionPrice: undefined,
  promotionStartTime: undefined,
  promotionEndTime: undefined,
  promotionPerLimit: undefined,
  promotionType: 'SW2001',
  goodsTips: undefined,
  remark: undefined,
  // 商品满减
  goodsFullReduceList: [{ fullPrice: 0, reducePrice: 0, default: false }],
  // 商品阶梯价格
  goodsLadderList: [{ count: 0, discount: 0, price: 0, default: false }],
  attrCategoryId: undefined,
  skuStockList: [],
  selectSkuPics: []
}

export default {
  name: 'GoodsDetail',
  components: {
    GoodsAttr,
    GoodsInfo,
    GoodsPromotion
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 0,
      goodsParam: Object.assign({}, param),
      showStatus: [true, false, false]
    }
  },
  created() {
    if (this.isEdit) {
      this.goodsParam.id = this.$route.query.id
      getObj(this.$route.query.id).then(response => {
        this.goodsParam = response.data.obj
      })
    } else {
      this.getSnowFlakeId().then(id => {
        this.goodsParam.id = id
      })
    }
  },
  methods: {
    getSnowFlakeId() {
      return getSnowFlakeId().then(res => {
        return res.data.id
      })
    },
    uuid(len, radix) {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
      const uuid = []
      let i = 0
      radix = radix || chars.length

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
      } else {
        // rfc4122, version 4 form
        let r

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
          }
        }
      }

      return uuid.join('').toLowerCase()
    },
    restStatus() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--
        this.restStatus()
        this.showStatus[this.active] = true
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++
        this.restStatus()
        this.showStatus[this.active] = true
      }
    },
    finishCommit(isEdit) {
      this.$confirm('是否要提交该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isEdit) {
          console.log(this.goodsParam)
          updateGoods(this.$route.query.id, this.goodsParam).then(response => {
            this.$message({
              type: 'success',
              message: '更新成功',
              duration: 1000
            })
            this.$router.back()
          })
        } else {
          createGoods(this.goodsParam).then(response => {
            this.$message({
              type: 'success',
              message: '新建成功',
              duration: 1000
            })
            location.reload()
          })
        }
      })
    }
  }
}
</script>

<style>
  .form-container {
    width: 800px;
    left: 0;
    right: 0;
    padding: 35px 35px 15px;
    margin: 20px auto;
  }
</style>
