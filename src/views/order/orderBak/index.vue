<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="orderManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_order_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkOrderId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单编码">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="用户ID">
        <template slot-scope="scope">
          <span>{{ scope.row.fkCustomerId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单类型   SW0601 线上  SW0602 线下">
        <template slot-scope="scope">
          <span>{{ scope.row.orderType }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单状态 SW0701 未付款 SW0702 已付款  SW0703 已收货 SW0704 已评价 SW0705 已完成 SW0706 已取消">
        <template slot-scope="scope">
          <span>{{ scope.row.orderStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="售后状态 SW0801 未发起售后 SW0802 申请售后 SW0803 取消售后 SW0804 售后处理中 SW0805 处理完成">
        <template slot-scope="scope">
          <span>{{ scope.row.afterStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="商品数量">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsCount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单总价">
        <template slot-scope="scope">
          <span>{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="支付金额">
        <template slot-scope="scope">
          <span>{{ scope.row.payAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最终金额">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="运费金额">
        <template slot-scope="scope">
          <span>{{ scope.row.logisticsFee }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="收货地址">
        <template slot-scope="scope">
          <span>{{ scope.row.fkAddressId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="支付渠道 SW0901 余额 SW0902 微信 SW0903 支付宝 SW0904 银联">
        <template slot-scope="scope">
          <span>{{ scope.row.payChannel }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单支付单号">
        <template slot-scope="scope">
          <span>{{ scope.row.tradeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="第三方支付流水">
        <template slot-scope="scope">
          <span>{{ scope.row.escrowTradeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="支付时间">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.orderTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="发货时间">
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="确认状态">
        <template slot-scope="scope">
          <span>{{ scope.row.confirmStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="收货时间">
        <template slot-scope="scope">
          <span>{{ scope.row.receiveTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="评论时间">
        <template slot-scope="scope">
          <span>{{ scope.row.commentTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单结算状态 SW1101 未结算 SW1102 已结算">
        <template slot-scope="scope">
          <span>{{ scope.row.settlementStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单结算时间">
        <template slot-scope="scope">
          <span>{{ scope.row.settlementTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="优惠券">
        <template slot-scope="scope">
          <span>{{ scope.row.fkCouponId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="促销优化金额（促销价、满减、阶梯价）">
        <template slot-scope="scope">
          <span>{{ scope.row.promotionAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="积分抵扣金额">
        <template slot-scope="scope">
          <span>{{ scope.row.integrationAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="优惠券抵扣金额">
        <template slot-scope="scope">
          <span>{{ scope.row.couponAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="管理员后台调整订单使用的折扣金额">
        <template slot-scope="scope">
          <span>{{ scope.row.discountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="自动确认时间（天）">
        <template slot-scope="scope">
          <span>{{ scope.row.autoConfirmDay }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="可以获得的积分">
        <template slot-scope="scope">
          <span>{{ scope.row.integration }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="可以获得的成长值">
        <template slot-scope="scope">
          <span>{{ scope.row.growth }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="活动信息">
        <template slot-scope="scope">
          <span>{{ scope.row.promotionInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="发票类型：0->不开发票；1->电子发票；2->纸质发票">
        <template slot-scope="scope">
          <span>{{ scope.row.billType }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="发票抬头">
        <template slot-scope="scope">
          <span>{{ scope.row.billHeader }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="发票内容">
        <template slot-scope="scope">
          <span>{{ scope.row.billContent }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="收票人电话">
        <template slot-scope="scope">
          <span>{{ scope.row.billReceiverPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="收票人邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.billReceiverEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="是否积分产品">
        <template slot-scope="scope">
          <span>{{ scope.row.isIntegral }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单备注">
        <template slot-scope="scope">
          <span>{{ scope.row.orderRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="orderManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="orderManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="订单编码" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单编码"/>
        </el-form-item>
        <el-form-item label="用户ID" prop="fkCustomerId">
          <el-input v-model="form.fkCustomerId" placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item label="订单类型   SW0601 线上  SW0602 线下" prop="orderType">
          <el-input v-model="form.orderType" placeholder="请输入订单类型   SW0601 线上  SW0602 线下"/>
        </el-form-item>
        <el-form-item label="订单状态 SW0701 未付款 SW0702 已付款  SW0703 已收货 SW0704 已评价 SW0705 已完成 SW0706 已取消" prop="orderStatus">
          <el-input v-model="form.orderStatus" placeholder="请输入订单状态 SW0701 未付款 SW0702 已付款  SW0703 已收货 SW0704 已评价 SW0705 已完成 SW0706 已取消"/>
        </el-form-item>
        <el-form-item label="售后状态 SW0801 未发起售后 SW0802 申请售后 SW0803 取消售后 SW0804 售后处理中 SW0805 处理完成" prop="afterStatus">
          <el-input v-model="form.afterStatus" placeholder="请输入售后状态 SW0801 未发起售后 SW0802 申请售后 SW0803 取消售后 SW0804 售后处理中 SW0805 处理完成"/>
        </el-form-item>
        <el-form-item label="商品数量" prop="goodsCount">
          <el-input v-model="form.goodsCount" placeholder="请输入商品数量"/>
        </el-form-item>
        <el-form-item label="订单总价" prop="orderAmount">
          <el-input v-model="form.orderAmount" placeholder="请输入订单总价"/>
        </el-form-item>
        <el-form-item label="支付金额" prop="payAmount">
          <el-input v-model="form.payAmount" placeholder="请输入支付金额"/>
        </el-form-item>
        <el-form-item label="最终金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入最终金额"/>
        </el-form-item>
        <el-form-item label="运费金额" prop="logisticsFee">
          <el-input v-model="form.logisticsFee" placeholder="请输入运费金额"/>
        </el-form-item>
        <el-form-item label="收货地址" prop="fkAddressId">
          <el-input v-model="form.fkAddressId" placeholder="请输入收货地址"/>
        </el-form-item>
        <el-form-item label="支付渠道 SW0901 余额 SW0902 微信 SW0903 支付宝 SW0904 银联" prop="payChannel">
          <el-input v-model="form.payChannel" placeholder="请输入支付渠道 SW0901 余额 SW0902 微信 SW0903 支付宝 SW0904 银联"/>
        </el-form-item>
        <el-form-item label="订单支付单号" prop="tradeNo">
          <el-input v-model="form.tradeNo" placeholder="请输入订单支付单号"/>
        </el-form-item>
        <el-form-item label="第三方支付流水" prop="escrowTradeNo">
          <el-input v-model="form.escrowTradeNo" placeholder="请输入第三方支付流水"/>
        </el-form-item>
        <el-form-item label="支付时间" prop="payTime">
          <el-input v-model="form.payTime" placeholder="请输入支付时间"/>
        </el-form-item>
        <el-form-item label="订单创建时间" prop="orderTime">
          <el-input v-model="form.orderTime" placeholder="请输入订单创建时间"/>
        </el-form-item>
        <el-form-item label="发货时间" prop="deliveryTime">
          <el-input v-model="form.deliveryTime" placeholder="请输入发货时间"/>
        </el-form-item>
        <el-form-item label="确认状态" prop="confirmStatus">
          <el-input v-model="form.confirmStatus" placeholder="请输入确认状态"/>
        </el-form-item>
        <el-form-item label="收货时间" prop="receiveTime">
          <el-input v-model="form.receiveTime" placeholder="请输入收货时间"/>
        </el-form-item>
        <el-form-item label="评论时间" prop="commentTime">
          <el-input v-model="form.commentTime" placeholder="请输入评论时间"/>
        </el-form-item>
        <el-form-item label="订单结算状态 SW1101 未结算 SW1102 已结算" prop="settlementStatus">
          <el-input v-model="form.settlementStatus" placeholder="请输入订单结算状态 SW1101 未结算 SW1102 已结算"/>
        </el-form-item>
        <el-form-item label="订单结算时间" prop="settlementTime">
          <el-input v-model="form.settlementTime" placeholder="请输入订单结算时间"/>
        </el-form-item>
        <el-form-item label="优惠券" prop="fkCouponId">
          <el-input v-model="form.fkCouponId" placeholder="请输入优惠券"/>
        </el-form-item>
        <el-form-item label="促销优化金额（促销价、满减、阶梯价）" prop="promotionAmount">
          <el-input v-model="form.promotionAmount" placeholder="请输入促销优化金额（促销价、满减、阶梯价）"/>
        </el-form-item>
        <el-form-item label="积分抵扣金额" prop="integrationAmount">
          <el-input v-model="form.integrationAmount" placeholder="请输入积分抵扣金额"/>
        </el-form-item>
        <el-form-item label="优惠券抵扣金额" prop="couponAmount">
          <el-input v-model="form.couponAmount" placeholder="请输入优惠券抵扣金额"/>
        </el-form-item>
        <el-form-item label="管理员后台调整订单使用的折扣金额" prop="discountAmount">
          <el-input v-model="form.discountAmount" placeholder="请输入管理员后台调整订单使用的折扣金额"/>
        </el-form-item>
        <el-form-item label="自动确认时间（天）" prop="autoConfirmDay">
          <el-input v-model="form.autoConfirmDay" placeholder="请输入自动确认时间（天）"/>
        </el-form-item>
        <el-form-item label="可以获得的积分" prop="integration">
          <el-input v-model="form.integration" placeholder="请输入可以获得的积分"/>
        </el-form-item>
        <el-form-item label="可以获得的成长值" prop="growth">
          <el-input v-model="form.growth" placeholder="请输入可以获得的成长值"/>
        </el-form-item>
        <el-form-item label="活动信息" prop="promotionInfo">
          <el-input v-model="form.promotionInfo" placeholder="请输入活动信息"/>
        </el-form-item>
        <el-form-item label="发票类型：0->不开发票；1->电子发票；2->纸质发票" prop="billType">
          <el-input v-model="form.billType" placeholder="请输入发票类型：0->不开发票；1->电子发票；2->纸质发票"/>
        </el-form-item>
        <el-form-item label="发票抬头" prop="billHeader">
          <el-input v-model="form.billHeader" placeholder="请输入发票抬头"/>
        </el-form-item>
        <el-form-item label="发票内容" prop="billContent">
          <el-input v-model="form.billContent" placeholder="请输入发票内容"/>
        </el-form-item>
        <el-form-item label="收票人电话" prop="billReceiverPhone">
          <el-input v-model="form.billReceiverPhone" placeholder="请输入收票人电话"/>
        </el-form-item>
        <el-form-item label="收票人邮箱" prop="billReceiverEmail">
          <el-input v-model="form.billReceiverEmail" placeholder="请输入收票人邮箱"/>
        </el-form-item>
        <el-form-item label="是否积分产品" prop="isIntegral">
          <el-input v-model="form.isIntegral" placeholder="请输入是否积分产品"/>
        </el-form-item>
        <el-form-item label="订单备注" prop="orderRemark">
          <el-input v-model="form.orderRemark" placeholder="请输入订单备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/order/order/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Order',
  data() {
    return {
      form: {
        orderNo: undefined,
        fkCustomerId: undefined,
        orderType: undefined,
        orderStatus: undefined,
        afterStatus: undefined,
        goodsCount: undefined,
        orderAmount: undefined,
        payAmount: undefined,
        totalAmount: undefined,
        logisticsFee: undefined,
        fkAddressId: undefined,
        payChannel: undefined,
        tradeNo: undefined,
        escrowTradeNo: undefined,
        payTime: undefined,
        orderTime: undefined,
        deliveryTime: undefined,
        confirmStatus: undefined,
        receiveTime: undefined,
        commentTime: undefined,
        settlementStatus: undefined,
        settlementTime: undefined,
        fkCouponId: undefined,
        promotionAmount: undefined,
        integrationAmount: undefined,
        couponAmount: undefined,
        discountAmount: undefined,
        autoConfirmDay: undefined,
        integration: undefined,
        growth: undefined,
        promotionInfo: undefined,
        billType: undefined,
        billHeader: undefined,
        billContent: undefined,
        billReceiverPhone: undefined,
        billReceiverEmail: undefined,
        isIntegral: undefined,
        orderRemark: undefined
      },
      rules: {
        orderNo: [
          {
            required: true,
            message: '请输入订单编码',
            trigger: 'blur'
          }
        ], fkCustomerId: [
          {
            required: true,
            message: '请输入用户ID',
            trigger: 'blur'
          }
        ], orderType: [
          {
            required: true,
            message: '请输入订单类型   SW0601 线上  SW0602 线下',
            trigger: 'blur'
          }
        ], orderStatus: [
          {
            required: true,
            message: '请输入订单状态 SW0701 未付款 SW0702 已付款  SW0703 已收货 SW0704 已评价 SW0705 已完成 SW0706 已取消',
            trigger: 'blur'
          }
        ], afterStatus: [
          {
            required: true,
            message: '请输入售后状态 SW0801 未发起售后 SW0802 申请售后 SW0803 取消售后 SW0804 售后处理中 SW0805 处理完成',
            trigger: 'blur'
          }
        ], goodsCount: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ], orderAmount: [
          {
            required: true,
            message: '请输入订单总价',
            trigger: 'blur'
          }
        ], payAmount: [
          {
            required: true,
            message: '请输入支付金额',
            trigger: 'blur'
          }
        ], totalAmount: [
          {
            required: true,
            message: '请输入最终金额',
            trigger: 'blur'
          }
        ], logisticsFee: [
          {
            required: true,
            message: '请输入运费金额',
            trigger: 'blur'
          }
        ], fkAddressId: [
          {
            required: true,
            message: '请输入收货地址',
            trigger: 'blur'
          }
        ], payChannel: [
          {
            required: true,
            message: '请输入支付渠道 SW0901 余额 SW0902 微信 SW0903 支付宝 SW0904 银联',
            trigger: 'blur'
          }
        ], tradeNo: [
          {
            required: true,
            message: '请输入订单支付单号',
            trigger: 'blur'
          }
        ], escrowTradeNo: [
          {
            required: true,
            message: '请输入第三方支付流水',
            trigger: 'blur'
          }
        ], payTime: [
          {
            required: true,
            message: '请输入支付时间',
            trigger: 'blur'
          }
        ], orderTime: [
          {
            required: true,
            message: '请输入订单创建时间',
            trigger: 'blur'
          }
        ], deliveryTime: [
          {
            required: true,
            message: '请输入发货时间',
            trigger: 'blur'
          }
        ], confirmStatus: [
          {
            required: true,
            message: '请输入确认状态',
            trigger: 'blur'
          }
        ], receiveTime: [
          {
            required: true,
            message: '请输入收货时间',
            trigger: 'blur'
          }
        ], commentTime: [
          {
            required: true,
            message: '请输入评论时间',
            trigger: 'blur'
          }
        ], settlementStatus: [
          {
            required: true,
            message: '请输入订单结算状态 SW1101 未结算 SW1102 已结算',
            trigger: 'blur'
          }
        ], settlementTime: [
          {
            required: true,
            message: '请输入订单结算时间',
            trigger: 'blur'
          }
        ], fkCouponId: [
          {
            required: true,
            message: '请输入优惠券',
            trigger: 'blur'
          }
        ], promotionAmount: [
          {
            required: true,
            message: '请输入促销优化金额（促销价、满减、阶梯价）',
            trigger: 'blur'
          }
        ], integrationAmount: [
          {
            required: true,
            message: '请输入积分抵扣金额',
            trigger: 'blur'
          }
        ], couponAmount: [
          {
            required: true,
            message: '请输入优惠券抵扣金额',
            trigger: 'blur'
          }
        ], discountAmount: [
          {
            required: true,
            message: '请输入管理员后台调整订单使用的折扣金额',
            trigger: 'blur'
          }
        ], autoConfirmDay: [
          {
            required: true,
            message: '请输入自动确认时间（天）',
            trigger: 'blur'
          }
        ], integration: [
          {
            required: true,
            message: '请输入可以获得的积分',
            trigger: 'blur'
          }
        ], growth: [
          {
            required: true,
            message: '请输入可以获得的成长值',
            trigger: 'blur'
          }
        ], promotionInfo: [
          {
            required: true,
            message: '请输入活动信息',
            trigger: 'blur'
          }
        ], billType: [
          {
            required: true,
            message: '请输入发票类型：0->不开发票；1->电子发票；2->纸质发票',
            trigger: 'blur'
          }
        ], billHeader: [
          {
            required: true,
            message: '请输入发票抬头',
            trigger: 'blur'
          }
        ], billContent: [
          {
            required: true,
            message: '请输入发票内容',
            trigger: 'blur'
          }
        ], billReceiverPhone: [
          {
            required: true,
            message: '请输入收票人电话',
            trigger: 'blur'
          }
        ], billReceiverEmail: [
          {
            required: true,
            message: '请输入收票人邮箱',
            trigger: 'blur'
          }
        ], isIntegral: [
          {
            required: true,
            message: '请输入是否积分产品',
            trigger: 'blur'
          }
        ], orderRemark: [
          {
            required: true,
            message: '请输入订单备注',
            trigger: 'blur'
          }
        ] },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      orderManager_btn_edit: false,
      orderManager_btn_del: false,
      orderManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false
    }
  },
  created() {
    this.getList()
    this.orderManager_btn_edit = this.elements['order:order:edit']
    this.orderManager_btn_del = this.elements['order:order:delete']
    this.orderManager_btn_add = this.elements['order:order:add']
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getObj(row.pkOrderId).then(response => {
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
        delObj(row.pkOrderId)
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
            this.getList()
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
          putObj(this.form.pkOrderId, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
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
        orderNo: undefined,
        fkCustomerId: undefined,
        orderType: undefined,
        orderStatus: undefined,
        afterStatus: undefined,
        goodsCount: undefined,
        orderAmount: undefined,
        payAmount: undefined,
        totalAmount: undefined,
        logisticsFee: undefined,
        fkAddressId: undefined,
        payChannel: undefined,
        tradeNo: undefined,
        escrowTradeNo: undefined,
        payTime: undefined,
        orderTime: undefined,
        deliveryTime: undefined,
        confirmStatus: undefined,
        receiveTime: undefined,
        commentTime: undefined,
        settlementStatus: undefined,
        settlementTime: undefined,
        fkCouponId: undefined,
        promotionAmount: undefined,
        integrationAmount: undefined,
        couponAmount: undefined,
        discountAmount: undefined,
        autoConfirmDay: undefined,
        integration: undefined,
        growth: undefined,
        promotionInfo: undefined,
        billType: undefined,
        billHeader: undefined,
        billContent: undefined,
        billReceiverPhone: undefined,
        billReceiverEmail: undefined,
        isIntegral: undefined,
        orderRemark: undefined
      }
    }
  }
}
</script>
