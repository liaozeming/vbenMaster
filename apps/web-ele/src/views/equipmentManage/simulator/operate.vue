<template>
<div class="whole">
  <el-card class="box-card">
    <!-- <div slot="header" class="clearfix">
      <span>操作界面</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div> -->
    <el-tabs tab-position="top" type="border-card">
      <el-tab-pane label="上行指令调试">
        <operateUp :equipmentId="equipmentId"></operateUp>
      </el-tab-pane>
      <el-tab-pane label="下行指令调试">
        <operateDown :equipmentId="equipmentId"></operateDown>
      </el-tab-pane>
    </el-tabs>
  </el-card>

</div>
</template>

<script setup lang="ts">
import operateUp from './operate-up.vue'
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
