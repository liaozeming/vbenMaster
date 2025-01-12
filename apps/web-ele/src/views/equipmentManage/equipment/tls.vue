<template>
<div>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="运行状态" name="first">
      <property :equipmentId="props.equipmentId"></property>
    </el-tab-pane>
    <el-tab-pane label="事件管理" name="second">
      <event :equipmentId="props.equipmentId"></event>
    </el-tab-pane>
    <el-tab-pane label="服务调用" name="third">
      <service :equipmentId="props.equipmentId"></service>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import property from './property.vue'
import event from './event.vue'
import service from './service.vue'
const props = defineProps({
  equipmentId: String
})

const activeName = ref('first')


const handleClick = (tab: any, event: any) => {
  console.log(tab, event);
}
</script>

<style scoped></style>
