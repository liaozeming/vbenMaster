<template>
<div>
  <el-button type="primary" @click="showDialog">选择此设备到分组</el-button>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="设备所在分组" width="180">
    </el-table-column>
    <el-table-column prop="id" label="分组 ID">
    </el-table-column>
    <el-table-column prop="createTime" label="添加时间"> </el-table-column>

    <el-table-column align="right">
      <template #header>
        <span style="margin-right: 5%;">操作</span>
      </template>
      <template #default="scope">
        <el-button size="small" @click="showGroupDetail(scope.$index, scope.row)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>


  <el-dialog v-model="dialogFormVisible" title="选择此设备到分组">
    <el-form label-position="top" :model="form" ref="formRef" :rules="rules">
      <el-form-item label="分组名称" label-width="140" prop="groupId">
        <el-select filterable v-model="form.groupId" placeholder="请选择">
          <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select> </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetSubmitProduct">取消</el-button>
        <el-button type="primary" @click="submitProduct">确定</el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>

<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getGroupsApi } from '#/api/core/group'
import { getEquipmentGroupApi, editEquipmentGroupApi } from '#/api/core/equipment'
const props = defineProps({
  equipmentId: String
})


const router = useRouter();

const equipmentId = ref()

let tableData = ref<any[]>([]);
//获取设备的分组信息
const equipmentGroup = async () => {
  const params = {
    equipmentId: props.equipmentId,
  };
  tableData.value = await getEquipmentGroupApi(params)
}
equipmentGroup()


const showGroupDetail = async (index: number, row: any) => {
  router.push({ name: 'groupDetail', params: { id: row.id } });
};


// 弹出框
const dialogFormVisible = ref(false)

// 使用ref创建响应式数组
const groupList = ref<any[]>([]);

const showDialog = async () => {
  dialogFormVisible.value = true
  const params = {
    name: '',
  };
  groupList.value = await getGroupsApi(params);
}

const form = reactive({
  groupId: ""
})


const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({
  groupId: [
    { required: true, message: '请选择分组', trigger: 'change' },
  ],
})

const resetSubmitProduct = async () => {
  formRef.value?.resetFields();
  dialogFormVisible.value = false;
}

const submitProduct = async () => {
  if (formRef.value) {
    // 使用 validate 方法进行验证
    formRef.value.validate(async (valid) => {
      if (valid) {
        const params = {
          groupId: form.groupId,
          equipmentId: props.equipmentId
        };
        let result = await editEquipmentGroupApi(params);
        if (result != null) {
          ElMessage({
            type: 'success',
            message: '添加成功',
          })
          dialogFormVisible.value = false;
          formRef.value?.resetFields();
          equipmentGroup();
        }
      } else {
        console.log("数据验证失败!")
      }
    });
  }
}
</script>

<style scoped></style>
