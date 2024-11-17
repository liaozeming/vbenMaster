<template>
<div>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="基础通信 Topic" name="first">
      <basic-topic />
    </el-tab-pane>
    <el-tab-pane label="物模型通信 Topic" name="second">
      <tsl-topic />
    </el-tab-pane>
    <el-tab-pane label="自定义 Topic" name="third">
      <user-topic/>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import basicTopic from '#/views/equipmentManage/basicTopic.vue'
import tslTopic from '#/views/equipmentManage/tslTopic.vue'
import userTopic from '#/views/equipmentManage/userTopic.vue'


const activeName = ref('first')

const handleClick = async (tab: any, event: any) => {
  console.log(tab, event);
}




</script>

<style scoped></style>
