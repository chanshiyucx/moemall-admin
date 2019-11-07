<template>
  <div class="app-container">
    <div :class="['filter-container', parentId === 0 && 'flex-end']">
      <el-button v-show="parentId !== 0" type="primary" icon="el-icon-arrow-left" @click="goBack">返回上级</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleDialog()">新增分类</el-button>
    </div>

    <el-table v-loading="loading.table" :data="list" border fit>
      <el-table-column prop="id" label="ID" align="center" sortable width="100" />
      <el-table-column label="图标" align="center" min-width="100">
        <template slot-scope="scope">
          <img class="thumb" :src="scope.row.icon" alt @click="handleDialog(scope.row)" >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" align="center" min-width="100" />
      <el-table-column label="级别" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.level | levelFilter }}</template>
      </el-table-column>
      <el-table-column prop="productCount" label="商品数量" align="center" min-width="100" />
      <el-table-column prop="productUnit" label="单位" align="center" min-width="100" />
      <el-table-column prop="sort" label="排序" align="center" width="100" />
      <el-table-column label="是否显示" align="center" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.showStatus"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="导航栏" align="center" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.navStatus"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :disabled="scope.row.level | disableNextLevel"
            @click="handleNextLevel(scope.row)"
          >查看下级</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="getData()"
    />

    <el-dialog
      :title="`${type === 'create' ? '新增' : '编辑'}分类`"
      :visible.sync="visible.dataForm"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:20px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="单位" prop="productUnit">
          <el-input v-model="dataForm.productUnit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="dataForm.keywords" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="dataForm.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="是否显示" prop="showStatus">
          <el-switch v-model="dataForm.showStatus" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="导航栏" prop="navStatus">
          <el-switch v-model="dataForm.navStatus" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <Upload
            :loading="loading.upload"
            :preview="dataForm.icon"
            @beforeUpload="beforeUpload"
            @handleSuccess="handleSuccess"
            @handleError="handleError"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible.dataForm = false">取消</el-button>
        <el-button type="primary" :loading="loading.dataForm" @click="handleSure">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCategory, createCategory, updateCategory, updateCategoryStatus, deleteCategory } from '@/api/category'
import Pagination from '@/components/Pagination'
import Upload from '@/components/Upload'

const initDataForm = {
  parentId: '',
  name: '',
  productUnit: '',
  sort: '',
  showStatus: 0,
  navStatus: 0,
  icon: '',
  keywords: '',
  description: ''
}

export default {
  name: 'Category',
  components: { Pagination, Upload },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return '一级'
      } else if (value === 1) {
        return '二级'
      }
    },
    disableNextLevel(value) {
      return value !== 0
    }
  },
  data() {
    return {
      parentId: 0,
      loading: {
        table: false,
        dataForm: false,
        upload: false
      },
      visible: {
        dataForm: false
      },
      list: [],
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 20
      },
      search: {
      },
      type: 'create',
      dataForm: { ...initDataForm },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        productUnit: [{ required: true, message: '请输入单位', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'change' }],
        showStatus: [{ required: true, message: '请选择是否显示', trigger: 'change' }],
        navStatus: [{ required: true, message: '请选择是否为品牌制造商', trigger: 'change' }],
        keywords: [{ required: true, message: '请输入品牌故事', trigger: 'change' }],
        icon: [{ required: true, message: '请上传品牌Logo', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route(route) {
      this.resetParentId()
      this.getData()
    }
  },
  created() {
    this.resetParentId()
    this.getData()
  },
  methods: {
    resetParentId() {
      this.parentId = this.$route.query.parentId || 0
    },
    handleReset() {
      this.search = {}
      this.getData()
    },
    async getData() {
      this.loading.table = true
      try {
        const res = await listCategory({ ...this.query, ...this.search, parentId: this.parentId })
        this.list = res.data
        this.total = res.attributes ? res.attributes.total : res.data.length
      } catch (error) {
        console.log(error)
      }
      this.loading.table = false
    },
    handleDialog(row) {
      if (row) {
        this.dataForm = { ...row }
        this.type = 'edit'
      } else {
        this.dataForm = { ...initDataForm }
        this.dataForm.parentId = this.parentId
        this.type = 'create'
      }
      this.loading.dataForm = false
      this.visible.dataForm = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSure() {
      this.$refs['dataForm'].validate(async valid => {
        if (!valid) return this.$message.error('请完善品牌信息')
        this.loading.dataForm = true
        try {
          const req = { ...this.dataForm }
          let res
          if (this.type === 'create') {
            res = await createCategory(req)
          } else {
            res = await updateCategory(req)
          }
          this.$message.success(res.message || 'OK')
          this.visible.dataForm = false
          this.getData()
        } catch (error) {
          console.log(error)
        }
        this.loading.dataForm = false
      })
    },
    async handleStatus(row) {
      this.loading.table = true
      try {
        const req = {
          id: row.id,
          showStatus: row.showStatus,
          navStatus: row.navStatus
        }
        const res = await updateCategoryStatus(req)
        this.$message.success(res.message || 'OK')
        this.getData()
      } catch (error) {
        console.log(error)
        // 更新失败刷新一次
        this.getData()
      }
      this.loading.table = false
    },
    handleDelete(row) {
      this.$confirm(`确定删除该品牌?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.table = true
          try {
            const res = await deleteCategory(row.id)
            this.$message.success(res.message || 'OK')
            this.getData()
          } catch (error) {
            console.log(error)
          }
          this.loading.table = false
        })
        .catch(() => {
          console.log('关闭弹窗')
        })
    },
    beforeUpload(type) {
      this.loading.upload = true
    },
    handleSuccess(res) {
      if (res.status !== 200) {
        return this.$message.error('图片上传失败')
      }
      this.dataForm.icon = res.data

      const img = new Image()
      img.onload = () => {
        this.loading.upload = false
      }
      img.src = res.data
    },
    handleError(err) {
      this.$message.error('图片上传失败:' + err.message)
      this.loading.upload = false
    },
    handleNextLevel(row) {
      this.$router.push({ path: '/pms/category', query: { parentId: row.id }})
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scope>
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.flex-end {
  justify-content: flex-end;
}
</style>
