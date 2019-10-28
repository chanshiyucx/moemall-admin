<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <div class="search">
          <el-input v-model="search.name" placeholder="查询品牌" clearable>
            <template slot="prepend">名称</template>
          </el-input>
          <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
          <el-button type="warning" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="handleDialog()">新增品牌</el-button>
      </div>
    </el-card>

    <el-table v-loading="loading.table" :data="list" border fit>
      <el-table-column prop="id" label="ID" align="center" sortable width="100" />
      <el-table-column label="头像" align="center" min-width="100">
        <template slot-scope="scope">
          <img class="thumb" :src="scope.row.logo" alt @click="handleDialog(scope.row)" >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" align="center" min-width="100" />
      <el-table-column prop="firstLetter" label="首字母" align="center" width="100" />
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
      <el-table-column label="品牌制造商" align="center" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.factoryStatus"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="相关" width="220" align="center">
        <template slot-scope="scope">
          <span>商品：</span>
          <el-button size="mini" type="text" @click="goProduct(scope.row)">{{ scope.row.productCount }}</el-button>
          <span>评价：</span>
          <el-button size="mini" type="text" @click="goProductComment(scope.row)">{{ scope.row.productCommentCount }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" min-width="150" />
      <el-table-column label="操作" align="center" min-width="200px">
        <template slot-scope="scope">
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
      :title="`${type === 'create' ? '新增' : '编辑'}品牌`"
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
          <el-input v-model="dataForm.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="首字母" prop="firstLetter">
          <el-input v-model="dataForm.firstLetter" placeholder="请输入首字母" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="品牌故事" prop="brandStory">
          <el-input v-model="dataForm.brandStory" type="textarea" placeholder="请输入品牌故事" />
        </el-form-item>
        <el-form-item label="是否显示" prop="showStatus">
          <el-switch v-model="dataForm.showStatus" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="品牌制造商" prop="factoryStatus">
          <el-switch v-model="dataForm.factoryStatus" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logo">
          <Upload
            :loading="loading.uploadLogo"
            :preview="dataForm.logo"
            @beforeUpload="beforeUpload('Logo')"
            @handleSuccess="handleSuccess($event, 'Logo')"
            @handleError="handleError($event, 'Logo')"
          />
        </el-form-item>
        <el-form-item label="品牌专区大图">
          <Upload
            :loading="loading.uploadBigPic"
            :preview="dataForm.bigPic"
            @beforeUpload="beforeUpload('BigPic')"
            @handleSuccess="handleSuccess($event, 'BigPic')"
            @handleError="handleError($event, 'BigPic')"
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
import { listBrand, createBrand, updateBrand, updateBrandStatus, deleteBrand } from '@/api/brand'
import Pagination from '@/components/Pagination'
import Upload from '@/components/Upload'

const initDataForm = {
  name: '',
  firstLetter: '',
  sort: '',
  showStatus: 0,
  factoryStatus: 0,
  logo: '',
  bigPic: '',
  brandStory: ''
}

export default {
  name: 'Brand',
  components: { Pagination, Upload },
  data() {
    return {
      loading: {
        table: false,
        dataForm: false,
        uploadLogo: false,
        uploadBigPic: false
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
        name: ''
      },
      type: 'create',
      dataForm: { ...initDataForm },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        firstLetter: [{ required: true, message: '请输入品牌首字母', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'change' }],
        showStatus: [{ required: true, message: '请选择是否显示', trigger: 'change' }],
        factoryStatus: [{ required: true, message: '请选择是否为品牌制造商', trigger: 'change' }],
        brandStory: [{ required: true, message: '请输入品牌故事', trigger: 'change' }],
        logo: [{ required: true, message: '请上传品牌Logo', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleReset() {
      this.search = { name: '' }
      this.getData()
    },
    async getData() {
      this.loading.table = true
      try {
        const res = await listBrand({ ...this.query, ...this.search })
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
            res = await createBrand(req)
          } else {
            res = await updateBrand(req)
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
          factoryStatus: row.factoryStatus
        }
        const res = await updateBrandStatus(req)
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
            const res = await deleteBrand(row.id)
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
      this.loading[`upload${type}`] = true
    },
    handleSuccess(res, type) {
      if (res.status !== 200) {
        return this.$message.error('图片上传失败')
      }
      this.dataForm[type.toLowerCase()] = res.data

      const img = new Image()
      img.onload = () => {
        this.loading[`upload${type}`] = false
      }
      img.src = res.data
    },
    handleError(err, type) {
      this.$message.error('图片上传失败:' + err.message)
      this.loading[`upload${type}`] = false
    },
    goProduct() {

    },
    goProductComment() {

    }
  }
}
</script>

<style lang="scss" scope>
.el-card {
  margin-bottom: 15px;

  .filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search {
    display: flex;
    justify-content: flex-start;
    .el-input {
      margin-right: 10px;
      max-width: 300px;
    }
  }
}
</style>
