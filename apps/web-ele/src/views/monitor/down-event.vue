<template>
<div>
  <el-form label-position="left" :model="form" ref="formRef" :rules="rules">
    <el-form-item label="服务调用" prop="payload">
      <el-select clearable v-model="form.service" placeholder="请选择">
        <el-option v-for="item in services" :key="item.identifier" :label="item.name" :value="item.identifier">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="payload">
      <el-input type="textarea" rows="10" resize="none" v-model="form.payload"></el-input>
    </el-form-item>

    <el-button type="primary" @click="sendCommond">发送指令</el-button>
    <el-button type="info" @click="reset">重置</el-button>
  </el-form>
</div>
</template>

<script setup lang="ts">
import type { ElForm } from 'element-plus';
import { reactive, ref } from 'vue';
import { getServicesApi } from '#/api/core/equipment'
import { servicePushApi } from '#/api/core/monitor'


const props = defineProps({
  equipmentId: String
})
const services = ref();


const getServices = async () => {
  let params = {
    equipmentId: props.equipmentId,
  }
  services.value = await getServicesApi(params);
}
getServices()


const sendCommond = async () => {
  const params = {
    equipmentId: props.equipmentId,
    service: form.service,
    payload: form.payload
  };
   await servicePushApi(params);
}

const reset = async () => {
  form.service = ''
  form.payload = ''
}
const form = reactive({
  service: '',
  payload: '',
})

const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({

})
</script>

<style scoped></style>
