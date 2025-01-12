<template>
<div>
  <div v-show="tableShow">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div class="container">
            <span class="text">设备管理</span>
            <div class="item">
              <span class="text">设备总数</span>
              <span class="number">{{ equipmentData.all }}</span>
            </div>
            <div class="item">
              <span class="text">激活设备</span>
              <span class="number" style="color: yellow;">{{ equipmentData.active }}</span>
            </div>
            <div class="item">
              <span class="text">当前在线</span>
              <span class="number" style="color: green;">{{ equipmentData.online }}</span>
            </div>
          </div>
        </div>
      </template>
      <div class="equipment-search">
        <el-button class="equipment-search-button" type="primary" @click="createEquipment()">添加设备</el-button>
        <el-select class="equipment-search-select" clearable v-model="productId" placeholder="全部产品"
          @change="searchEquipment()">
          <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id">
          </el-option>
        </el-select>

        <el-select class="equipment-search-select-device" v-model="DeviceNameSearch" placeholder="DeviceName"
          @change="searchEquipment()">
          <el-option v-for="item in selectSearch" :key="item.option" :label="item.name" :value="item.option">
          </el-option>
        </el-select>

        <el-input class="equipment-search-input" placeholder="请输入内容" v-model="searchValue" @change="searchEquipment()">
        </el-input>
      </div>
      <el-divider></el-divider>

      <div>
        <el-table :data="equipmentList" style="width: 100%">
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column label="DeviceName" prop="name" />
          <el-table-column label="备注名称" prop="remarks" />
          <el-table-column label="设备所属产品" prop="projectName" />
          <el-table-column label="节点类型" prop="nodeType" />
          <el-table-column label="设备状态" prop="state">
            <template #default="scope">
              <span>
                <span v-if="scope.row.enable === false">禁用</span>
                <span v-else-if="scope.row.state === '0'">未激活</span>
                <span v-else-if="scope.row.state === '1'">离线</span>
                <span v-else>在线</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" />
          <el-table-column label="最后上线时间" prop="lastOnlineTime" />
          <el-table-column label="启用/禁用" prop="enable">
            <template #default="scope">
              <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ff4949"
                @change="editEquipment(scope.$index, scope.row)" />
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <span style="margin-right: 36%;">操作</span>
            </template>
            <template #default="scope" style="width: 30%;">
              <el-button size="small" @click="showEquipmentDetail(scope.$index, scope.row)">查看</el-button>
              <el-button size="small" type="danger" @click="deleteEquipment(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>

  <div class="demo-pagination-block" v-show="pageShow">
    <!-- <el-button plain>删除</el-button>
    <el-button>禁用</el-button>
    <el-button>启用</el-button> -->

    <el-pagination class="demo-pagination-block-el-pagination" v-model:currentPage="currentPage"
      v-model:page-size="pageSize" :page-sizes="[1, 2, 3, 10, 30, 50, 100]" :small="small" :disabled="disabled"
      :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="pageChange"
      @current-change="pageChange" />
  </div>

  <!-- 新增设备 -->
  <el-dialog v-model="dialogFormVisible" title="添加设备">
    <el-form label-position="top" :model="form" ref="formRef" :rules="rules">
      <el-form-item label="产品名称" label-width="140" prop="productId">
        <el-select clearable v-model="form.productId" placeholder="请选择产品">
          <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="DeviceName" label-width="140" prop="deviceName">
        <el-input v-model="form.deviceName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注名称" label-width="140" prop="remarks">
        <el-input v-model="form.remarks" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetSubmitEquipment">取消</el-button>
        <el-button type="primary" @click="submitEquipment">确定</el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type ElForm } from 'element-plus';
import { getProductListApi } from '#/api/core/product'
import {
  addEquipmentApi, equipmentPageApi,
  deleteEquipmentcApi, editEquipmentApi, getEquipmentDataApi
} from '#/api/core/equipment'
import { useRouter } from 'vue-router';
const router = useRouter();

//分页
let currentPage = ref(1)
let pageSize = ref(10)
const small = ref(false)
const disabled = ref(false)
const background = ref(false)
const pageShow = ref(true)
let total = ref(1)
const equipmentData = ref(
  {
    all: "0",
    active: "0",
    online: "0"
  }
)

const search = ref('')


const productId = ref('')

const DeviceNameSearch = ref('option1')

const searchValue = ref('')

const tableShow = ref(true)
// 使用ref创建响应式数组
let equipmentList = ref<any[]>([]);

