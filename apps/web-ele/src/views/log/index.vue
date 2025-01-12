<template>
<div style="margin:2%">
  <span style="font-size: 30px;">
    日志服务
  </span>
  <div style="margin-top:2%">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="云端运行日志" name="first">
        <cloud></cloud>
      </el-tab-pane>
      <el-tab-pane label="设备本地日志" name="second">
        <local></local>
      </el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>

<script setup lang="ts">
import local from './local.vue'
import cloud from './cloud.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const activeName = ref('first')
const router = useRouter();



</script>

<style scoped></style>
