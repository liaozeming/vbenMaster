<template>
<div>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item style="margin-left: 1%; width : 20%">
      <el-select class="equipment-search-select" clearable v-model="productId" placeholder="全部产品"
        @change="equipmentListApi">
        <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input class="equipment-search-input" placeholder="请输入设备名称" v-model="equipmentName" @change="equipmentListApi">
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="openBaseDrawer">添加设备到分组</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="deleteEquipmentsFromGroup">从分组中删除</el-button>
    </el-form-item>
  </el-form>


  <el-table ref="multipleTable" :data="equipmentList" style="width: 100%" tooltip-effect="dark"
    @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55">
    </el-table-column>
    <el-table-column label="DeviceName" prop="name" />
    <el-table-column label="设备所属产品" prop="projectName" />
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
    <el-table-column label="最后上线时间" prop="lastOnlineTime" />
    <el-table-column align="right">
      <template #header>
        <span style="margin-right: 36%;">操作</span>
      </template>
      <template #default="scope" style="width: 30%;">
        <el-button size="small" type="text" @click="showEquipment(scope.$index, scope.row)">查看</el-button> |
        <el-button size="small" type="text"
          @click="deleteEquipmentFromGroup(scope.$index, scope.row)">从分组中删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <Page>
    <BaseDrawer />
  </Page>
</div>
</template>

<script setup lang="ts">

import { ref, watch } from 'vue';
import { Page, useVbenDrawer } from '@vben/common-ui';
import BaseDemo from './equipment-drawer.vue'
import { getProductListApi } from '#/api/core/product'
import { getGroupEquipments, deleteEquipmentsFromGroupApi } from '#/api/core/equipment'
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
  groupId: String
})
const groupId = ref()
const productId = ref()
const equipmentName = ref('')
// 使用ref创建响应式数组
const equipmentList = ref<any[]>([]);

const equipmentListApi = async () => {
  const params = {
    productId: productId.value,
    equipmentName: equipmentName.value,
    groupId: groupId.value
  };
  console.log(params)
  equipmentList.value = await getGroupEquipments(params);
};

watch(
  () => props.groupId,
  (newVal) => {
    console.log("Updated groupId:", newVal); // 会打印更新后的值
    groupId.value = props.groupId
    equipmentListApi()

  },
  { immediate: true } // 在组件挂载时立即执行一次回调
);

//获取产品列表
const productList = ref()
const getProductList = async () => {
  const params = {
    productName: '',
  };
  productList.value = await getProductListApi(params);
}
getProductList();




const [BaseDrawer, baseDrawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: BaseDemo,

  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      equipmentListApi()
    }
  },
});


function openBaseDrawer() {
  //传递给抽屉数据
  baseDrawerApi.setData({
    groupId: props.groupId
  });
  baseDrawerApi.open();
}


// Selection state
const multipleSelection = ref<any[]>([]);

// Table ref
const multipleTable = ref<null | any>(null);

// Toggle selection function 
const toggleSelection = (rows?: any[]) => {
  if (multipleTable.value) {
    if (rows) {
      rows.forEach((row) => {
        multipleTable.value.toggleRowSelection(row);
      });
    } else {
      multipleTable.value.clearSelection();
    }
  }
};

// Handle selection change
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
};


const showEquipment = async (index: number, equipment: any) => {
  router.push({ name: 'equipmentDetail', params: { id: equipment.id } });
};


const deleteEquipmentFromGroup = async (index: number, equipment: any) => {
  console.log(equipment.id)
  const equipmentIds = []
  equipmentIds[0] = equipment.id
  const params = {
    "equipmentIds": equipmentIds,
  };
  await deleteEquipmentsFromGroupApi(params)
  equipmentListApi()
};

const deleteEquipmentsFromGroup = async () => {
  const equipmentIds = multipleSelection.value.map(item => item.id);
  const params = {
    "equipmentIds": equipmentIds,
  };
  await deleteEquipmentsFromGroupApi(params)
  equipmentListApi()
};

</script>

<style scoped></style>
