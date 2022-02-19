<template>
  <div class="app-container calendar-list-container">
    <el-card class="search-container" shadow="never">
      <div style="height: 32px; margin-bottom: 5px;">
        <i class="el-icon-search"/>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" size="small" @click="handleFilter()">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" size="small" @click="handleReset()">重置</el-button>
      </div>
      <div>
        <el-form :inline="true" :model="listQuery" size="small">
          <el-row>
            <el-col :span="6">
              <el-form-item label="名称：">
                <el-input v-model="listQuery.like_name" class="input-width" placeholder="手工录入，模糊查询"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 10px; margin-bottom: 10px;"/>
      <span>数据列表</span>
      <el-button v-if="shopManager_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="id" v-if="show">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="店铺名称">
            <template slot-scope="scope">
              <span>{{scope.row.shopName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="店铺编号">
            <template slot-scope="scope">
              <span>{{scope.row.shopCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="店铺状态">
            <template slot-scope="scope">
              <span>{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="店主姓名">
            <template slot-scope="scope">
              <span>{{scope.row.shopKeeper}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="店主手机号">
            <template slot-scope="scope">
              <span>{{scope.row.shopPhone}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="QQ号">
            <template slot-scope="scope">
              <span>{{scope.row.shopQq}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="微信号">
            <template slot-scope="scope">
              <span>{{scope.row.shopWechat}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="店铺地址">
            <template slot-scope="scope">
              <span>{{scope.row.shopAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="店铺图标">
            <template slot-scope="scope">
              <span>{{scope.row.shopImg}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="开始营业时间">
            <template slot-scope="scope">
              <span>{{scope.row.startTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结束营业时间">
            <template slot-scope="scope">
              <span>{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="店铺营业状态">
            <template slot-scope="scope">
              <span>{{scope.row.shopActive}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="能否开发票">
            <template slot-scope="scope">
              <span>{{scope.row.isInvoice}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发票说明">
            <template slot-scope="scope">
              <span>{{scope.row.invoiceRemark}}</span>
            </template>
          </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="shopManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="shopManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="店铺名称" prop="shopName">
              <el-input v-model="form.shopName" placeholder="请输入店铺名称"></el-input>
            </el-form-item>
            <el-form-item label="店铺编号" prop="shopCode">
              <el-input v-model="form.shopCode" placeholder="请输入店铺编号"></el-input>
            </el-form-item>
            <el-form-item label="店铺状态" prop="status">
              <el-input v-model="form.status" placeholder="请输入店铺状态"></el-input>
            </el-form-item>
            <el-form-item label="店主姓名" prop="shopKeeper">
              <el-input v-model="form.shopKeeper" placeholder="请输入店主姓名"></el-input>
            </el-form-item>
            <el-form-item label="店主手机号" prop="shopPhone">
              <el-input v-model="form.shopPhone" placeholder="请输入店主手机号"></el-input>
            </el-form-item>
            <el-form-item label="QQ号" prop="shopQq">
              <el-input v-model="form.shopQq" placeholder="请输入QQ号"></el-input>
            </el-form-item>
            <el-form-item label="微信号" prop="shopWechat">
              <el-input v-model="form.shopWechat" placeholder="请输入微信号"></el-input>
            </el-form-item>
            <el-form-item label="店铺地址" prop="shopAddress">
              <el-input v-model="form.shopAddress" placeholder="请输入店铺地址"></el-input>
            </el-form-item>
            <el-form-item label="店铺图标" prop="shopImg">
              <el-input v-model="form.shopImg" placeholder="请输入店铺图标"></el-input>
            </el-form-item>
            <el-form-item label="开始营业时间" prop="startTime">
              <el-input v-model="form.startTime" placeholder="请输入开始营业时间"></el-input>
            </el-form-item>
            <el-form-item label="结束营业时间" prop="endTime">
              <el-input v-model="form.endTime" placeholder="请输入结束营业时间"></el-input>
            </el-form-item>
            <el-form-item label="店铺营业状态" prop="shopActive">
              <el-input v-model="form.shopActive" placeholder="请输入店铺营业状态"></el-input>
            </el-form-item>
            <el-form-item label="能否开发票" prop="isInvoice">
              <el-input v-model="form.isInvoice" placeholder="请输入能否开发票"></el-input>
            </el-form-item>
            <el-form-item label="发票说明" prop="invoiceRemark">
              <el-input v-model="form.invoiceRemark" placeholder="请输入发票说明"></el-input>
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
  import { page, addObj, getObj, delObj, putObj } from '@/api/shop/shop/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'shop',
    data() {
      return {
        form: {
          shopName : undefined,
          shopCode : undefined,
          status : undefined,
          shopKeeper : undefined,
          shopPhone : undefined,
          shopQq : undefined,
          shopWechat : undefined,
          shopAddress : undefined,
          shopImg : undefined,
          startTime : undefined,
          endTime : undefined,
          shopActive : undefined,
          isInvoice : undefined,
          invoiceRemark : undefined,
        },
        rules: {
          shopName: [
            {
              required: true,
              message: '请输入店铺名称',
              trigger: 'blur'
            }
          ],           shopCode: [
            {
              required: true,
              message: '请输入店铺编号',
              trigger: 'blur'
            }
          ],           status: [
            {
              required: true,
              message: '请输入店铺状态',
              trigger: 'blur'
            }
          ],           shopKeeper: [
            {
              required: true,
              message: '请输入店主姓名',
              trigger: 'blur'
            }
          ],           shopPhone: [
            {
              required: true,
              message: '请输入店主手机号',
              trigger: 'blur'
            }
          ],           shopQq: [
            {
              required: true,
              message: '请输入QQ号',
              trigger: 'blur'
            }
          ],           shopWechat: [
            {
              required: true,
              message: '请输入微信号',
              trigger: 'blur'
            }
          ],           shopAddress: [
            {
              required: true,
              message: '请输入店铺地址',
              trigger: 'blur'
            }
          ],           shopImg: [
            {
              required: true,
              message: '请输入店铺图标',
              trigger: 'blur'
            }
          ],           startTime: [
            {
              required: true,
              message: '请输入开始营业时间',
              trigger: 'blur'
            }
          ],           endTime: [
            {
              required: true,
              message: '请输入结束营业时间',
              trigger: 'blur'
            }
          ],           shopActive: [
            {
              required: true,
              message: '请输入店铺营业状态',
              trigger: 'blur'
            }
          ],           isInvoice: [
            {
              required: true,
              message: '请输入能否开发票',
              trigger: 'blur'
            }
          ],           invoiceRemark: [
            {
              required: true,
              message: '请输入发票说明',
              trigger: 'blur'
            }
          ]        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          like_name: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        shopManager_btn_edit: false,
        shopManager_btn_del: false,
        shopManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        show: false
      }
    },
    computed: {
      ...mapGetters([
          'elements'
      ])
    },
    created() {
      this.getList();
      this.shopManager_btn_edit = this.elements['shop:shop:edit'];
      this.shopManager_btn_del = this.elements['shop:shop:delete'];
      this.shopManager_btn_add = this.elements['shop:shop:add'];
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
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
          like_name: ''
        }
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
        getObj(row.id).then(response => {
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
          delObj(row.id)
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
            putObj(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '更新成功',
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
              shopName : undefined,
              shopCode : undefined,
              status : undefined,
              shopKeeper : undefined,
              shopPhone : undefined,
              shopQq : undefined,
              shopWechat : undefined,
              shopAddress : undefined,
              shopImg : undefined,
              startTime : undefined,
              endTime : undefined,
              shopActive : undefined,
              isInvoice : undefined,
              invoiceRemark : undefined,
        };
      }
    }
  }
</script>
