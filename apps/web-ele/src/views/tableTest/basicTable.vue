<template><el-card class="box-card">
  <template #header>
    <div class="card-header">
      <span>用户</span>
      <el-button class="button" @click="showAdd()" text>新增用户</el-button>
    </div>
  </template>

  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="id" prop="id" />
    <el-table-column label="username" prop="username" />
    <el-table-column label="Nickname" prop="nickname" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>
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
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.nickname" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="title == '添加分类' ? handleAdd() : handleEdit()">Confirm</el-button>
      </span>
    </template>
  </el-dialog>

</el-card>
</template>

<script lang="ts" setup>
import { reactive, computed, ref } from 'vue'
import { deleteUserApi, addUser, getTableListApi } from '#/api/core/table'
import type { User } from '#/api/core/table'
import { useAccess } from '@vben/access';
import { ElMessageBox, ElMessage } from 'element-plus'



// 使用ref创建响应式数组
const tableData = ref<User[]>([]);

const articleCategoryList = async () => {
  tableData.value = await getTableListApi();
}
articleCategoryList();

// 弹出框
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  username: '',
  nickname: '',
  id : ''
})



const search = ref('')
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.username.toLowerCase().includes(search.value.toLowerCase())
  )
)


//定义变量,控制标题的展示
const title = ref('新增用户')

const showAdd = async () => {
  dialogFormVisible.value = true;
  title.value = '新增用户'
  form.id = ''
  form.nickname =  ''
  form.username =  ''
}

const handleAdd = async () => {
  let result = await addUser(form);
  ElMessage.success('新增成功')
  console.log("result" + result.nickname);
  articleCategoryList();
  dialogFormVisible.value = false;
}

const showEdit =async (index: number, row: User) => {
  dialogFormVisible.value = true;
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
</style>
