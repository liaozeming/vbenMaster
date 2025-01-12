<template>
<div>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-select v-model="eventType" placeholder="请选择" @change="timeChange" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-date-picker v-model="timeRange" @change="timeChange" type="datetimerange" range-separator="至"
        start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        :picker-options="pickerOptions" />
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="时间" width="180">
      </el-table-column>
      <el-table-column prop="identifier" label="标识符" width="260">
      </el-table-column>
      <el-table-column prop="name" label="事件名称" width="270">
      </el-table-column>
      <el-table-column prop="type" label="事件类型" width="280">
      </el-table-column>
      <el-table-column prop="out" label="输出参数" width="280">
      </el-table-column>
    </el-table>
  </el-row>
</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, watch } from 'vue';
import { getProperies, getEventData } from '#/api/core/tsl'


const props = defineProps({
  equipmentId: String
})

const equipmentId = ref()
const eventType = ref('')

const tableData = ref();


const showEventData = async (equipmentIdTemp: any) => {
  let params = {
    type: eventType.value,
    equipmentId: equipmentIdTemp,
    startTime: timeRange.value[0],
    endTime: timeRange.value[1],
  }
  tableData.value = await getEventData(params)
}


const options = ref([{
  value: '0',
  label: '信息'
}, {
  value: '1',
  label: '告警'
}, {
  value: '2',
  label: '故障'
}])


// 默认选择时间范围
const now = dayjs();
const timeRange = ref([
  now.subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
  now.format('YYYY-MM-DD HH:mm:ss'),
]);

// 可选快捷范围配置
const pickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker: { $emit: (arg0: string, arg1: string[]) => void; }) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [
          dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
          dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
        ]);
      },
    },
    {
      text: '最近一个月',
      onClick(picker: { $emit: (arg0: string, arg1: string[]) => void; }) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [
          dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
          dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
        ]);
      },
    },
  ],
};

const timeChange = async () => {
  showEventData(equipmentId.value)
}

watch(
  () => props.equipmentId,
  (newVal) => {
    console.log("Updated productKey1:", newVal); // 会打印更新后的值
    equipmentId.value = props.equipmentId
    showEventData(props.equipmentId)
  },
  { immediate: true } // 在组件挂载时立即执行一次回调
);
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
