<template>
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.orderStatus)" finish-status="success" align-center>
        <el-step :description="order.orderTime" title="提交订单"/>
        <el-step :description="order.payTime" title="支付订单"/>
        <el-step :description="order.deliveryTime" title="平台发货"/>
        <el-step :description="order.receiveTime" title="确认收货"/>
        <el-step :description="order.commentTime" title="完成评价"/>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"/>
        <span class="color-danger">当前订单状态：{{ order.orderStatus | formatStatus }}</span>
        <div v-show="order.orderStatus==='SW0701'" class="operate-button-container">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <!--          <el-button size="mini">修改商品信息</el-button>-->
          <el-button size="mini" @click="showUpdateMoneyDialog">修改费用信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showCloseOrderDialog">关闭订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
          <el-button size="mini" @click="showCancelOrderDialog">取消订单</el-button>
        </div>
        <div v-show="order.orderStatus==='SW0702'" class="operate-button-container">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showCancelOrderDialog">取消订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div v-show="order.orderStatus==='SW0703'||order.orderStatus==='SW0704'" class="operate-button-container">
          <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div v-show="order.orderStatus==='SW0708'" class="operate-button-container">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="sw-marker" style="color: #606266"/>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ order.orderNo }}</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">{{ order.customer.customerName }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.payChannel | formatPayType }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.afterStatus | formatAfterStatus }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.orderType | formatOrderType }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">配送方式</el-col>
          <el-col :span="4" class="table-cell-title">物流单号</el-col>
          <el-col :span="4" class="table-cell-title">自动确认收货时间</el-col>
          <el-col :span="4" class="table-cell-title">订单可得积分</el-col>
          <el-col :span="4" class="table-cell-title">订单可得成长值</el-col>
          <el-col :span="4" class="table-cell-title">活动信息</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ order.deliveryCompany | formatNull }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.deliveryNo | formatNull }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.autoConfirmDay }}天</el-col>
          <el-col :span="4" class="table-cell">{{ order.integration | formatNull }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.growth | formatNull }}</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover
              :content="order.promotionInfo"
              placement="top-start"
              title="活动信息"
              width="200"
              trigger="hover">
              <span slot="reference">{{ order.promotionInfo | formatLongText }}</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="sw-marker" style="color: #606266"/>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">邮政编码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ order.receiverName }}</el-col>
          <el-col :span="6" class="table-cell">{{ order.receiverPhone }}</el-col>
          <el-col :span="6" class="table-cell">{{ order.receiverPostCode }}</el-col>
          <el-col :span="6" class="table-cell">{{ order | formatAddress }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="sw-marker" style="color: #606266"/>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.orderDetails"
        style="width: 100%;margin-top: 20px"
        border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.pic" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.goodsName }}</p>
            <p>品牌：{{ scope.row.brandName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{ scope.row.goodsPrice }}</p>
            <p>货号：{{ scope.row.skuCode }}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.attributes }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{ scope.row.goodsPrice*scope.row.quantity }}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{ order.totalAmount }}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="sw-marker" style="color: #606266"/>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{ order.orderAmount }}</el-col>
          <el-col :span="6" class="table-cell">￥{{ order.logisticsFee }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.discountAmount }}</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.totalAmount }}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.payAmount }}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="sw-marker" style="color: #606266"/>
        <span class="font-small">操作信息</span>
      </div>
      <el-table
        ref="orderHistoryTable"
        :data="order.orderOperateLogs"
        style="margin-top: 20px;width: 100%"
        border>
        <el-table-column label="操作者" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.optUserName }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatPayStatus }}
          </template>
        </el-table-column>
        <el-table-column label="发货状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatDeliverStatus }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :visible.sync="receiverDialogVisible"
      title="修改收货人信息"
      width="40%">
      <el-form
        ref="receiverInfoForm"
        :model="receiverInfo"
        label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="所在区域：">
          <v-distpicker
            :province="receiverInfo.receiverProvince"
            :city="receiverInfo.receiverCity"
            :area="receiverInfo.receiverRegion"
            @selected="onSelectRegion"/>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="receiverDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="moneyDialogVisible"
      title="修改费用信息"
      width="50%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{ order.orderAmount }}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.logisticsFee" size="mini"><template slot="prepend">￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="mini"><template slot="prepend">-￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.totalAmount }}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.payAmount+moneyInfo.logisticsFee-moneyInfo.discountAmount }}</span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moneyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="messageDialogVisible"
      title="发送站内信"
      width="40%">
      <el-form
        ref="receiverInfoForm"
        :model="message"
        label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="closeDialogVisible"
      title="关闭订单"
      width="40%">
      <el-form
        :model="closeInfo"
        label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.note" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="markOrderDialogVisible"
      title="备注订单"
      width="40%">
      <el-form
        :model="markInfo"
        label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="cancelOrderDialogVisible"
      title="备注订单"
      width="40%">
      <el-form
        :model="cancelInfo"
        label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="cancelInfo.note" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCancelOrder">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"/>
  </div>
