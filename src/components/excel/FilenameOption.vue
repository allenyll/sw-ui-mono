<template>
  <div style="display:inline-block;">
    <!-- $t is vue-i18n global function to translate lang -->
    <label class="radio-label" style="padding-left:0;">文件名: </label>
    <el-input placeholder="请输入下载文件的名称" v-model="filename" style="width:340px;" prefix-icon="el-icon-document"/>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
