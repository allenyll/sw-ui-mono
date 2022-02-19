<template>
  <div>
    <el-upload
      ref="upload"
      :http-request="myUpload"
      :show-file-list="showFileList"
      :multiple="false"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      action="#"
      name="picture"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <!--<el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>-->
    <el-dialog :visible.sync="dialogVisible">
      <img :src="fileList[0].url" width="100%" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import axios from 'axios'
import { removeFileById } from '@/api/admin/file/index'
const baseUrl = process.env.BASE_API
export default {
  name: 'SingleUpload',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: String,
    // eslint-disable-next-line vue/require-default-prop
    uploadType: {
      type: String,
      require: true
    },
    // eslint-disable-next-line vue/require-default-prop
    uploadId: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
      // 图片列表（用于在上传组件中回显图片）
      // fileList: []
    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
    fileList() {
      return [{
        url: this.imageUrl
      }]
    },
    showFileList: {
      get: function() {
        return this.value !== null && this.value !== '' && this.value !== undefined
      },
      set: function(newValue) {
      }
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    // 自定义上传
    myUpload(content) {
      const token = getToken()
      const self = this
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token,
          'login-type': 'sweb'
        },
        onUploadProgress: progressEvent => {
          const percent = (progressEvent.loaded / progressEvent.total * 100) | 0
          // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          content.onProgress({ percent: percent })
        }
      }
      const formData = new FormData()
      formData.append('file', content.file)
      formData.append('type', this.uploadType)
      formData.append('id', this.uploadId)

      axios.post(baseUrl + '/file/upload', formData, config).then((res) => {
        // 做处理
        // this.getFileList(this.goodsId)
        if (res.data.code === '100000') {
          console.log(res)
          const data = {
            name: '图片',
            url: res.data.data.url
          }
          this.fileList.push(data)
          this.emitInput(res.data.data.url)
          self.uploadMessage = '上传成功！'
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 文件上传成功的钩子函数
    handleSuccess(res, file) {
      this.$message({
        type: 'info',
        message: '图片上传成功',
        duration: 3000
      })
      if (file.response.success) {
        this.editor.picture = file.response.message // 将返回的文件储存路径赋值picture字段
      }
    },
    // 删除文件之前的钩子函数
    handleRemove(file, fileList) {
      removeFileById(file.id).then(res => {
        this.emitInput('')
        this.$message({
          type: 'info',
          message: '已删除原有图片',
          duration: 3000
        })
      })
    },
    // 点击列表中已上传的文件事的钩子函数
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传的文件个数超出设定时触发的函数
    onExceed(files, fileList) {
      console.log(fileList.length)
      this.$message({
        type: 'info',
        message: '最多只能上传一个图片',
        duration: 3000
      })
    },
    // 文件上传前的前的钩子函数
    // 参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    }
  }
}
</script>
<style>

</style>

