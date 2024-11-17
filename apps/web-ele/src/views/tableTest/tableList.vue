<template><el-card class="box-card">
  <template #header>
    <div class="card-header">
      <span>用户管理</span>
      <el-button class="button" @click="showAdd()" text>新增用户</el-button>
    </div>
  </template>

  <!-- 搜索表单 -->
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="Approved by">
      <el-input v-model="formInline.username" placeholder="Approved by" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="formInline.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item class="searchButton">
      <el-button type="primary" @click="onSubmit">搜索</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="id" prop="id" />
    <el-table-column label="username" prop="username" />
    <el-table-column label="Nickname" prop="nickname" />
    <el-table-column label="createTime" prop="createTime" />

    <el-table-column fixed="right" label="Operations" width="140">
      <!-- <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template> -->
      <template #default="scope">
        <el-button size="small" @click="showEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 弹出框 -->
  <!-- Form -->
  <el-dialog v-model="dialogFormVisible" :title="title">
    <el-form :model="form">
      <el-form-item label="username" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="nickname" :label-width="formLabelWidth">
        <el-input v-model="form.nickname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="创建时间" :label-width="formLabelWidth">
        <test1 v-model:time="time"></test1>

      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="title == '新增用户' ? handleAdd() : handleEdit()">Confirm</el-button>
      </span>
    </template>
  </el-dialog>

  <div class="demo-pagination-block">
    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
      :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>

</el-card>
</template>

<script lang="ts" setup>
import { reactive, computed, ref } from 'vue'
import { deleteUserApi, addUser, userPageList } from '#/api/core/table'
import type { User, UserpageResult } from '#/api/core/table'
import test1 from '#/views/myComponents/test1.vue';
import { ElMessageBox, ElMessage } from 'element-plus'

//分页
let currentPage = ref(1)
let pageSize = ref(10)
const small = ref(false)
const disabled = ref(false)
const background = ref(false)
let total = ref(1)

const handleSizeChange = (val: number) => {
  pageSize.value = val
  articleCategoryList();
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  articleCategoryList();
}

//搜索框
const formInline = reactive({
  username: '',
  region: '',
})

const onSubmit = async () => {
  let params = {
    username: formInline.username,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }
  tableData.value = await userPageList(params);
  total.value = tableData.value.total;
}

const reset = async () => {
  formInline.region = ''
  formInline.username = ''

  let params = {
    username: null,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }
  tableData.value = await userPageList(params);
  total.value = tableData.value.total;

}



// 使用ref创建响应式数组
const tableData = ref<UserpageResult>();

const articleCategoryList = async () => {
    let params = {
    username: null,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }
  tableData.value = await userPageList(params);
  total.value = tableData.value.total;
}
articleCategoryList();



// 弹出框

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  createTime: '',
  username: '',
  nickname: '',
  id: ''
})



const search = ref('')
const filterTableData = computed(() =>
  tableData.value?.items.filter(
    (data) =>
      !search.value ||
      data.username.toLowerCase().includes(search.value.toLowerCase())
  )
)



//定义变量,控制标题的展示
const title = ref('新增用户')

let time = ref()
const showAdd = async () => {
  dialogFormVisible.value = true;
  title.value = '新增用户'
  form.id = ''
  form.createTime = ''
  form.nickname = ''
  form.username = ''
  time.value = ''
}

const handleAdd = async () => {
  console.log(time.value);
  form.createTime = time.value;
  await addUser(form);
  ElMessage.success('新增成功')
  articleCategoryList();
  dialogFormVisible.value = false;
}

const showEdit = async (index: number, row: User) => {
  dialogFormVisible.value = true;
  form.createTime = row.createTime
  form.id = row.id,
  form.nickname = row.nickname,
  form.username = row.username,
  title.value = "编辑用户"

  // //调用接口
  // let result = await addUser(form);

  // ElMessage.success('修改成功')
  // //调用获取所有分类的函数
  // articleCategoryList();
  // //隐藏弹窗
  // dialogFormVisible.value = false;
}
const handleEdit = async () => {
  form.createTime = time.value;
  let result = await addUser(form);
  ElMessage.success('编辑成功')
  console.log("result" + result.nickname);
  articleCategoryList();
  dialogFormVisible.value = false;
}



const handleDelete = (index: number, row: User) => {
  console.log("index " + index)
  console.log("user " + row.username)
  ElMessageBox.confirm(
    '你确认要删除该分类信息吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      //调用接口
      let result = await deleteUserApi(row);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //刷新列表
      articleCategoryList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消了删除',
      })
    })

}
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}

.demo-pagination-block {
  margin-top: 1%;
  float: right;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

.el-select {
  width: 140px;
}

.searchButton {
  float: right;
}
</style>
