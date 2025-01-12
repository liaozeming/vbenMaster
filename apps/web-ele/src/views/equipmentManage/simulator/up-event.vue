<template>
<div>
  <el-form label-position="left" :model="form" ref="formRef" :rules="rules">
    <el-form-item label="调试功能" prop="payload">
      <el-select clearable v-model="form.event" placeholder="请选择">
        <el-option v-for="item in events" :key="item.identifier" :label="item.name" :value="item.identifier">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="payload">
      <el-input type="textarea" rows="10" resize="none" v-model="form.payload"></el-input>
    </el-form-item>

    <el-button type="primary" @click="sendCommond">发送指令</el-button>
    <el-button type="info">策略推送</el-button>
    <el-button type="info" @click="reset">重置</el-button>
  </el-form>
</div>
</template>

<script setup lang="ts">
import type { ElForm } from 'element-plus';
import { reactive, ref } from 'vue';
import { getEventsApi } from '#/api/core/equipment'
import { eventPushApi } from '#/api/core/simulator'
const form = reactive({
  event: '',
  payload: '',
})

const props = defineProps({
  equipmentId: String
})
const events = ref();


const getEvents = async () => {
  let params = {
    equipmentId: props.equipmentId,
  }
  events.value = await getEventsApi(params);
}
getEvents()


const sendCommond = async () => {
  let params = {
    equipmentId: props.equipmentId,
    event: form.event,
    payload: form.payload
  }
  await eventPushApi(params);
}

const reset = async () => {
  form.event = ''
  form.payload = ''
}

const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({

})
</script>

<style scoped></style>
