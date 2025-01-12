<template>
<div>
  <div v-show="groupListShow">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>分组</span>
          <el-button class="button" type="primary" @click="addGroupShow">创建分组</el-button>
        </div>
      </template>
      <el-table :data="groupList" style="width: 100%">
        <el-table-column label="分组名称" prop="name" />
        <el-table-column label="分组ID" prop="id" />
        <el-table-column label="备注" prop="remarks" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column align="right">
          <template #header>
            <el-input v-model="search" @change="searchGroup" size="small" placeholder="请输入分组名称查询" />
          </template>
          <template #default="scope">
            <el-button size="small" @click="getGroupDetail(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="deletegroup(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- <div>
    <GroupDetail :groupId="groupId" :groupName="groupName" v-if="groupDetailShow" @backToGroup="backToGroupList()">
    </GroupDetail>
  </div> -->

  <el-dialog v-model="dialogFormVisible" title="添加分组">
    <el-form label-position="top" :model="form" ref="formRef" :rules="rules">
      <el-form-item label="分组名称" label-width="140" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注" label-width="140" prop="remarks">
        <el-input v-model="form.remarks" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetSubmitGroup">取消</el-button>
        <el-button type="primary" @click="submitGroup">确定</el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import GroupDetail from './groupDetail.vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { addGroupApi, getGroupsApi, deleteGroupApi } from '#/api/core/group'
import { useRouter } from 'vue-router';
const router = useRouter();


const search = ref('')
const groupDetailShow = ref(false)
const groupListShow = ref(true)
// 使用ref创建响应式数组
const groupList = ref<any[]>([]);
groupList.value = [{
  name: '分组',
}]
//搜索
const searchGroup = async () => {
  const params = {
    name: search.value,
  };
  groupList.value = await getGroupsApi(params);
}
searchGroup()

const getGroupDetail = async (index: number, group: any) => {
  // console.log('aaaa')
  // groupDetailShow.value = true;
  // groupListShow.value = false
  // groupId.value = group.id
  // groupName.value = group.name
  router.push({
    name: 'groupDetail', params: { id: group.id }
  });
}

const deletegroup = async (index: number, group: any) => {
  // console.log("删除", equipment.id)
  const params = {
    id: group.id
  };
  ElMessageBox.confirm(
    '你确认要删除该设分组信息吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      //调用接口
      await deleteGroupApi(params);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //刷新列表
      searchGroup()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消了删除',
      })
    })
}

const backToGroupList = async () => {
  groupListShow.value = true;
  groupDetailShow.value = false;
}


const addGroupShow = async () => {
  dialogFormVisible.value = true;
}


// 弹出框
const dialogFormVisible = ref(false)

const form = reactive({
  name: "",
  remarks: ""
})

const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({
  name: [
    { required: true, message: '请输入分组名称', trigger: 'change' },
  ]
})

const resetSubmitGroup = async () => {
  formRef.value?.resetFields();
  dialogFormVisible.value = false;
}

const submitGroup = async () => {
  if (formRef.value) {
    // 使用 validate 方法进行验证
    formRef.value.validate(async (valid) => {
      if (valid) {
        let result = addGroupApi(form);
        if (result != null) {
          ElMessage({
            type: 'success',
            message: '新增成功',
          })
          await searchGroup();
          dialogFormVisible.value = false;
          formRef.value?.resetFields();
        }
      } else {
        console.log("数据验证失败!")
      }
    });
  }
}

</script>

<style scoped>
.box-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
