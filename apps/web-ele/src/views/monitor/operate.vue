<template>
<div class="whole">
  <el-card class="box-card">
    <operateDown :equipmentId="equipmentId"></operateDown>
  </el-card>

</div>
</template>

<script setup lang="ts">
import operateDown from './operate-down.vue'

const props = defineProps({
  equipmentId: String
})


</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
