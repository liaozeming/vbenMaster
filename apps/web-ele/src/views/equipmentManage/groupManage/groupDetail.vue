<template>
<div class="group-detail">

  <div class="header">
    <el-page-header @back="goBack" content="分组详细信息">
    </el-page-header>
    <div class="header-button">
      <el-button type="primary" @click="" style="margin-left: 2%;">发布</el-button>
    </div>
  </div>
  <el-divider></el-divider>
  <el-descriptions class="margin-top" size="medium" :column="2" direction="horizontal">
    <el-descriptions-item label="分组ID:">{{ group?.id }}</el-descriptions-item>
    <el-descriptions-item label="设备总数:">{{ group?.all }}</el-descriptions-item>
    <el-descriptions-item label="激活设备:">{{ group?.active }}</el-descriptions-item>
    <el-descriptions-item label="当前在线:">{{ group?.online }}</el-descriptions-item>
  </el-descriptions>

  <el-divider></el-divider> 

  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">

    <el-tab-pane label="分组信息" name="first">

      <el-descriptions class="margin-top" title="分组信息" :column="3" direction="horizontal">
        <el-descriptions-item label="分组名称">{{ group?.name }}</el-descriptions-item>
        <el-descriptions-item label="分组 ID">{{ group?.id }}</el-descriptions-item>
        <el-descriptions-item label="设备总数:">{{ group?.all }}</el-descriptions-item>
        <el-descriptions-item label="激活设备:">{{ group?.active }}</el-descriptions-item>
        <el-descriptions-item label="当前在线:">{{ group?.online }}</el-descriptions-item>
        <el-descriptions-item label="创建时间:">{{ group?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="分组描述">{{ group?.remarks }}</el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>

    <el-tab-pane label="设备列表" name="second">
      <div>
        <groupEquipment :groupId="groupId"></groupEquipment>
      </div>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { reactive, computed, ref } from 'vue'
import groupEquipment from './groupEquipment.vue'
import { getGroupApi } from '#/api/core/group'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const groupId =ref() 
groupId.value = route.params.id; // 获取路径参数 id
const group = ref<any>();

const groupInfo = async () => {
  let params = {
    groupId: groupId.value
  }
  group.value = await getGroupApi(params)
}
groupInfo();

const emit = defineEmits(['backToGroup'])

const goBack = () => {
  router.go(-1)
}

const activeName = ref('first')


const handleClick = async (tab: any, event: any) => {
  console.log(tab, event);
}
</script>

<style scoped>
.group-detail {
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
