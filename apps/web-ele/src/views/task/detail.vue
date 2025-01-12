<template>
<div class="project-detail">

  <div class="header">
    <el-page-header @back="goBack" content="任务详情">
    </el-page-header>
  </div>

  <el-divider></el-divider>
  <el-descriptions class="margin-top" size="medium" :column="2" direction="horizontal">
    <el-descriptions-item label="任务 ID:">{{ task?.id }}</el-descriptions-item>
    <el-descriptions-item label="作业目标数:">{{ task?.equipmentIds.length }}</el-descriptions-item>
    <el-descriptions-item label="任务名称:">{{ task?.name }}</el-descriptions-item>
    <el-descriptions-item label="任务状态:">{{ task?.status }}
    </el-descriptions-item>
    <el-descriptions-item label="目标产品:">{{ task?.projectName }}</el-descriptions-item>
    <el-descriptions-item label="服务标识:">{{ task?.service.identifier}}</el-descriptions-item>
    <el-descriptions-item label="目标设备名称:">{{ task?.equipmentNames }}</el-descriptions-item>
    <el-descriptions-item label="corn表达式:">{{ task?.cron }}</el-descriptions-item>
    <el-descriptions-item label="创建时间:">{{ task?.createTime }}</el-descriptions-item>
    <el-descriptions-item label="开始调度时间:">{{ task?.scheduleTime }}</el-descriptions-item>
    <el-descriptions-item label="描述:">{{ task?.description }}</el-descriptions-item>
  </el-descriptions>
  <!-- <el-divider></el-divider> -->
  <!-- <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-row :gutter="20">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="设备名称" width="180">
        </el-table-column>
        <el-table-column prop="name" label="设备所属产品" width="180">
        </el-table-column>
        <el-table-column prop="date" label="调用服务" width="180">
        </el-table-column>
        <el-table-column prop="address" label="创建时间">
        </el-table-column>
        <el-table-column prop="name" label="调度时间" width="180">
        </el-table-column>
        <el-table-column prop="name" label="状态" width="180">
        </el-table-column>
      </el-table>
    </el-row>
  </el-tabs> -->

</div>
</template>


<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { getTaskDetail } from '#/api/core/task'
import { Search } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const activeName = ref('first')
const equipmentName = ref()

const taskId = route.params.id;

const task = ref();
const tableData = ref()

const taskDetail = async () => {
  const params = {
    taskId: taskId
  };
  task.value = await getTaskDetail(params);
}
taskDetail()
const handleClick = async (tab: any, event: any) => {
  console.log(tab, event);
}

const goBack = () => {
  router.go(-1)
}


</script>


<style scoped>
.project-detail {
  margin: 1%;
}

.margin-top {
  width: 100%;
  margin-top: 1%;
}

.header {
  display: flex;
  justify-content: space-between;
}

.header-button {
  margin-right: 1%;
}
</style>
