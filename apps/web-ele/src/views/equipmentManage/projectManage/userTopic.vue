<template>
<div>
  <div class="header">
    <el-button type="primary" @click="showAddTopic()">定义 Topic 类</el-button>
    <div class="header-input">
      <el-input v-model="search" @change="searchTopic" placeholder="请输入Topic" />
    </div>
  </div>

  <el-table :data="topicList" style="width: 100%">
    <el-table-column label="自定义 Topic" prop="topic" />
    <el-table-column label="操作权限" prop="permission" :formatter="formatPermission" />
    <el-table-column label="描述" prop="description" />
    <el-table-column align="right">
      <template #default="scope">
        <el-button size="small" @click="editTopic(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="deleteTopic(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>


<el-dialog v-model="dialogFormVisible" title="定义 Topic 类">
  <el-form label-position="top" :model="form" ref="formRef" :rules="rules">
    <el-form-item label="设备操作权限" prop="permission">
      <el-select v-model="form.permission" placeholder="设备操作权限">
        <el-option label="发布" value="0"></el-option>
        <el-option label="订阅" value="1"></el-option>
        <el-option label="发布和订阅" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Topic 类" label-width="140" prop="topic">
      <span>格式: /${productKey}/${deviceName}/user/</span>
      <el-input v-model="form.topic" autocomplete="off" placeholder="请输入你的Topic类" />
    </el-form-item>
    <el-form-item label="描述" label-width="140" prop="description">
      <el-input v-model="form.description" autocomplete="off" placeholder="请输入描述" />
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="resetSubmitTopic">取消</el-button>
      <el-button type="primary" @click="submitTopic">确定</el-button>
    </span>
  </template>
</el-dialog>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type ElForm } from 'element-plus';
import { addTopic, getTopics, deleteTopicApi } from '#/api/core/topic';
//接受父组件的productKey
const props = defineProps({
  productKey: String
})

watch(
  () => props.productKey,
  (newVal) => {
    console.log("userTopic:", newVal); // 会打印更新后的值
    getTopicList(newVal)
  }
);


const search = ref('')
// 使用ref创建响应式数组
const topicList = ref([]);


const getTopicList = async (productKey: string | undefined) => {
  let params = {
    productKey: productKey,
    topicSearch: search.value
  }
  let result = await getTopics(params);;
  topicList.value = result
}


//搜索
const searchTopic = async () => {
  getTopicList(props.productKey)
}
const formatPermission = (row: any, column: any, cellValue: number) => {
  const permissionMap: { [key: number]: string } = {
    0: '发布',
    1: '订阅',
    2: '发布和订阅',
  };
  return permissionMap[cellValue] || '未知权限';
};

const editTopicBefore = ref('')

const editTopic = async (index: number, topicObject: any) => {
  editTopicBefore.value = topicObject.topic
  dialogFormVisible.value = true
  form.topic = topicObject.topic.split('/').pop()
  form.description = topicObject.description
  form.permission = topicObject.permission
}

const deleteTopic = async (index: number, topicObject: any) => {
  let params = {
    topic: topicObject.topic,
    productKey: props.productKey,
  }
  ElMessageBox.confirm(
    '你确认要删除该Topic吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      //调用接口
      await deleteTopicApi(params);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //刷新列表
      getTopicList(props.productKey)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消了删除',
      })
    })

}


// 弹出框
const dialogFormVisible = ref(false)

const showAddTopic = async () => {
    form.topic = '',
    form.permission = '',
    form.description = '',
    dialogFormVisible.value = true;

}

const form = reactive({
  topic: "",
  permission: "",
  description: ""
})



const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({
  permission: [
    { required: true, message: '请选择操作权限', blur: 'change' },
  ],
  topic: [
    { required: true, message: '请输入你的Topic类', blur: 'change' },
  ],
  description: [
    { required: true, message: '请输入描述', blur: 'change' },
  ],
})

const resetSubmitTopic = async () => {
  formRef.value?.resetFields();
  form.permission = ""
  dialogFormVisible.value = false;
}

const submitTopic = async () => {
  if (formRef.value) {
    // 使用 validate 方法进行验证
    formRef.value.validate(async (valid) => {
      if (valid) {
        console.log("aaa", props.productKey)
        let params = {
          topic: form.topic,
          permission: form.permission,
          description: form.description,
          productKey: props.productKey,
          topicBefore: editTopicBefore.value
        }
        let result = await addTopic(params);
        if (result != null) {
          ElMessage({
            type: 'success',
            message: '新增成功',
          })
          dialogFormVisible.value = false;
          formRef.value?.resetFields();
          form.permission = ""
          getTopicList(props.productKey)
        }
      } else {
        console.log("数据验证失败!")
      }
    });
  }
}

</script>

<style scoped>
.header {
  display: flex;
}

.header-input {
  width: 20%;
  margin-left: 1%
}
</style>
