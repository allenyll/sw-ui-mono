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
      <el-button v-if="shopAddressManager_btn_add" class="filter-item" style="float:right;" type="primary" @click="handleCreate">添加</el-button>
    </el-card>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="id" v-if="show">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="会员主键">
            <template slot-scope="scope">
              <span>{{scope.row.shopId}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发货点">
            <template slot-scope="scope">
              <span>{{scope.row.deliveryPoint}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号">
            <template slot-scope="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="邮编">
            <template slot-scope="scope">
              <span>{{scope.row.postCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="省">
            <template slot-scope="scope">
              <span>{{scope.row.province}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="市">
            <template slot-scope="scope">
              <span>{{scope.row.city}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="区/县">
            <template slot-scope="scope">
              <span>{{scope.row.region}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="详细地址">
            <template slot-scope="scope">
              <span>{{scope.row.detailAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否默认地址">
            <template slot-scope="scope">
              <span>{{scope.row.isDefault}}</span>
            </template>
          </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="shopAddressManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="shopAddressManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="会员主键" prop="shopId">
              <el-input v-model="form.shopId" placeholder="请输入会员主键"></el-input>
            </el-form-item>
            <el-form-item label="发货点" prop="deliveryPoint">
              <el-input v-model="form.deliveryPoint" placeholder="请输入发货点"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-input v-model="form.status" placeholder="请输入状态"></el-input>
            </el-form-item>
            <el-form-item label="邮编" prop="postCode">
              <el-input v-model="form.postCode" placeholder="请输入邮编"></el-input>
            </el-form-item>
            <el-form-item label="省" prop="province">
              <el-input v-model="form.province" placeholder="请输入省"></el-input>
            </el-form-item>
            <el-form-item label="市" prop="city">
              <el-input v-model="form.city" placeholder="请输入市"></el-input>
            </el-form-item>
            <el-form-item label="区/县" prop="region">
              <el-input v-model="form.region" placeholder="请输入区/县"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailAddress">
              <el-input v-model="form.detailAddress" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item label="是否默认地址" prop="isDefault">
              <el-input v-model="form.isDefault" placeholder="请输入是否默认地址"></el-input>
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
  import { page, addObj, getObj, delObj, putObj } from '@/api/shop/shopAddress/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'shopAddress',
    data() {
      return {
        form: {
          shopId : undefined,
          deliveryPoint : undefined,
          name : undefined,
          phone : undefined,
          status : undefined,
          postCode : undefined,
          province : undefined,
          city : undefined,
          region : undefined,
          detailAddress : undefined,
          isDefault : undefined,
        },
        rules: {
          shopId: [
            {
              required: true,
              message: '请输入会员主键',
              trigger: 'blur'
            }
          ],           deliveryPoint: [
            {
              required: true,
              message: '请输入发货点',
              trigger: 'blur'
            }
          ],           name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ],           phone: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            }
          ],           status: [
            {
              required: true,
              message: '请输入状态',
              trigger: 'blur'
            }
          ],           postCode: [
            {
              required: true,
              message: '请输入邮编',
              trigger: 'blur'
            }
          ],           province: [
            {
              required: true,
              message: '请输入省',
              trigger: 'blur'
            }
          ],           city: [
            {
              required: true,
              message: '请输入市',
              trigger: 'blur'
            }
          ],           region: [
            {
              required: true,
              message: '请输入区/县',
              trigger: 'blur'
            }
          ],           detailAddress: [
            {
              required: true,
              message: '请输入详细地址',
              trigger: 'blur'
            }
          ],           isDefault: [
            {
              required: true,
              message: '请输入是否默认地址',
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
        shopAddressManager_btn_edit: false,
        shopAddressManager_btn_del: false,
        shopAddressManager_btn_add: false,
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
      this.shopAddressManager_btn_edit = this.elements['shop:shopAddress:edit'];
      this.shopAddressManager_btn_del = this.elements['shop:shopAddress:delete'];
      this.shopAddressManager_btn_add = this.elements['shop:shopAddress:add'];
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
              shopId : undefined,
              deliveryPoint : undefined,
              name : undefined,
              phone : undefined,
              status : undefined,
              postCode : undefined,
              province : undefined,
              city : undefined,
              region : undefined,
              detailAddress : undefined,
              isDefault : undefined,
        };
      }
    }
  }
</script>
