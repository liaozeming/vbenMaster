<template>
<div>
  <el-form label-position="top" :model="formAttributes" ref="formRef" :rules="rules">
    <el-form-item v-for="(value, key) in formAttributes" :key="key" :label="key" :prop="value">
      <el-input v-model="valueAttributes[value]" placeholder="请输入内容"
        v-if="dataTypeAttributes[key].type !== '3'"></el-input>
      <el-select v-model="valueAttributes[value]" placeholder="请选择" v-if="dataTypeAttributes[key].type === '3'">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-button type="primary" @click="sendCommand">发送指令</el-button>
    <el-button type="info" @click="reset">重置</el-button>
  </el-form>
</div>
</template>

<script setup lang="ts">
import type { ElForm } from 'element-plus';
import { reactive, ref } from 'vue';
import { getPropertiesApi } from '#/api/core/equipment'
import { attributePushApi } from '#/api/core/simulator'

const options = ref([{
  value: '1',
  label: '开'
}, {
  value: '0',
  label: '关'
}])

const props = defineProps({
  equipmentId: String
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({
})

// Attributes received from the backend, this would be dynamically set
const formAttributes = ref();
const valueAttributes = ref();
const allAttributes = ref();
const dataTypeAttributes = ref();

const getProperties = async () => {
  let params = {
    equipmentId: props.equipmentId,
  }
  let data = await getPropertiesApi(params);
  allAttributes.value = data;
  const result = data.reduce((acc: { [x: string]: any; }, item: {
    name: any; identifier: string | number;
  }) => {
    acc[`${item.name}${item.identifier}`] = item.identifier;
    return acc;
  }, {});
  formAttributes.value = result


  const checkDataType = data.reduce((acc: { [x: string]: any; }, item: {
    dataType: any;
    name: any; identifier: string | number;
  }) => {
    acc[`${item.name}${item.identifier}`] = item.dataType;
    return acc;
  }, {});
  dataTypeAttributes.value = checkDataType
  console.log(dataTypeAttributes.value)

  const result1 = data.reduce((acc: { [x: string]: any; }, item: {
    name: any; identifier: string | number;
  }) => {
    acc[item.identifier] = '';
    return acc;
  }, {});
  valueAttributes.value = result1
}
getProperties()

const sendCommand = async () => {
  let params = {
    equipmentId: props.equipmentId,
    attributes: valueAttributes.value
  }
  await attributePushApi(params);
}

const reset = async () => {
  // 清空值
  Object.keys(valueAttributes.value).forEach(key => {
    valueAttributes.value[key] = '';
  });
}
</script>

<style scoped></style>
