<template>
<div>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="基础通信 Topic" name="first">
      <basic-topic :productKey="props.productKey" />
    </el-tab-pane>
    <el-tab-pane label="物模型通信 Topic" name="second">
      <tsl-topic :productKey="props.productKey" />
    </el-tab-pane>
    <el-tab-pane label="自定义 Topic" name="third">
      <user-topic :productKey="props.productKey"/>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import basicTopic from './basicTopic.vue'
import tslTopic from './tslTopic.vue'
import userTopic from './userTopic.vue'

const props = defineProps({
  productKey: String
})

watch(
  () => props.productKey,
  (newVal) => {
    console.log("Updated productKey:", newVal); // 会打印更新后的值
  }
);

const activeName = ref('first')

const handleClick = async (tab: any, event: any) => {
  console.log(tab, event);
}




</script>

<style scoped></style>
