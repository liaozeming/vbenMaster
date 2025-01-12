<template>
<div style="margin:2%">
  <span style="font-size: 30px;">
    任务管理
  </span>
  <div style="margin-top:2%">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-button type="primary" @click="addTask">创建任务</el-button>
      </el-col>
      <el-col :span="6">
        <el-input v-model="task" @change="taskPage" placeholder="请输入任务名称">
          <!-- 使用插槽 -->
          <template #suffix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="任务名称" width="180">
        </el-table-column>
        <el-table-column prop="id" label="任务 ID" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="180">
        </el-table-column>
        <el-table-column prop="cron" label="cron表达式" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="180">
        </el-table-column>
        <el-table-column prop="scheduleTime" label="开始调度时间" width="180">
        </el-table-column>
        <el-table-column align="right">
          <template #header>
            <span style="margin-right: 26%;">操作</span>
          </template>
          <template #default="scope" style="margin-right: 10%;">
            <el-button size="small" @click="showTaskDetail(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" @click="cancelTask(scope.$index, scope.row)" v-if="scope.row.status!=='已取消'">取消</el-button>
            <el-button size="small" @click="redoTask(scope.$index, scope.row)" v-if="scope.row.status ==='已取消'">重新执行</el-button>
            <el-button size="small" type="danger" @click="deleteTask(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <div class="demo-pagination-block">
      <el-pagination class="demo-pagination-block-el-pagination" v-model:currentPage="currentPage"
        v-model:page-size="pageSize" :page-sizes="[1, 2, 3, 10, 30, 50, 100]" :small="small"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="logPage"
        @current-change="logPage" />
    </div>
  </div>


  <!-- 弹出层 -->
  <el-dialog v-model="dialogFormVisible" title="创建任务">
    <el-form label-position="top" :model="form" ref="formRef" :rules="rules">
      <el-form-item label="任务名称" label-width="140" prop="taskName">
        <el-input v-model="form.taskName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="目标产品" label-width="140" prop="productId">
        <el-select filterable clearable v-model="form.productId" placeholder="请选择产品" @change="getEquipmentData">
          <el-option v-for="item in products" :key="item.id" :label="item.productName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标设备" label-width="140" prop="equipmentIds">
        <el-select filterable clearable v-model="form.equipmentIds" multiple collapse-tags placeholder="请选择设备">
          <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务" label-width="140" prop="identifier">
        <el-select filterable clearable v-model="form.identifier" collapse-tags placeholder="请选择服务">
          <el-option v-for="item in services" :key="item.identifier" :label="item.name" :value="item.identifier">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="corn表达式" label-width="140" prop="corn">
        <el-input :rows="2" placeholder="请输入内容" v-model="form.corn"></el-input>
      </el-form-item>
      <el-form-item label="作业开始调度时间" label-width="140" prop="scheduleTime">
        <el-date-picker size="large" v-model="form.scheduleTime" format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务描述" label-width="140" prop="description">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.description">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetSubmitTask">取消</el-button>
        <el-button type="primary" @click="submitTask">确定</el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, type ElForm } from 'element-plus';
import { getProductListApi } from '#/api/core/product'
import { getEquipmentsApi } from '#/api/core/equipment'
import { getServices } from '#/api/core/tsl'
import { taskLogApi, addTaskApi, deleteTaskApi,updateStateTaskApi } from '#/api/core/task'
import { useRouter } from 'vue-router';
const router = useRouter();

let currentPage = ref(1)
let pageSize = ref(10)
const small = ref(false)
let total = ref(1)

const task = ref()
const products = ref()
const tableData = ref([])
const services = ref()

const showTaskDetail = async (index: number, task: any) => {
  router.push({ name: 'taskDetail', params: { id: task.id } });
}


const cancelTask = async (index: number, task: any) => {
  let params = {
    taskId: task.id,
    state : '已取消'
  }
  await updateStateTaskApi(params);
  taskPage()
}

const redoTask = async (index: number, task: any) => {
  let params = {
    taskId: task.id,
    state : '待调度'
  }
  await updateStateTaskApi(params);
  taskPage()
}


const deleteTask = async (index: number, task: any) => {
  let params = {
    taskId: task.id
  }
  await deleteTaskApi(params);
  taskPage()
}
const logPage = async () => {
}
logPage()


const addTask = async () => {
  dialogFormVisible.value = true;
}
const equipmentData = ref()
const getEquipmentData = async () => {
  form.equipmentIds = []
  form.identifier = ""
  equipmentData.value = []
  let params = {
    productId: form.productId == null ? '' : form.productId
  }
  equipmentData.value = await getEquipmentsApi(params);
  searchTsl()
}

// 弹出框
const dialogFormVisible = ref(false)

const form = reactive({
  taskName: "",
  productId: "",
  equipmentIds: [],
  identifier: "",
  corn: '',
  scheduleTime: '',
  description: '',
})

const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({
  taskName: [
    { required: true, message: '请输入任务名称', trigger: 'change' },
  ],
  productId: [
    { required: true, message: '请选择目标产品', trigger: 'change' },
  ],
  equipmentIds: [
    { required: true, message: '请选择目标设备', trigger: 'change' },
  ],
  identifier: [
    { required: true, message: '请选择服务', trigger: 'change' },
  ],
  corn: [
    { required: true, message: '请输入cron表达式', trigger: 'change' },
  ],
  scheduleTime: [
    { required: true, message: '请选择调度时间', trigger: 'change' },
  ],
})

const resetSubmitTask = async () => {
  formRef.value?.resetFields();
  dialogFormVisible.value = false;
}

const submitTask = async () => {
  if (formRef.value) {
    console.log(form)
    // 使用 validate 方法进行验证
    formRef.value.validate(async (valid) => {
      if (valid) {
        let result = await addTaskApi(form);
        if (result == true) {
          ElMessage({
            type: 'success',
            message: '新增成功',
          })
        } else {
          ElMessage({
            type: 'error',
            message: '新增失败',
          })
        }
        console.log(result)
        dialogFormVisible.value = false;
        formRef.value?.resetFields();
        taskPage()
      } else {
        console.log("数据验证失败!")
      }
    });
  }
}


const getProductList = async () => {
  const params = {
    productName: '',
  };
  products.value = await getProductListApi(params);
}
getProductList()


const searchTsl = async () => {
  const params = {
    productId: form.productId == null ? '' : form.productId
  };
  services.value = await getServices(params)
}

const taskPage = async () => {
  let params = {
    taskName: task.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }
  let result = await taskLogApi(params);
  total.value = result.total;
  tableData.value = result.items;
}
taskPage()
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.demo-pagination-block {
  margin: 1%;
  float: right;
}
</style>