const getEquipmentList = async () => {
  let params = {
    projectId: productId.value === null ? '' : productId.value,
    name: DeviceNameSearch.value === 'option1' ? searchValue.value : '',
    remarks: DeviceNameSearch.value === 'option2' ? searchValue.value : '',
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }
  let result = await equipmentPageApi(params);
  equipmentList.value = result.items;
  total.value = result.total;
  //equipmentData数据
  await getEquipmentData()
}
getEquipmentList()


const getEquipmentData = async () => {
  let params = {
    productId: "",
  }
  equipmentData.value = await getEquipmentDataApi(params);
}


const showEquipmentDetail = async (index: number, equipment: any) => {
  router.push({ name: 'equipmentDetail', params: { id: equipment.id } });
}

const deleteEquipment = async (index: number, equipment: any) => {
  console.log("删除", equipment.id)
  const params = {
    equipmentId: equipment.id
  };
  ElMessageBox.confirm(
    '你确认要删除该设备信息吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      //调用接口
      await deleteEquipmentcApi(params);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //刷新列表
      getEquipmentList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消了删除',
      })
    })
}

const pageChange = async (val: number) => {
  getEquipmentList()
}

const selectSearch = ref([{
  option: 'option1',
  name: 'DeviceName'
}, {
  option: 'option2',
  name: '备注名称'
}])

//获取产品列表

const productList = ref()
const getProductList = async () => {
  const params = {
    productName: search.value,
  };
  productList.value = await getProductListApi(params);

}
getProductList();

const backToEquipmentList = async () => {
  tableShow.value = true;
  pageShow.value = true;
}
//搜索
const searchEquipment = async () => {
  console.log("productId.value", productId.value);
  console.log("DeviceName", DeviceNameSearch.value === 'option1' ? searchValue.value : '')
  console.log("备注", DeviceNameSearch.value === 'option2' ? searchValue.value : '')
  getEquipmentList()
}
//新增设备
const createEquipment = async () => {
  dialogFormVisible.value = true;
}


// 弹出框
const dialogFormVisible = ref(false)

const form = reactive({
  productId: "",
  deviceName: '',
  remarks: "",
})

const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({
  productId: [
    { required: true, message: '请选择产品名称', trigger: 'change' },
  ],
  deviceName: [
    { required: true, message: '请输入产品名称', trigger: 'change' },
    {
      pattern: /^[A-Za-z0-9]+$/,
      message: '产品名称只能包含英文字符和数字',
      trigger: 'blur'
    }
  ],
})

const resetSubmitEquipment = async () => {
  formRef.value?.resetFields();
  dialogFormVisible.value = false;
}

const submitEquipment = async () => {
  if (formRef.value) {
    // 使用 validate 方法进行验证
    formRef.value.validate(async (valid) => {
      if (valid) {
        let result = await addEquipmentApi(form);
        if (result != null) {
          ElMessage({
            type: 'success',
            message: '新增成功',
          })
          dialogFormVisible.value = false;
          formRef.value?.resetFields();
          getEquipmentList()
        }
      } else {
        console.log("数据验证失败!")
      }
    });
  }
}

//更新Equipment
const editEquipment = async (index: number, equipment: any) => {
  console.log(equipment.enable)
  await editEquipmentApi(equipment)
  getEquipmentList()
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

.equipment-search {
  display: flex;
  justify-content: space-between;
  width: 70%;
}

.equipment-search-select {
  margin-left: 1%;
  margin-right: 1%;
  width: 40%;
}

.equipment-search-select-device {
  margin-left: 1%;
  margin-right: 1%;
  width: 40%;
}

.equipment-search-input {
  width: 40%;
}

.container {
  display: flex;
  /* 使用 flex 布局 */
  justify-content: space-between;
  /* 平均分布文字，保持间隔 */
  align-items: center;
  /* 垂直居中 */
  width: 100%;
  /* 容器宽度 */
  max-width: 600px;
  /* 可根据需要调整 */
  margin: 0 0;
  /* 居中容器 */
}

.item {
  display: flex;
  flex-direction: column;
  /* 纵向排列文字和数字 */
  align-items: center;
  /* 水平居中 */
  text-align: center;
}

.text {
  font-size: 16px;
  /* 设置文字大小 */
  font-weight: bold;
  /* 文字加粗 */
  margin-bottom: 5px;
  /* 文字和数字之间的间距 */
}

.number {
  font-size: 16px;
  /* 设置数字大小 */
  color: #888;
  /* 数字颜色 */
}

.demo-pagination-block {
  margin: 1%;
  float: right;
}
</style>
