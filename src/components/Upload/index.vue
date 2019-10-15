<template>
  <el-upload
    v-loading="loading"
    class="uploader"
    :show-file-list="false"
    :action="uploadUrl"
    :headers="headers"
    :accept="accept"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
  >
    <img v-if="imgUrl" :src="imgUrl" class="img" >
    <i v-else class="el-icon-plus uploader-icon" />
    <div class="mask">点击上传</div>
  </el-upload>
</template>

<script>
import config from '@/config'
import { getToken } from '@/utils/auth'

export default {
  name: 'Upload',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    preview: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imgUrl: '',
      uploadUrl: `${config.baseURL}/tool/upload`,
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  watch: {
    preview: {
      immediate: true,
      handler(val) {
        this.imgUrl = val
      }
    }
  },
  methods: {
    beforeUpload(file) {
      this.$emit('beforeUpload', file)
    },
    handleSuccess(response, file, fileList) {
      this.$emit('handleSuccess', response, file, fileList)
      this.imgUrl = response.data
    },
    handleError(err, file, fileList) {
      this.$emit('handleError', err)
    }
  }
}
</script>
<style lang="scss" scoped>
.uploader {
  display: inline-block;
}
.uploader /deep/.el-upload {
  display: block;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  background-color: #eee;
  &:hover {
    .mask {
      opacity: 1;
    }
  }
}
.uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 160px;
  height: 160px;
  line-height: 160px;
  opacity: 0;
  color: #fff;
  text-align: center;
  transition: opacity 0.3s ease;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
}
.img {
  width: 160px;
  height: 160px;
  display: block;
  object-fit: contain;
}
</style>