</template>
<script>
import { getOrderDetail, updateReceiverInfo, updateMoneyInfo, closeOrder, updateOrderNote, deleteOrder, cancelOrder } from '@/api/order/order/index'
import LogisticsDialog from '@/views/order/order/components/logisticsDialog'
import VDistpicker from 'v-distpicker'
const defaultReceiverInfo = {
  orderId: null,
  receiverName: null,
  receiverPhone: null,
  receiverPostCode: null,
  receiverDetailAddress: null,
  receiverProvince: null,
  receiverCity: null,
  receiverRegion: null,
  status: null
}
export default {
  name: 'OrderDetail',
  components: { VDistpicker, LogisticsDialog },
  filters: {
    formatNull(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无'
      } else {
        return value
      }
    },
    formatLongText(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无'
      } else if (value.length > 8) {
        return value.substr(0, 8) + '...'
      } else {
        return value
      }
    },
    formatOrderType(value) {
      if (value === 'SW0601') {
        return '线上订单'
      } else if (value === 'SW0602') {
        return '线下订单'
      }
    },
    formatAfterStatus(value) {
      if (value === 'SW0801') {
        return '未发起售后'
      } else if (value === 'SW0802') {
        return '申请售后'
      } else if (value === 'SW0803') {
        return '取消售后'
      } else if (value === 'SW0804') {
        return '售后处理中'
      } else if (value === 'SW0805') {
        return '拒绝售后'
      } else if (value === 'SW0806') {
        return '处理完成'
      }
    },
    formatAddress(order) {
      let str = order.receiverProvince
      if (order.receiverCity != null) {
        str += '  ' + order.receiverCity
      }
      str += '  ' + order.receiverRegion
      str += '  ' + order.receiverDetailAddress
      return str
    },
    formatStatus(value) {
      if (value === 'SW0702') {
        return '待发货'
      } else if (value === 'SW0703') {
        return '已发货'
      } else if (value === 'SW0704') {
        return '待评价'
      } else if (value === 'SW0706') {
        return '已完成'
      } else if (value === 'SW0707') {
        return '已取消'
      } else if (value === 'SW0708') {
        return '已关闭'
      } else if (value === 'SW0709') {
        return '无效订单'
      } else {
        return '待付款'
      }
    },
    formatPayType(value) {
      if (value === 'SW0901') {
        return '余额'
      } else if (value === 'SW0902') {
        return '微信'
      } else if (value === 'SW0903') {
        return '支付宝'
      } else if (value === 'SW0904') {
        return '银联'
      } else {
        return '未支付'
      }
    },
    formatPayStatus(value) {
      if (value === 'SW0701' || value === 'SW0707' || value === 'SW0708' || value === 'SW0709') {
        return '未支付'
      } else if (value === 'SW0710') {
        return '已退款'
      } else {
        return '已支付'
      }
    },
    formatDeliverStatus(value) {
      if (value === 'SW0701' || value === 'SW0702' || value === 'SW0707' || value === 'SW0708' || value === 'SW0709') {
        return '未发货'
      } else {
        return '已发货'
      }
    },
    formatProductAttr(value) {
      if (value == null) {
        return ''
      } else {
        const attr = JSON.parse(value)
        let result = ''
        for (let i = 0; i < attr.length; i++) {
          result += attr[i].key
          result += ':'
          result += attr[i].value
          result += ';'
        }
        return result
      }
    }
  },
  data() {
    return {
      id: null,
      order: {
        customer: {
          customerName: ''
        }
      },
      receiverDialogVisible: false,
      receiverInfo: Object.assign({}, defaultReceiverInfo),
      moneyDialogVisible: false,
      moneyInfo: { orderId: null, logisticsFee: 0, discountAmount: 0, status: null },
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markOrderDialogVisible: false,
      markInfo: { note: null },
      cancelInfo: { note: null },
      cancelOrderDialogVisible: false,
      logisticsDialogVisible: false
    }
  },
  created() {
    this.id = this.list = this.$route.query.id
    getOrderDetail(this.id).then(response => {
      console.log(response)
      this.order = response.data.order
      console.log(this.order)
    })
  },
  methods: {
    onSelectRegion(data) {
      this.receiverInfo.receiverProvince = data.province.value
      this.receiverInfo.receiverCity = data.city.value
      this.receiverInfo.receiverRegion = data.area.value
    },
    formatStepStatus(value) {
      if (value === 'SW0702') {
        // 待发货
        return 2
      } else if (value === 'SW0703') {
        // 已发货
        return 3
      } else if (value === 'SW0704') {
        // 已发货
        return 4
      } else if (value === 'SW0706') {
        // 已完成
        return 5
      } else {
        // 待付款、已关闭、无效订单
        return 1
      }
    },
    showUpdateReceiverDialog() {
      this.receiverDialogVisible = true
      this.receiverInfo = {
        orderId: this.order.id,
        receiverName: this.order.receiverName,
        receiverPhone: this.order.receiverPhone,
        receiverPostCode: this.order.receiverPostCode,
        receiverDetailAddress: this.order.receiverDetailAddress,
        receiverProvince: this.order.receiverProvince,
        receiverCity: this.order.receiverCity,
        receiverRegion: this.order.receiverRegion,
        status: this.order.orderStatus
      }
    },
    handleUpdateReceiverInfo() {
      this.$confirm('是否要修改收货信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateReceiverInfo(this.receiverInfo).then(response => {
          this.receiverDialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data.order
          })
        })
      })
    },
    showUpdateMoneyDialog() {
      this.moneyDialogVisible = true
      this.moneyInfo.orderId = this.order.id
      this.moneyInfo.logisticsFee = this.order.logisticsFee
      this.moneyInfo.discountAmount = this.order.discountAmount
      this.moneyInfo.status = this.order.orderStatus
    },
    handleUpdateMoneyInfo() {
      this.$confirm('是否要修改费用信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.moneyInfo)
        updateMoneyInfo(this.moneyInfo).then(response => {
          this.moneyDialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data.order
          })
        })
      })
    },
    showMessageDialog() {
      this.messageDialogVisible = true
      this.message.title = null
      this.message.content = null
    },
    handleSendMessage() {
      this.$confirm('是否要发送站内信?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.messageDialogVisible = false
        this.$message({
          type: 'success',
          message: '发送成功!'
        })
      })
    },
    showCloseOrderDialog() {
      this.closeDialogVisible = true
      this.closeInfo.note = null
      this.closeInfo.id = this.id
    },
    handleCloseOrder() {
      this.$confirm('是否要关闭?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('ids', [this.closeInfo.id])
        params.append('note', this.closeInfo.note)
        closeOrder(params).then(response => {
          this.closeDialogVisible = false
          this.$message({
            type: 'success',
            message: '订单关闭成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data.order
          })
        })
      })
    },
    showMarkOrderDialog() {
      this.markOrderDialogVisible = true
      this.markInfo.id = this.id
      this.markInfo.note = null
    },
    showCancelOrderDialog() {
      this.cancelOrderDialogVisible = true
      this.cancelInfo.id = this.id
      this.cancelInfo.note = null
    },
    handleMarkOrder() {
      this.$confirm('是否要备注订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('orderId', this.markInfo.id)
        params.append('note', this.markInfo.note)
        params.append('status', this.order.orderStatus)
        updateOrderNote(params).then(response => {
          this.markOrderDialogVisible = false
          this.$message({
            type: 'success',
            message: '订单备注成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data.order
          })
        })
      })
    },
    handleCancelOrder() {
      this.$confirm('是否要取消订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('orderId', this.cancelInfo.id)
        params.append('note', this.cancelInfo.note)
        cancelOrder(params).then(response => {
          this.cancelOrderDialogVisible = false
          this.$message({
            type: 'success',
            message: '订单取消成功!'
          })
          getOrderDetail(this.id).then(response => {
            this.order = response.data.order
          })
        })
      })
    },
    handleDeleteOrder() {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('ids', [this.id])
        deleteOrder(params).then(response => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          })
          this.$router.back()
        })
      })
    },
    showLogisticsDialog() {
      this.logisticsDialogVisible = true
    }
  }
}
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>

