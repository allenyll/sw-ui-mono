<template>
  <div style="margin-top: 50px;">
    <el-form ref="goodsAttrForm" :model="value" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="所属分类" prop="specCategoryId">
        <el-cascader
          :props="categoryProps"
          v-model="selectAttrCategory"
          :options="categoryTree"
          @change="changeCategory"
        />
      </el-form-item>
      <el-form-item label="商品规格">
        <el-card shadow="never" style="background-color: #F8F9FC">
          <div v-for="(goodsAttr, idx) in specsList" :key="goodsAttr.specId">
            {{ goodsAttr.specName }}
            <el-button
              type="text"
              @click="removeSpecs(idx)"> 删除规格
            </el-button>
            <el-checkbox-group v-model="specsList[idx].values">
              <el-checkbox
                v-for="item in goodsAttr.specOptions"
                :label="item.id"
                :key="item.id"
                class="littleMarginLeft">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
        <el-table
          :data="value.skuStockList"
          style="width: 100%;margin-top: 20px"
          border>
          <el-table-column
            v-for="(item,index) in specsList"
            :label="item.specName"
            :key="item.specId"
            align="center">
            <template slot-scope="scope">
              {{ getSpecs(scope.row, index) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="unionShow"
            label="规格组合"
            width="80"
            align="center">
            <template slot-scope="scope">
              {{ getSpecOption(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuPrice"/>
            </template>
          </el-table-column>
          <el-table-column
            label="商品库存"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuStock"/>
            </template>
          </el-table-column>
          <el-table-column
            label="库存预警值"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.warnStock"/>
            </template>
          </el-table-column>
          <el-table-column
            label="SKU编号"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode"/>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="removeSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="resetInfo">重置SKU
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="syncSkuPrice">同步价格
        </el-button>
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          style="margin-top: 20px"-->
        <!--          @click="clearSkuList">清空SKU列表-->
        <!--        </el-button>-->
      </el-form-item>
      <el-form-item v-if="hasAttrPic" label="属性图片：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item) in selectSkuSpecAttrPics" :key="item.name">
            <span>{{ item.name }}:</span>
            <single-upload
              v-model="item.pic"
              :upload-id="value.id"
              upload-type="SW1803"
              style="width: 300px;display: inline-block;margin-left: 10px"/>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload
          v-model="selectSkuPics"
          :upload-id="value.id"
          upload-type="SW1801"
          style="display: inline-block;margin-left: 10px"
          @removeFile="removeFile"/>
      </el-form-item>
      <el-form-item label="规格参数：">
        <tinymce :width="595" :height="300" v-model="value.goodsDesc"/>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <!--<el-button type="primary" size="medium" @click="handleNext">下一步，填写商品关联</el-button>-->
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { categoryTree } from '@/api/goods/category/index'
import { getSpecsListCondition } from '@/api/goods/specs'
import { getSpecOptionList } from '@/api/goods/specOption'
import singleUpload from '@/components/Upload/singleUpload'
import multiUpload from '@/components/Upload/multiUpload'
import Tinymce from '@/components/Tinymce'
import { getFileList } from '@/api/admin/file/index'

export default {
  name: 'GoodsAttr',
  components: {
    singleUpload,
    multiUpload,
    Tinymce
  },
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
      selectAttrCategory: [],
      categoryTree: [],
      specsList: [],
      specOptionNameMap: [],
      // 选中的商品属性图片
      selectSkuSpecAttrPics: [],
      selectSkuPics: [],
      unionShow: false,
      attrFlag: false
    }
  },
  computed: {
    // 是否有商品属性图片
    hasAttrPic() {
      if (this.selectSkuSpecAttrPics.length < 1) {
        return false
      }
      return true
    },
    productId: function(newValue) {
      if (!this.isEdit) return
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.handleEdit(this.value.parentSpecCategoryId, this.value.specCategoryId)
      this.getSpecsList(this.value.specsList, this.value.skuStockMapList)
      this.resetSkuSpecPic(this.value.specsList)
      return this.value.id
    },
    logOut: function(newValue) {
      return this.$store.state.logOut
    }
  },
  watch: {
    productId() {
      return this.value.id
    },
    selectAttrCategory: function(newValue) {
      if (newValue != null && newValue.length >= 1) {
        this.value.specCategoryId = newValue[newValue.length - 1]
      } else {
        this.value.specCategoryId = null
      }
      // this.changeCategory(this.value.specCategoryId)
    },
    specsList: function(value) {
      // console.log(value)
    }
  },
  created() {
    this.categoryTreeList((data) => {
      if (!data) {
        return
      }
      this.getSpecOptionList()
      this.getFileList(this.value.id)
    })
  },
  methods: {
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.$emit('nextStep')
    },
    handleFinishCommit() {
      // 设置属性图片到对应的属性
      this.setAttrPic()
      this.setSkuPics()
      this.$emit('finishCommit', this.isEdit)
    },
    handleEdit(pid, id) {
      if (this.isEdit) {
        if (!this.attrFlag) {
          if (pid !== '' && pid !== null && pid !== undefined) {
            this.selectAttrCategory.push(pid)
          }
          if (id !== '' && id !== null && id !== undefined) {
            this.selectAttrCategory.push(id)
          }
          if (this.selectAttrCategory.length > 0) {
            this.attrFlag = true
          }
        }
      }
    },
    getFileList(id) {
      const param = {
        id: id,
        type: 'SW1801'
      }
      getFileList(param).then(response => {
        this.selectSkuPics = response.data.list
      })
    },
    removeFile(fileList) {
      this.selectSkuPics = fileList
      this.value.selectSkuPics = fileList
    },
    categoryTreeList(callback) {
      categoryTree().then(res => {
        const tree = this.getTreeOptions(res.data.categoryTree)
        this.categoryTree = tree
        callback(true)
      }).catch((reject) => {
        callback(false)
      })
    },
    getSpecOptionList() {
      getSpecOptionList().then(response => {
        this.specOptionNameMap = response.data.map
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
    },
    getSpecsList(specsList, skuStockMapList) {
      this.specsList = specsList
      this.value.skuStockList = skuStockMapList
    },
    changeCategory(selectId) {
      // 获取分类下的
      this.specsList = []
      if (!this.isEdit) {
        this.value.skuStockList = []
      } else {
        this.value.specsList = []
        // this.value.skuStockMapList = []
      }
      if (selectId.length > 0) {
        const param = {
          categoryId: selectId[selectId.length - 1]
        }
        getSpecsListCondition(param).then(res => {
          if (res.code === '100000') {
            const list = res.data.list
            if (list.length > 0) {
              for (let i = 0; i < list.length; i++) {
                list[i].values = []
              }
            }
            this.specsList = list
            console.log('切换分类获取的规格：' + this.specsList)
          }
        })
      }
    },
    removeSpecs(index) {
      const list = this.specsList
      if (list.length === 1) {
        list.pop()
      } else {
        list.splice(index, 1)
      }
      this.value.skuStockList = []
    },
    getSpecs(row, index) {
      if (index === 0) {
        return row.value0
      } else if (index === 1) {
        return row.value1
      } else {
        return row.value2
      }
    },
    getSpecOption(row) {
      const len = this.specsList.length
      if (len === 1) {
        return '[' + row.id0 + ',' + row.value0 + ']'
      } else if (len === 2) {
        return '[' + row.id0 + ',' + row.value0 + '];[' + row.id1 + ',' + row.value1 + ']'
      } else {
        return '[' + row.id0 + ',' + row.value0 + '];[' + row.id1 + ',' + row.value1 + '];[' + row.id2 + ',' + row.value2 + ']'
      }
    },
    resetInfo() {
      this.$confirm('重置SKU将重新生成SKU相关信息，是否要重置', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetSkuSpecPic(this.specsList)
        this.resetSkuList()
      })
    },
    /**
   * 笛卡尔积获取SKU
   */
    calcDescartes: function(array) {
      console.log(array)
      if (array.length < 2) return array[0] || []
      return [].reduce.call(array, function(col, set) {
        var res = []
        col.forEach(function(c) {
          set.forEach(function(s) {
            var t = [].concat(Array.isArray(c) ? c : [c])
            t.push(s)
            res.push(t)
          })
        })
        return res
      })
    },
    resetSkuList() {
      this.value.skuStockList = []
      const skuList = this.value.skuStockList
      const specsList = this.specsList
      var selectSpecs = []
      for (const index in specsList) {
        selectSpecs.push(specsList[index].values)
      }
      const specsOption = this.calcDescartes(selectSpecs)
      for (const index in specsOption) {
        const specArr = specsOption[index]
        let specValue = ''
        const obj = {}
        if (!(specArr instanceof Array)) {
          const _id = specArr
          const _name = this.specOptionNameMap[specArr]
          if (!specValue) {
            specValue = '[' + _id + ',' + _name + ']'
          } else {
            specValue += ';' + '[' + _id + ',' + _name + ']'
          }
          obj['id' + 0] = _id
          obj['value' + 0] = _name
          obj['specValue'] = specValue
        } else {
          for (const key in specArr) {
            const _id = specArr[key]
            const _name = this.specOptionNameMap[specArr[key]]
            if (!specValue) {
              specValue = '[' + _id + ',' + _name + ']'
            } else {
              specValue += ';' + '[' + _id + ',' + _name + ']'
            }
            obj['id' + key] = _id
            obj['value' + key] = _name
            obj['specValue'] = specValue
          }
        }
        skuList.push(obj)
      }
      // 只有一个规格
      // if (specsList.length === 1) {
      //   const values = specsList[0].values
      //   for (let i = 0; i < values.length; i++) {
      //     skuList.push({
      //       value0: this.specOptionNameMap[values[i]],
      //       id0: values[i],
      //       specValue: '[' + values[i] + ',' + this.specOptionNameMap[values[i]] + ']'
      //     })
      //   }
      // } else if (specsList.length === 2) {
      //   const values0 = specsList[0].values
      //   const values1 = specsList[1].values
      //   for (let i = 0; i < values0.length; i++) {
      //     if (values1.length === 0) {
      //       skuList.push({
      //         value0: this.specOptionNameMap[values0[i]],
      //         id0: values0[i],
      //         specValue: '[' + values0[i] + ',' + this.specOptionNameMap[values0[i]] + ']'
      //       })
      //       continue
      //     }
      //     for (let j = 0; j < values1.length; j++) {
      //       skuList.push({
      //         value0: this.specOptionNameMap[values0[i]],
      //         id0: values0[i],
      //         value1: this.specOptionNameMap[values1[j]],
      //         id1: values1[j],
      //         specValue: '[' + values0[i] + ',' + this.specOptionNameMap[values0[i]] + '];[' + values1[j] + ',' + this.specOptionNameMap[values1[j]] + ']'
      //       })
      //     }
      //   }
      // } else if (specsList.length === 3) {
      //   const values0 = specsList[0].values
      //   const values1 = specsList[1].values
      //   const values2 = specsList[2].values
      //   for (let i = 0; i < values0.length; i++) {
      //     if (values1.length === 0) {
      //       skuList.push({
      //         value0: this.specOptionNameMap[values0[i]],
      //         id0: values0[i],
      //         specValue: '[' + values0[i] + ',' + this.specOptionNameMap[values0[i]] + ']'
      //       })
      //       continue
      //     }
      //     for (let j = 0; j < values1.length; j++) {
      //       if (values2.length === 0) {
      //         skuList.push({
      //           value0: this.specOptionNameMap[values0[i]],
      //           id0: values0[i],
      //           value1: this.specOptionNameMap[values1[j]],
      //           id1: values1[j],
      //           specValue: '[' + values0[i] + ',' + this.specOptionNameMap[values0[i]] + '];[' + values1[j] + ',' + this.specOptionNameMap[values1[j]] + ']'
      //         })
      //         continue
      //       }
      //       for (let k = 0; k < values2.length; k++) {
      //         skuList.push({
      //           value0: this.specOptionNameMap[values0[i]],
      //           id0: values0[i],
      //           value1: this.specOptionNameMap[values1[j]],
      //           id1: values1[j],
      //           value2: this.specOptionNameMap[values2[k]],
      //           id2: values2[k],
      //           specValue: '[' + values0[i] + ',' + this.specOptionNameMap[values0[i]] + '];[' + values1[j] + ',' + this.specOptionNameMap[values1[j]] + '];[' + values2[k] + ',' + this.specOptionNameMap[values2[k]] + ']'
      //         })
      //       }
      //     }
      //   }
      // }
      this.value.skuStockList = skuList
      this.value.skuStockMapList = skuList
    },
    resetSkuSpecPic(specsList) {
      // debugger
      this.selectSkuSpecAttrPics = []
      // const specsList = this.specsList
      if (specsList !== null && specsList !== undefined) {
        if (specsList.length >= 1) {
          for (let i = 0; i < specsList.length; i++) {
            if (specsList[i].specName === '颜色') {
              const specOptionList = specsList[i].values
              if (specOptionList.length >= 1) {
                for (let j = 0; j < specOptionList.length; j++) {
                  let pic = ''
                  if (this.isEdit) {
                    // 编辑状态下获取图片
                    pic = this.getProductSkuPic(this.specOptionNameMap[specOptionList[j]])
                  }
                  this.selectSkuSpecAttrPics.push({
                    name: this.specOptionNameMap[specOptionList[j]],
                    pic: pic
                  })
                }
              }
            }
          }
        }
      }
    },
    // 获取商品相关属性的图片
    getProductSkuPic(name) {
      for (let i = 0; i < this.value.skuStockList.length; i++) {
        if (this.value.skuStockList[i].value0 === name) {
          return this.value.skuStockList[i].picUrl
        }
      }
      return ''
    },
    removeSku(row, index) {
      const list = this.value.skuStockList
      if (list.length === 1) {
        list.pop()
      } else {
        list.splice(index, 1)
      }
    },
    syncSkuPrice() {
      this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.value.skuStockList !== null && this.value.skuStockList.length > 0) {
          const price = this.value.skuStockList[0].skuPrice
          for (let i = 1; i < this.value.skuStockList.length; i++) {
            this.value.skuStockList[i].skuPrice = price
          }
        }
      })
    },
    clearSkuList() {
      this.$confirm('是否清空SKU列表', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.value.skuStockList = []
      })
    },
    setAttrPic() {
      for (let i = 0; i < this.selectSkuSpecAttrPics.length; i++) {
        for (let j = 0; j < this.value.skuStockList.length; j++) {
          if (this.selectSkuSpecAttrPics[i].name === this.value.skuStockList[j].value0) {
            this.value.skuStockList[j].picUrl = this.selectSkuSpecAttrPics[i].pic
          }
        }
      }
    },
    setSkuPics() {
      this.value.selectSkuPics = this.selectSkuPics
    }
  }
}
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }
</style>
