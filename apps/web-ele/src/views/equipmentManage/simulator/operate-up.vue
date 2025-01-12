<template>
<div>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="自定义 Topic" name="first">
      <up-topic :equipmentId="equipmentId"></up-topic>
    </el-tab-pane>
    <el-tab-pane label="属性上报" name="second">
      <up-attribute :equipmentId="equipmentId"></up-attribute>
    </el-tab-pane>
    <el-tab-pane label="事件上报" name="third">
      <up-event :equipmentId="equipmentId"></up-event>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup lang="ts">
import upAttribute from './up-attribute.vue'
import upTopic from './up-topic.vue'
import upEvent from './up-event.vue'
import { ref } from 'vue';

const activeName = ref('first')

const props = defineProps({
  equipmentId: String
})
</script>

<style scoped></style>
