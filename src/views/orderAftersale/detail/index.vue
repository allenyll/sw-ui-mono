<template>
  <div class="detail-container">
    <el-card shadow="never">
      <span class="font-title-medium">售后商品</span>
      <el-table
        ref="productTable"
        :data="goodsList"
        border
        class="standard-margin">
        <el-table-column label="商品图片" width="160" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.goodsFile" style="height:80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span class="font-small">{{ scope.row.goodsName }}</span><br>
            <span class="font-small">品牌：{{ scope.row.brandName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <span class="font-small">价格：￥{{ scope.row.goodsPrice }}</span><br>
            <span class="font-small">货号：NO.{{ scope.row.goodsCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.attributes }}</template>
        </el-table-column>
        <el-table-column label="申请数量" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.refundQuality }}</template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="center">
          <template slot-scope="scope">￥{{ totalAmount }}</template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top:15px;margin-bottom:15px">
        <span class="font-title-medium">合计：</span>
        <span class="font-title-medium color-danger">￥{{ totalAmount }}</span>
      </div>
    </el-card>
    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">申请单信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">申请单号</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.aftersaleNo }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">订单编号
          </el-col>
          <el-col :span="18" class="form-border font-small el-height">
            <router-link :to="{ path:'/order/orderDetail',query: {id:orderAftersale.orderId} }">
              <font color="blue">{{ orderAftersale.orderNo }}</font>
            </router-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">申请状态</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ orderAftersale.aftersaleStatus | formatStatus }}</el-col>
          <el-col :span="6" class="form-border form-left-bg font-small">售后类型</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ orderAftersale.aftersaleType | formatType }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">申请人</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ orderAftersale.customerName }}</el-col>
          <el-col :span="6" class="form-border form-left-bg font-small">申请时间</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ orderAftersale.applyTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">联系人</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ order.receiverName }}</el-col>
          <el-col :span="6" class="form-border form-left-bg font-small">联系电话</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ order.receiverPhone }}</el-col>
        </el-row>
        <el-row v-show="orderAftersale.cancelTime">
          <el-col :span="6" class="form-border form-left-bg font-small">取消时间</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.cancelTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small height-75">退货原因</el-col>
          <el-col :span="18" class="form-border font-small"><el-input v-model="orderAftersale.aftersaleReason" type="textarea" disabled resize="none" /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small height-75">问题描述</el-col>
          <el-col :span="18" class="form-border font-small"><el-input v-model="orderAftersale.refundRemark" type="textarea" disabled resize="none" /></el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:100px;line-height:80px">凭证图片
          </el-col>
          <el-col :span="18" class="form-border font-small" style="height:100px">
            <img v-for="item in applyFile" :key="item.id" :src="item.fileUrl" style="width:80px; height:80px; margin-left: 5px;">
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">申请单金额</el-col>
          <el-col v-show="orderAftersale.aftersaleType !== 'SW2902'" :span="18" class="form-border font-small el-height">￥{{ totalAmount }}</el-col>
          <el-col v-show="orderAftersale.aftersaleType === 'SW2902'" :span="18" class="form-border font-small el-height">￥0</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:52px;line-height:32px">确认退款金额
          </el-col>
          <el-col :span="18" class="form-border font-small el-height" style="height:52px">
            ￥
            <el-input
              v-model="updateStatusParam.refundAmount"
              :disabled="orderAftersale.aftersaleType === 'SW2902' || orderAftersale.aftersaleStatus !== 'SW0802'"
              size="small"
              style="width:200px;margin-left: 10px"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">退款方式</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ orderAftersale.refundType | formatRefundType }}</el-col>
          <el-col :span="6" class="form-border form-left-bg font-small">退还积分</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ orderAftersale.refundPoint }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">使用的积分可抵扣金额</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ orderAftersale.usePointAmount }}</el-col>
          <el-col :span="6" class="form-border form-left-bg font-small">获得的积分可抵扣金额</el-col>
          <el-col :span="6" class="form-border font-small el-height">{{ orderAftersale.getPointAmount }}</el-col>
        </el-row>
        <div v-show="orderAftersale.aftersaleType !== 'SW2901'">
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small" style="height:52px;line-height:32px">选择收货点
            </el-col>
            <el-col :span="18" class="form-border font-small el-height" style="height:52px">
              <el-select
                v-model="updateStatusParam.companyAddressId"
                disabled
                size="small"
                style="width:200px">
                <el-option
                  v-for="address in companyAddressList"
                  :key="address.id"
                  :value="address.id"
                  :label="address.deliveryPoint"/>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">收货人姓名</el-col>
            <el-col :span="18" class="form-border font-small el-height">{{ currentAddress.receiverName }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">所在区域</el-col>
            <el-col :span="18" class="form-border font-small el-height">{{ currentAddress.receiverProvince }}{{ currentAddress.receiverCity }}{{ currentAddress.receiverRegion }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">详细地址</el-col>
            <el-col :span="18" class="form-border font-small el-height">{{ currentAddress.receiverDetailAddress }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">联系电话</el-col>
            <el-col :span="18" class="form-border font-small el-height">{{ currentAddress.receiverPhone }}</el-col>
          </el-row>
        </div>
      </div>
      <div v-show="orderAftersale.aftersaleStatus !== 'SW0802'" class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">处理人员</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.dealUserName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">处理时间</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.dealTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small height-75">处理备注</el-col>
          <el-col :span="18" class="form-border font-small"><el-input v-model="orderAftersale.dealNote" type="textarea" disabled resize="none" /></el-col>
        </el-row>
      </div>
      <div v-show="orderAftersale.aftersaleStatus === 'SW0806' && orderAftersale.aftersaleType != 'SW2901'" class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">收货人员</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.receiverName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" >收货时间</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.receiverTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small height-75">收货备注</el-col>
          <el-col :span="18" class="form-border font-small"><el-input v-model="orderAftersale.receiverNote" type="textarea" disabled resize="none" /></el-col>
        </el-row>
      </div>
      <div v-show="orderAftersale.aftersaleStatus === 'SW0802'" class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small height-75">处理备注</el-col>
          <el-col :span="18" class="form-border font-small"><el-input v-model="updateStatusParam.dealNote" type="textarea" resize="none" /></el-col>
        </el-row>
      </div>
      <div v-show="orderAftersale.aftersaleStatus === 'SW0804'" class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" >快递公司</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.deliveryCompany }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" >快递单号</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.deliveryNo }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" >发货时间</el-col>
          <el-col :span="18" class="form-border font-small el-height">{{ orderAftersale.deliveryTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small height-75">收货备注</el-col>
          <el-col :span="18" class="form-border font-small"><el-input v-model="updateStatusParam.receiverNote" type="textarea" resize="none" /></el-col>
        </el-row>
      </div>
      <div v-show="orderAftersale.aftersaleStatus === 'SW0802'" style="margin-top:15px;text-align: center">
        <el-button v-show="orderAftersale.aftersaleType === 'SW2901'" type="primary" size="small" @click="handleUpdateStatus('SW0806')">确认退款</el-button>
        <el-button v-show="orderAftersale.aftersaleType === 'SW2901'" type="danger" size="small" @click="showRefuseRefunsDialog">拒绝退款</el-button>
        <el-button v-show="orderAftersale.aftersaleType === 'SW2902'" type="primary" size="small" @click="handleUpdateStatus('SW0804')">确认换货</el-button>
        <el-button v-show="orderAftersale.aftersaleType === 'SW2902'" type="danger" size="small" @click="showRefuseRefunsDialog">拒绝换货</el-button>
        <el-button v-show="orderAftersale.aftersaleType === 'SW2903'" type="primary" size="small" @click="handleUpdateStatus('SW0804')">确认退款退货</el-button>
        <el-button v-show="orderAftersale.aftersaleType === 'SW2903'" type="danger" size="small" @click="showRefuseRefunsDialog">拒绝退款退货</el-button>
      </div>
      <div v-show="orderAftersale.aftersaleStatus === 'SW0804'" style="margin-top:15px;text-align: center">
        <el-button type="primary" size="small" @click="handleUpdateStatus('SW0806')">确认收货</el-button>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="confirmRefundDialogVisible"
      title="拒绝"
      width="40%">
      <el-form
        :model="updateStatusParam"
        label-width="150px">
        <el-form-item label="拒绝原因">
          <el-input v-model="updateStatusParam.refuseReason" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmRefundDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateStatus('SW0805')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getObj, updateAftersaleStatus } from '@/api/orderAftersale/index'

const defaultUpdateStatusParam = {
  companyAddressId: 0,
  dealUserName: '',
  dealNote: null,
  refundAmount: 0,
  aftersaleStatus: 0,
  refuseReason: ''
}
const defaultOrderAftersale = {
  id: null,
  orderId: null,
  companyAddressId: null,
  goodsId: null,
  orderNo: null,
  createTime: null,
  customerName: null,
  refundAmount: null,
  returnName: null,
  returnPhone: null,
  aftersaleStatus: null,
  handleTime: null,
  productPic: null,
  productName: null,
  productBrand: null,
  productAttr: null,
  productCount: null,
  productPrice: null,
  productRealPrice: null,
  reason: null,
  description: null,
  applyFile: null,
  handleNote: null,
  handleMan: null,
  receiveMan: null,
  receiveTime: null,
  receiverNote: null
}
export default {
  name: 'ReturnApplyDetail',
  filters: {
    formatType: function(val) {
      const map = {
        'SW2901': '退款',
        'SW2902': '换货',
        'SW2903': '退款换货'
      }
      return map[val]
    },
    formatRefundType: function(val) {
      const map = {
        'SW3001': '原路返回',
        'SW3002': '退还至余额',
        'SW3003': '手动处理'
      }
      return map[val]
    },
    formatStatus: function(val) {
      const map = {
        'SW0801': '未发起售后',
        'SW0802': '申请售后',
        'SW0803': '取消售后',
        'SW0804': '售后处理中',
        'SW0805': '拒绝售后',
        'SW0806': '处理完成'
      }
      return map[val]
    }
  },
  data() {
    return {
      id: null,
      confirmRefundDialogVisible: false,
      orderAftersale: Object.assign({}, defaultOrderAftersale),
      goodsList: [],
      order: {},
      orderDetail: {},
      applyFile: null,
      aftersaleType: '',
      aftersaleReason: '',
      updateStatusParam: Object.assign({}, defaultUpdateStatusParam),
      companyAddressList: [
        {
          id: 0,
          deliveryPoint: 'SNU CHIC发货点'
        }
      ],
      currentAddress: {
        receiverName: '孙丹丹',
        receiverPhone: '15605166821',
        receiverPostCode: '',
        receiverProvince: '江苏省',
        receiverCity: '南京市',
        receiverRegion: '秦淮区',
        receiverDetailAddress: '环北批发市场二期二楼338'
      }
    }
  },
  computed: {
    totalAmount() {
      if (this.orderAftersale != null) {
        return this.orderAftersale.goodsPrice * this.orderAftersale.refundQuality
      } else {
        return 0
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getDetail()
  },
  methods: {
    handleViewOrder() {
      this.$router.push({ path: '/oms/orderDetail', query: { id: this.orderAftersale.orderId }})
    },
    getDetail() {
      getObj(this.id).then(res => {
        console.log(res)
        this.orderAftersale = res.data
        this.goodsList = []
        this.goodsList.push(this.orderAftersale)
        this.applyFile = res.data.applyFiles
        this.aftersaleType = res.data.aftersaleType
        this.aftersaleReason = res.data.aftersaleReason
        this.order = Object.assign({}, res.data.order)
        console.log(this.order)
        this.orderDetail = Object.assign({}, res.data.orderDetail)

        // 退货中和完成
        if (this.orderAftersale.aftersaleStatus === 'SW0804' || this.orderAftersale.aftersaleStatus === 'SW0806') {
          this.updateStatusParam.refundAmount = this.orderAftersale.refundAmount / 100
          this.updateStatusParam.companyAddressId = 0
        }
        // this.getCompanyAddressList()
      })
    },
    showRefuseRefunsDialog() {
      this.confirmRefundDialogVisible = true
      this.updateStatusParam.refuseReason = ''
    },
    // getCompanyAddressList() {
    //   fetchList().then(response => {
    //     console.log('getCompanyAddressList()')
    //     this.companyAddressList = response.data
    //     for (let i = 0; i < this.companyAddressList.length; i++) {
    //       if (this.companyAddressList[i].receiveStatus === 1 && this.orderAftersale.status === 0) {
    //         this.updateStatusParam.companyAddressId = this.companyAddressList[i].id
    //       }
    //     }
    //   })
    // },
    handleUpdateStatus(status) {
      this.updateStatusParam.aftersaleStatus = status
      let param
      if (this.aftersaleType !== 'SW2901') {
        param = {
          ...this.updateStatusParam,
          ...this.currentAddress
        }
      } else {
        param = {
          ...this.updateStatusParam
        }
      }
      param.id = this.id
      param.aftersaleType = this.aftersaleType
      param.aftersaleReason = this.aftersaleReason
      this.$confirm('是否要进行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateAftersaleStatus(param).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '操作成功!',
              duration: 1000
            })
            this.$router.back()
          } else {
            this.$message({
              type: 'error',
              message: res.message,
              duration: 1000
            })
          }
        })
      })
    }
  }
}
</script>
<style scoped>
  .detail-container {
    /* position: absolute; */
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }

  .standard-margin {
    margin-top: 15px;
  }
  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
  }

  .form-left-bg {
    background: #F2F6FC;
  }

  .el-height {
    height: 39px;
  }

  .height-75 {
    height: 75px;
    line-height: 55px;
  }

</style>

