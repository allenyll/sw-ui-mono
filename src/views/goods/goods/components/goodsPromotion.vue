<template>
  <div style="margin-top: 50px">
    <el-form ref="goodsPromotionForm" :model="value" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品积分" prop="goodsIntegral">
            <el-input v-model="value.goodsIntegral" placeholder="请输入商品积分"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会员成长值" prop="giftGrowth">
            <el-input v-model="value.giftGrowth" placeholder="请输入成长值"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="积分限购数量" prop="pointLimit">
            <el-input v-model="value.pointLimit" placeholder="请输入积分限购数量"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品标签" prop="goodsLabel">
            <el-input v-model="value.goodsLabel" placeholder="请输入商品标签"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否新品" prop="isNew">
            <el-radio v-model="value.isNew" label="SW1001">是</el-radio>
            <el-radio v-model="value.isNew" label="SW1002">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否推荐" prop="isRecom">
            <el-radio v-model="value.isRecom" label="SW1001">是</el-radio>
            <el-radio v-model="value.isRecom" label="SW1002">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否精品" prop="isBest">
            <el-radio v-model="value.isBest" label="SW1001">是</el-radio>
            <el-radio v-model="value.isBest" label="SW1002">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否热卖" prop="isHot">
            <el-radio v-model="value.isHot" label="SW1001">是</el-radio>
            <el-radio v-model="value.isHot" label="SW1002">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="促销信息" prop="goodsTips">
            <el-input v-model="value.goodsTips" type="textarea" placeholder="请输入促销信息"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="value.remark" type="textarea" placeholder="请输入备注"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="促销类型" prop="promotionType">
            <el-radio-group v-model="value.promotionType" size="medium">
              <el-radio-button label="SW2001">无优惠</el-radio-button>
              <el-radio-button label="SW2002">特惠促销</el-radio-button>
              <el-radio-button label="SW2003" disabled>会员优惠</el-radio-button>
              <el-radio-button label="SW2004">阶梯优惠</el-radio-button>
              <el-radio-button label="SW2005">满减优惠</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-show="value.promotionType=== 'SW2002'">
        <div>
          开始时间：
          <el-date-picker
            v-model="value.promotionStartTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择开始时间"/>
        </div>
        <div class="dateClass">
          结束时间：
          <el-date-picker
            v-model="value.promotionEndTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择结束时间"/>
        </div>
        <div class="dateClass">
          促销价格：
          <el-input v-model="value.promotionPrice" style="width: 220px" placeholder="输入促销价格"/>
        </div>
      </el-form-item>
      <el-form-item v-show="value.promotionType === 'SW2004'">
        <el-table
          :data="value.goodsLadderList"
          style="width: 80%"
          border>
          <el-table-column
            label="数量"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.count"/>
            </template>
          </el-table-column>
          <el-table-column
            label="折扣"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.discount"/>
            </template>
          </el-table-column>
          <el-table-column
            label="是否保存"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.default"
                active-color="#13ce66"
                inactive-color="#ff4949"/>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="removeGoodsLadder(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="addGoodsLadder(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="value.promotionType === 'SW2005' ">
        <el-table
          :data="value.goodsFullReduceList"
          style="width: 80%"
          border>
          <el-table-column
            label="满"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fullPrice"/>
            </template>
          </el-table-column>
          <el-table-column
            label="立减"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reducePrice"/>
            </template>
          </el-table-column>
          <el-table-column
            label="是否保存"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.default"
                active-color="#13ce66"
                inactive-color="#ff4949"/>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="removeFullReduce(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="addFullReduce(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'GoodsPromotion',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  created() {
  },
  methods: {
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.$emit('nextStep')
    },
    removeGoodsLadder(index, row) {
      const goodsLadderList = this.value.goodsLadderList
      if (goodsLadderList.length === 1) {
        goodsLadderList.pop()
        goodsLadderList.push({
          count: 0,
          discount: 0,
          price: 0
        })
      } else {
        goodsLadderList.splice(index, 1)
      }
    },
    addGoodsLadder(index, row) {
      const goodsLadderList = this.value.goodsLadderList
      if (goodsLadderList.length < 3) {
        goodsLadderList.push({
          count: 0,
          discount: 0,
          price: 0
        })
      } else {
        this.$message({
          message: '最多只能添加三条',
          type: 'warning'
        })
      }
    },
    removeFullReduce(index, row) {
      const goodsFullReduceList = this.value.goodsFullReduceList
      if (goodsFullReduceList.length === 1) {
        goodsFullReduceList.pop()
        goodsFullReduceList.push({
          count: 0,
          discount: 0,
          price: 0
        })
      } else {
        goodsFullReduceList.splice(index, 1)
      }
    },
    addFullReduce(index, row) {
      const goodsFullReduceList = this.value.goodsFullReduceList
      if (goodsFullReduceList.length < 3) {
        goodsFullReduceList.push({
          count: 0,
          discount: 0,
          price: 0
        })
      } else {
        this.$message({
          message: '最多只能添加三条',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>
.dateClass{
  margin-top: 10px;
}
</style>
