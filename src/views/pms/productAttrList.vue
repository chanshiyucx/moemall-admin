<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-arrow-left" @click="goBack">返回属性分类</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleDialog()">新增属性</el-button>
    </div>

    <el-table v-loading="loading.table" :data="list" border fit>
      <el-table-column prop="id" label="ID" align="center" sortable width="100" />
      <el-table-column prop="name" label="名称" align="center" min-width="100">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleDialog(scope.row)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="是否可选" align="center" min-width="100">
        <template slot-scope="scope">{{ scope.row.selectType | selectTypeFilter }}</template>
      </el-table-column>
      <el-table-column label="录入方式" align="center" min-width="100">
        <template slot-scope="scope">{{ scope.row.inputType | inputTypeFilter }}</template>
      </el-table-column>
      <el-table-column prop="inputList" label="可选值" align="center" min-width="150" />
      <el-table-column prop="sort" label="排序" align="center" min-width="100" />
      <el-table-column label="操作" align="center" min-width="150px">
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
      :title="`${type === 'create' ? '新增' : '编辑'}属性`"
      :visible.sync="visible.dataForm"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="150px"
        style="width: 500px; margin-left:20px;"
      >
        <el-form-item label="商品类型" prop="name">
          <el-input disabled :value="cname" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="分类筛选样式" prop="filterType">
          <el-radio-group v-model="dataForm.filterType">
            <el-radio :label="0">普通</el-radio>
            <el-radio :label="1">颜色</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="能否进行检索" prop="searchType">
          <el-radio-group v-model="dataForm.searchType">
            <el-radio :label="0">不需要检索</el-radio>
            <el-radio :label="1">关键字检索</el-radio>
            <el-radio :label="2">范围检索</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品属性关联" prop="relatedStatus">
          <el-radio-group v-model="dataForm.relatedStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性是否可选" prop="selectType">
          <el-radio-group v-model="dataForm.selectType">
            <el-radio :label="0">唯一</el-radio>
            <el-radio :label="1">单选</el-radio>
            <el-radio :label="2">复选</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性值的录入方式" prop="inputType">
          <el-radio-group v-model="dataForm.inputType">
            <el-radio :label="0">手工录入</el-radio>
            <el-radio :label="1">从列表中选择</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性值可选值列表" prop="inputList">
          <el-input v-model="dataForm.inputList" :autosize="true" type="textarea" />
        </el-form-item>
        <el-form-item label="是否支持手动新增" prop="handAddStatus">
          <el-radio-group v-model="dataForm.handAddStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序属性" prop="sort">
          <el-input v-model="dataForm.sort" />
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
import { listAttribute, createAttribute, updateAttribute, deleteAttribute } from '@/api/productAttr'
import Pagination from '@/components/Pagination'

const initDataForm = {
  name: '',
  filterType: 0,
  handAddStatus: 0,
  inputList: '',
  inputType: 0,
  productAttributeCategoryId: 0,
  relatedStatus: 0,
  searchType: 0,
  selectType: 0,
  sort: 0,
  type: 0
}

export default {
  name: 'ProductAttr',
  components: { Pagination },
  filters: {
    selectTypeFilter(value) {
      if (value === 1) {
        return '单选'
      } else if (value === 2) {
        return '多选'
      } else {
        return '唯一'
      }
    },
    inputTypeFilter(value) {
      if (value === 1) {
        return '从列表中选取'
      } else {
        return '手工录入'
      }
    }
  },
  data() {
    return {
      cid: '',
      cname: '',
      ctype: '',
      loading: {
        table: false,
        dataForm: false
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
      type: 'create',
      dataForm: { ...initDataForm },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }]
      }
    }
  },
  created() {
    const { cid, cname, ctype } = this.$route.query
    this.cid = cid
    this.cname = cname
    this.ctype = ctype
    this.getData()
  },
  methods: {
    async getData() {
      this.loading.table = true
      try {
        const res = await listAttribute({ ...this.query, cid: this.cid, type: this.ctype })
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
        this.dataForm.productAttributeCategoryId = this.cid
        this.dataForm.type = this.ctype
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
        if (!valid) return this.$message.error('请完善属性信息')
        this.loading.dataForm = true
        try {
          const req = { ...this.dataForm }
          let res
          if (this.type === 'create') {
            res = await createAttribute(req)
          } else {
            res = await updateAttribute(req)
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
    handleDelete(row) {
      this.$confirm(`确定删除该属性?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.table = true
          try {
            const res = await deleteAttribute(row.id)
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
</style>
