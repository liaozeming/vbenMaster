<template>
<div class="whole">
  <div class="header">
    <span class="text">
      在线调试
    </span>
  </div>
  <!-- <el-divider></el-divider> -->

  <!-- 设备选择 -->
  <div class="equipment-search">
    <span style="width: 20%; margin-top:1.6%;">调试设备:</span>
    <el-select filterable clearable v-model="productId" placeholder="请选择产品" style="width: 50%;"
      @change="getEquipmentData">
      <el-option v-for="item in products" :key="item.id" :label="item.productName" :value="item.id">
      </el-option>
    </el-select>

    <el-select filterable clearable v-model="equipmentId" collapse-tags style="margin-left: 20px; width: 50%;"
      placeholder="请选择设备" @change="changeEquipment">
      <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-switch style="margin-left: 5%" v-model="switchValue" @change="openMain" active-color="#13ce66"
      inactive-color="#ff4949">
    </el-switch>
    <span style="margin-left: 2%;margin-top: 1%;width:60px">{{ switchValue ? '开启' : '关闭' }}</span>
  </div>
  <div class="simulator-main" v-if="switchValue">
    <!-- 设备模拟器 -->
    <el-row>
      <el-col :span="14">
        <div>
          <operate :equipmentId="equipmentId"></operate>
        </div>
      </el-col>
      <!-- 日志 -->
      <el-col :span="10">
        <div>
          <log :equipmentId="equipmentId"></log>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import log from './log.vue'
import operate from './operate.vue'
import { getProductListApi } from '#/api/core/product'
import { getEquipmentsApi } from '#/api/core/equipment'
import { equipmentSimulatorApi } from '#/api/core/simulator'
import { monitorOnlieApi } from '#/api/core/monitor'
import { ElMessage } from 'element-plus';
import { onBeforeRouteLeave } from 'vue-router';
const products = ref()
const equipmentData = ref()

const productId = ref()
const equipmentId = ref('')

onBeforeRouteLeave(async (to, from, next) => {
  // 在这里你可以判断是否允许离开页面
  const hasChoose = equipmentId.value !== '' && equipmentId.value !== undefined && equipmentId.value !== null;
  console.log(hasChoose)
  if (hasChoose) {
    const shouldLeave = confirm('是否确定断开设备连接?');
    if (shouldLeave) {
      const params = {
        equipmentId: equipmentId.value,
        open: false
      };
      await equipmentSimulatorApi(params);
      //关闭连接
      next(); // 允许离开
    } else {
      next(false); // 阻止离开
    }
  } else {
    next();
  }
});

const getProductList = async () => {
  const params = {
    productName: '',
  };
  products.value = await getProductListApi(params);
}
getProductList()

const getEquipmentData = async () => {
  equipmentId.value = ''
  equipmentData.value = []
  let params = {
    productId: productId.value == null ? '' : productId.value,
  }
  equipmentData.value = await getEquipmentsApi(params);
}

const switchValue = ref(false)

//开启关闭
const openMain = async () => {
  if (equipmentId.value == null || equipmentId.value == '') {
    switchValue.value = false
    ElMessage({
      type: 'warning',
      message: '请先选择设备',
    })
    return
  }
  if (switchValue.value == true) {
    console.log("aaa"+equipmentId.value)
    const params = {
      equipmentId: equipmentId.value,
    };
    let online = await monitorOnlieApi(params);
    if (online == false) {
      switchValue.value = false
      ElMessage({
        type: 'warning',
        message: '设备不在线',
      })
      return
    }
  }
}
const changeEquipment = async () => {
  console.log(equipmentId.value)
}


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

.text {
  font-size: 22px;
  /* 设置文字大小 */
  font-weight: bold;
  /* 文字加粗 */
}

.whole {
  margin: 1%;

}

.header {
  margin: 2%;

}

.equipment-search {
  display: flex;
  justify-content: space-between;
  width: 60%;
  margin-left: 2%;
  margin-top: 3%;

}

.simulator-main {
  margin-top: 3%;
  margin-left: 2%;

}
</style>
