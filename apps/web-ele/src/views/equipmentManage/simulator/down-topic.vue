<template>
<div>
  <el-form label-position="top" :model="form" ref="formRef" :rules="rules">
    <el-form-item label="Topic" prop="subTopic">
      <el-select v-model="form.subTopic" placeholder="请选择">
        <el-option v-for="item in subTopics" :key="item.topic" :label="item.topic" :value="item.topic">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Payload 数据" prop="payload">
      <el-input type="textarea" resize="none" v-model="form.payload"></el-input>
    </el-form-item>
    <el-form-item label="QoS（Quality of Service）等级" prop="qos">
      <el-radio v-model="form.qos" label="1">0</el-radio>
      <el-radio v-model="form.qos" label="2">1</el-radio>
    </el-form-item>

    <el-button type="primary" @click="sendCommond">发送指令</el-button>
    <el-button type="info" @click="reset">重置</el-button>
  </el-form>
</div>
</template>

<script setup lang="ts">
import type { ElForm } from 'element-plus';
import { reactive, ref, watch } from 'vue';
import { getUserTopicsApi } from '#/api/core/equipment'
import { downTopicApi } from '#/api/core/simulator'

const props = defineProps({
  equipmentId: String
})

const subTopics = ref();
const topics = ref();

const getTopicsList = async (equipmentId: string | undefined) => {
  const params = {
    equipmentId: equipmentId,
  };
  topics.value = await getUserTopicsApi(params);
  subTopics.value= topics.value.filter((topic: { permission: string; }) => topic.permission === "1" || topic.permission === "2")
  console.log(subTopics.value)
}

watch(
  () => props.equipmentId,
  (newVal) => {
    console.log("Updated equipmentId:", newVal); // 会打印更新后的值
    if(newVal!=null && newVal !== ''){
      getTopicsList(newVal)
    }
  },
  { immediate: true } // 在组件挂载时立即执行一次回调
);

const form = reactive({
  subTopic: '',
  payload: '',
  qos: '',
})
const reset = async () => {
  form.subTopic = '',
  form.payload = '',
  form.qos = ''
}

const sendCommond = async () => {
  let params = {
    equipmentId: props.equipmentId,
    topic: form.subTopic,
    payload: form.payload,
    qos: form.qos
  }
  await downTopicApi(params);
}

const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

  const rules = reactive({
  payload: [
    { required: true, message: '请输入发送数据', trigger: 'change' },
  ],
  qos: [
    { required: true, message: '请输入qos等级', trigger: 'change' },
  ],
  subTopic: [
    { required: true, message: '请输入订阅topic', trigger: 'change' },
  ],
})
</script>

<style scoped></style>
