<template>
<div>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="自定义 Topic" name="first">
      <down-topic :equipmentId="equipmentId"></down-topic>
    </el-tab-pane>
    <el-tab-pane label="属性调试" name="second">
      <down-attribute :equipmentId="equipmentId"></down-attribute>
    </el-tab-pane>
    <el-tab-pane label="服务调用" name="third">
      <down-event :equipmentId="equipmentId"></down-event>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup lang="ts">
import downAttribute from './down-attribute.vue'
import downTopic from './down-topic.vue'
import downEvent from './down-event.vue'
import { ref } from 'vue';
const props = defineProps({
  equipmentId: String
})

const activeName = ref('first')
</script>

<style scoped></style>
