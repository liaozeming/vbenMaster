<template>
<div>
  <Drawer title="添加设备到分组" title-tooltip="添加设备到分组" class="w-[1000px]" cancelText="取消选择">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="margin-left: 1%; width : 40%">
        <el-select class="equipment-search-select" clearable v-model="productId" placeholder="全部产品"
          @change="equipmentListApi">
          <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="equipment-search-input" placeholder="请输入设备名称" v-model="equipmentName"
          @change="equipmentListApi">
        </el-input>
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
    </el-table>

    <!-- <div style="margin-top: 20px">
      <el-button @click="toggleSelection([equipmentList[1], equipmentList[2]])">切换第二、第三行的选中状态</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button type="primary" @click="">确认</el-button>
    </div> -->
  </Drawer>
</div>

<!-- <div class="flex-col-center">外部传递数据： {{ groupId }}</div> -->
</template>

<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { getProductListApi } from '#/api/core/product'
import { getNotAddToGroupEquipment } from '#/api/core/equipment'
import { addToGroupApi } from '#/api/core/group'
import { ElMessage } from 'element-plus';

const data = ref();
const groupId = ref('')
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    // drawerApi.close();
    toggleSelection()
  },
  async onConfirm() {
    //加入group
    // 使用 map 提取 id
    const equipmentIds = multipleSelection.value.map(item => item.id);
    const params = {
      equipmentIds: equipmentIds.length == 0 ? [] : equipmentIds,
      groupId: groupId.value ? groupId.value : ''
    };
    console.log(params)
    let result = await addToGroupApi(params);
    if (result != null) {
      ElMessage({
        type: 'success',
        message: '成功将设备添加到组',
      })
    }

    equipmentListApi()

  },

  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = drawerApi.getData<Record<string, any>>();
      groupId.value = data.value.groupId
      equipmentListApi()
    }
  },
});


//获取产品列表
const productList = ref()
const getProductList = async () => {
  const params = {
    productName: '',
  };
  productList.value = await getProductListApi(params);
}
getProductList();

const productId = ref('')
const equipmentName = ref('')
// Table data
// 使用ref创建响应式数组
const equipmentList = ref<any[]>([]);

const equipmentListApi = async () => {
  const params = {
    productId: productId.value,
    equipmentName: equipmentName.value
  };
  console.log(params)
  equipmentList.value = await getNotAddToGroupEquipment(params);
};
equipmentListApi()


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

</script>
