<template>
<div>
  <div>

    <el-table :data="groupList" style="width: 100%">
      <el-table-column label="已订阅 Topic 列表" prop="name" />
    </el-table>

  </div>
</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getTopicsApi } from '#/api/core/equipment'


const props = defineProps({
  equipmentId: String
})
// 使用ref创建响应式数组
const groupList = ref<any[]>([]);

//搜索
const searchTopic = async (equipmentId: string | undefined) => {
  const params = { equipmentId };
  
  // 获取数据
  const topics = await getTopicsApi(params);
  
  // 转换为对象数组并赋值
  groupList.value = topics.map((item: string) => ({ name: item }));
};

watch(
  () => props.equipmentId,
  (newVal) => {
    console.log("Updated productKey:", newVal); // 会打印更新后的值
    searchTopic(props.equipmentId)
  },
  { immediate: true } // 在组件挂载时立即执行一次回调
);

</script>

<style scoped>
.box-card {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
