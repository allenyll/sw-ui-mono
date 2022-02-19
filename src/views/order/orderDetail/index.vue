<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.like_name"> </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="orderDetailManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="pk_order_detail_id" v-if="show">
            <template slot-scope="scope">
              <span>{{scope.row.pkOrderDetailId}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="订单Id">
            <template slot-scope="scope">
              <span>{{scope.row.fkOrderId}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="订单编码">
            <template slot-scope="scope">
              <span>{{scope.row.orderNo}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品id">
            <template slot-scope="scope">
              <span>{{scope.row.fkGoodsId}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品名称">
            <template slot-scope="scope">
              <span>{{scope.row.goodsName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品价格">
            <template slot-scope="scope">
              <span>{{scope.row.goodsPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品数量">
            <template slot-scope="scope">
              <span>{{scope.row.quantity}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品总价">
            <template slot-scope="scope">
              <span>{{scope.row.totalAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品品牌">
            <template slot-scope="scope">
              <span>{{scope.row.brandname}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品图片">
            <template slot-scope="scope">
              <span>{{scope.row.pic}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="库存计算方式(10下单减库存 20付款减库存)">
            <template slot-scope="scope">
              <span>{{scope.row.deductStockType}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="SKU ID">
            <template slot-scope="scope">
              <span>{{scope.row.fkSkuId}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="SKU 编码">
            <template slot-scope="scope">
              <span>{{scope.row.skucode}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品属性">
            <template slot-scope="scope">
              <span>{{scope.row.specvalue}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品重量">
            <template slot-scope="scope">
              <span>{{scope.row.goodsWeight}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品划线价">
            <template slot-scope="scope">
              <span>{{scope.row.linePrice}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="优惠名称">
            <template slot-scope="scope">
              <span>{{scope.row.promotionName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品促销分解金额">
            <template slot-scope="scope">
              <span>{{scope.row.promotionAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="优惠券优惠分解金额">
            <template slot-scope="scope">
              <span>{{scope.row.couponAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="积分优惠分解金额">
            <template slot-scope="scope">
              <span>{{scope.row.integrationAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="积分优惠分解金额">
            <template slot-scope="scope">
              <span>{{scope.row.realAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品详情">
            <template slot-scope="scope">
              <span>{{scope.row.content}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="备注">
            <template slot-scope="scope">
              <span>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="orderDetailManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="orderDetailManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="订单Id" prop="fkOrderId">
              <el-input v-model="form.fkOrderId" placeholder="请输入订单Id"></el-input>
            </el-form-item>
            <el-form-item label="订单编码" prop="orderNo">
              <el-input v-model="form.orderNo" placeholder="请输入订单编码"></el-input>
            </el-form-item>
            <el-form-item label="商品id" prop="fkGoodsId">
              <el-input v-model="form.fkGoodsId" placeholder="请输入商品id"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="form.goodsName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goodsPrice">
              <el-input v-model="form.goodsPrice" placeholder="请输入商品价格"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="quantity">
              <el-input v-model="form.quantity" placeholder="请输入商品数量"></el-input>
            </el-form-item>
            <el-form-item label="商品总价" prop="totalAmount">
              <el-input v-model="form.totalAmount" placeholder="请输入商品总价"></el-input>
            </el-form-item>
            <el-form-item label="商品品牌" prop="brandname">
              <el-input v-model="form.brandname" placeholder="请输入商品品牌"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="pic">
              <el-input v-model="form.pic" placeholder="请输入商品图片"></el-input>
            </el-form-item>
            <el-form-item label="库存计算方式(10下单减库存 20付款减库存)" prop="deductStockType">
              <el-input v-model="form.deductStockType" placeholder="请输入库存计算方式(10下单减库存 20付款减库存)"></el-input>
            </el-form-item>
            <el-form-item label="SKU ID" prop="fkSkuId">
              <el-input v-model="form.fkSkuId" placeholder="请输入SKU ID"></el-input>
            </el-form-item>
            <el-form-item label="SKU 编码" prop="skucode">
              <el-input v-model="form.skucode" placeholder="请输入SKU 编码"></el-input>
            </el-form-item>
            <el-form-item label="商品属性" prop="specvalue">
              <el-input v-model="form.specvalue" placeholder="请输入商品属性"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goodsWeight">
              <el-input v-model="form.goodsWeight" placeholder="请输入商品重量"></el-input>
            </el-form-item>
            <el-form-item label="商品划线价" prop="linePrice">
              <el-input v-model="form.linePrice" placeholder="请输入商品划线价"></el-input>
            </el-form-item>
            <el-form-item label="优惠名称" prop="promotionName">
              <el-input v-model="form.promotionName" placeholder="请输入优惠名称"></el-input>
            </el-form-item>
            <el-form-item label="商品促销分解金额" prop="promotionAmount">
              <el-input v-model="form.promotionAmount" placeholder="请输入商品促销分解金额"></el-input>
            </el-form-item>
            <el-form-item label="优惠券优惠分解金额" prop="couponAmount">
              <el-input v-model="form.couponAmount" placeholder="请输入优惠券优惠分解金额"></el-input>
            </el-form-item>
            <el-form-item label="积分优惠分解金额" prop="integrationAmount">
              <el-input v-model="form.integrationAmount" placeholder="请输入积分优惠分解金额"></el-input>
            </el-form-item>
            <el-form-item label="积分优惠分解金额" prop="realAmount">
              <el-input v-model="form.realAmount" placeholder="请输入积分优惠分解金额"></el-input>
            </el-form-item>
            <el-form-item label="商品详情" prop="content">
              <el-input v-model="form.content" placeholder="请输入商品详情"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
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
  import { page, addObj, getObj, delObj, putObj } from '@/api/order/orderDetail/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'orderDetail',
    data() {
      return {
        form: {
          fkOrderId : undefined,
          orderNo : undefined,
          fkGoodsId : undefined,
          goodsName : undefined,
          goodsPrice : undefined,
          quantity : undefined,
          totalAmount : undefined,
          brandname : undefined,
          pic : undefined,
          deductStockType : undefined,
          fkSkuId : undefined,
          skucode : undefined,
          specvalue : undefined,
          goodsWeight : undefined,
          linePrice : undefined,
          promotionName : undefined,
          promotionAmount : undefined,
          couponAmount : undefined,
          integrationAmount : undefined,
          realAmount : undefined,
          content : undefined,
          remark : undefined,
        },
        rules: {
          fkOrderId: [
            {
              required: true,
              message: '请输入订单Id',
              trigger: 'blur'
            }
          ],           orderNo: [
            {
              required: true,
              message: '请输入订单编码',
              trigger: 'blur'
            }
          ],           fkGoodsId: [
            {
              required: true,
              message: '请输入商品id',
              trigger: 'blur'
            }
          ],           goodsName: [
            {
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            }
          ],           goodsPrice: [
            {
              required: true,
              message: '请输入商品价格',
              trigger: 'blur'
            }
          ],           quantity: [
            {
              required: true,
              message: '请输入商品数量',
              trigger: 'blur'
            }
          ],           totalAmount: [
            {
              required: true,
              message: '请输入商品总价',
              trigger: 'blur'
            }
          ],           brandname: [
            {
              required: true,
              message: '请输入商品品牌',
              trigger: 'blur'
            }
          ],           pic: [
            {
              required: true,
              message: '请输入商品图片',
              trigger: 'blur'
            }
          ],           deductStockType: [
            {
              required: true,
              message: '请输入库存计算方式(10下单减库存 20付款减库存)',
              trigger: 'blur'
            }
          ],           fkSkuId: [
            {
              required: true,
              message: '请输入SKU ID',
              trigger: 'blur'
            }
          ],           skucode: [
            {
              required: true,
              message: '请输入SKU 编码',
              trigger: 'blur'
            }
          ],           specvalue: [
            {
              required: true,
              message: '请输入商品属性',
              trigger: 'blur'
            }
          ],           goodsWeight: [
            {
              required: true,
              message: '请输入商品重量',
              trigger: 'blur'
            }
          ],           linePrice: [
            {
              required: true,
              message: '请输入商品划线价',
              trigger: 'blur'
            }
          ],           promotionName: [
            {
              required: true,
              message: '请输入优惠名称',
              trigger: 'blur'
            }
          ],           promotionAmount: [
            {
              required: true,
              message: '请输入商品促销分解金额',
              trigger: 'blur'
            }
          ],           couponAmount: [
            {
              required: true,
              message: '请输入优惠券优惠分解金额',
              trigger: 'blur'
            }
          ],           integrationAmount: [
            {
              required: true,
              message: '请输入积分优惠分解金额',
              trigger: 'blur'
            }
          ],           realAmount: [
            {
              required: true,
              message: '请输入积分优惠分解金额',
              trigger: 'blur'
            }
          ],           content: [
            {
              required: true,
              message: '请输入商品详情',
              trigger: 'blur'
            }
          ],           remark: [
            {
              required: true,
              message: '请输入备注',
              trigger: 'blur'
            }
          ]        },
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
        orderDetailManager_btn_edit: false,
        orderDetailManager_btn_del: false,
        orderDetailManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        show: false
      }
    },
    created() {
      this.getList();
      this.orderDetailManager_btn_edit = this.elements['order:orderDetail:edit'];
      this.orderDetailManager_btn_del = this.elements['order:orderDetail:delete'];
      this.orderDetailManager_btn_add = this.elements['order:orderDetail:add'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.pkOrderDetailId).then(response => {
          this.form = response.data.obj;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
        }).then(() => {
          delObj(row.pkOrderDetailId)
            .then(() => {
                this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
        });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
            })
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            putObj(this.form.pkOrderDetailId, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
              fkOrderId : undefined,
              orderNo : undefined,
              fkGoodsId : undefined,
              goodsName : undefined,
              goodsPrice : undefined,
              quantity : undefined,
              totalAmount : undefined,
              brandname : undefined,
              pic : undefined,
              deductStockType : undefined,
              fkSkuId : undefined,
              skucode : undefined,
              specvalue : undefined,
              goodsWeight : undefined,
              linePrice : undefined,
              promotionName : undefined,
              promotionAmount : undefined,
              couponAmount : undefined,
              integrationAmount : undefined,
              realAmount : undefined,
              content : undefined,
              remark : undefined,
        };
      }
    }
  }
</script>
