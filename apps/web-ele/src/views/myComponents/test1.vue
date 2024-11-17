<template>
    <el-date-picker
      v-model="time"
      type="datetime"
      placeholder="选择日期"
      format="YYYY/MM/DD hh:mm:ss"
    />


</template>

<script lang="ts" setup>

const time = defineModel('time')






</script>
<style scoped>
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-datetime-picker .block:last-child {
  border-right: none;
}
.demo-datetime-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
