<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.like_name"> </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="cartManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="pk_cart_id" v-if="show">
            <template slot-scope="scope">
              <span>{{scope.row.pkCartId}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="商品ID">
            <template slot-scope="scope">
              <span>{{scope.row.fkGoodsId}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="SKU ID">
            <template slot-scope="scope">
              <span>{{scope.row.fkSkuId}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="会员ID">
            <template slot-scope="scope">
              <span>{{scope.row.fkCustomerId}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="数量">
            <template slot-scope="scope">
              <span>{{scope.row.quantity}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="价格">
            <template slot-scope="scope">
              <span>{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" align="center" label="">
            <template slot-scope="scope">
              <span>{{scope.row.specValue}}</span>
            </template>
          </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="cartManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="cartManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="商品ID" prop="fkGoodsId">
              <el-input v-model="form.fkGoodsId" placeholder="请输入商品ID"></el-input>
            </el-form-item>
            <el-form-item label="SKU ID" prop="fkSkuId">
              <el-input v-model="form.fkSkuId" placeholder="请输入SKU ID"></el-input>
            </el-form-item>
            <el-form-item label="会员ID" prop="fkCustomerId">
              <el-input v-model="form.fkCustomerId" placeholder="请输入会员ID"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="quantity">
              <el-input v-model="form.quantity" placeholder="请输入数量"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入价格"></el-input>
            </el-form-item>
            <el-form-item label="" prop="specValue">
              <el-input v-model="form.specValue" placeholder="请输入"></el-input>
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
  import { page, addObj, getObj, delObj, putObj } from '@/api/order/cart/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'cart',
    data() {
      return {
        form: {
          fkGoodsId : undefined,
          fkSkuId : undefined,
          fkCustomerId : undefined,
          quantity : undefined,
          price : undefined,
          specValue : undefined,
        },
        rules: {
          fkGoodsId: [
            {
              required: true,
              message: '请输入商品ID',
              trigger: 'blur'
            }
          ],           fkSkuId: [
            {
              required: true,
              message: '请输入SKU ID',
              trigger: 'blur'
            }
          ],           fkCustomerId: [
            {
              required: true,
              message: '请输入会员ID',
              trigger: 'blur'
            }
          ],           quantity: [
            {
              required: true,
              message: '请输入数量',
              trigger: 'blur'
            }
          ],           price: [
            {
              required: true,
              message: '请输入价格',
              trigger: 'blur'
            }
          ],           specValue: [
            {
              required: true,
              message: '请输入',
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
        cartManager_btn_edit: false,
        cartManager_btn_del: false,
        cartManager_btn_add: false,
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
      this.cartManager_btn_edit = this.elements['order:cart:edit'];
      this.cartManager_btn_del = this.elements['order:cart:delete'];
      this.cartManager_btn_add = this.elements['order:cart:add'];
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
        getObj(row.pkCartId).then(response => {
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
          delObj(row.pkCartId)
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
            putObj(this.form.pkCartId, this.form).then(() => {
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
              fkGoodsId : undefined,
              fkSkuId : undefined,
              fkCustomerId : undefined,
              quantity : undefined,
              price : undefined,
              specValue : undefined,
        };
      }
    }
  }
</script>
