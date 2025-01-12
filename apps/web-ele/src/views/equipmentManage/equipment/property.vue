<template>
<div>
  <div class="search-header">
    <div class="search-header-input">
      <el-input v-model="propertySearchValue" @change="propertySearch" placeholder="请输入属性名称和标识符" />
    </div>
    <el-button type="primary" style="margin-left: 2%;" @click="propertySearch">刷新</el-button>

  </div>

  <div>
    <el-row :gutter="20">
      <el-col v-for="(card, index) in cards" :key="index" :span="8" style="margin-top: 1%;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ card.name }}</span>
            <el-button style="float: right; margin-top: -3%;" type="text" @click="showTlsData(card)">查看数据</el-button>
          </div>
          <div class="text item">
            <p>
              <span style="font-size: 40px">{{ card.data }}</span>
            </p>
            <p style="margin-top: 8%;">
              <span style="font-size: medium; color: grey">{{ card.time }}</span>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>


  <el-dialog v-model="dialogFormVisible" style="width: 900px;height:600px" :before-close="handleClose" :title="title">
    <el-row :gutter="20" style="margin-top: 1%;">
      <el-col :span="16">
        <el-date-picker v-model="timeRange" @change="timeChange" type="datetimerange" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" :picker-options="pickerOptions" />
        <!-- <div style="margin-top: 20px;">
          <p>开始时间: {{ timeRange[0] }}</p>
          <p>结束时间: {{ timeRange[1] }}</p>
        </div> -->
      </el-col>
      <el-col :span="8">
        <el-radio-group v-model="style" style="float: right;" @change="styleClick">
          <el-radio-button label="chart" :disabled="chartDisable">图表</el-radio-button>
          <el-radio-button label="table">表格</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="24">
        <div v-if="style == 'chart'">
          <div id="chart" style="width: 900px; height: 500px;"></div>
        </div>
        <div v-if="style == 'table'">
          <el-table :data="tableData" style="width: 900px; height: 450px;">
            <el-table-column prop="date" label="日期" width="420">
            </el-table-column>
            <el-table-column prop="name" label="原始值" width="420">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

  </el-dialog>

</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { getProperies, getChartData } from '#/api/core/tsl'
import dayjs from 'dayjs';
import * as echarts from 'echarts';
const xdata = ref(['a', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
const ydata = ref([150, 230, 224, 218, 135, 147, 260])

const type = ref()
const title = ref("查看数据")
const chartDisable = ref(false)

const generateChart = ((xdata: { value: any; }, ydata: { value: any; }) => {
  console.log(xdata.value)
  const chartDom = document.getElementById('chart');
  const myChart = echarts.init(chartDom);
  const option = {
    xAxis: {
      type: 'category',
      data: xdata.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: ydata.value,
        type: 'line'
      }
    ]
  };


  myChart.setOption(option);
});


// 弹出框
const dialogFormVisible = ref(false)

const props = defineProps({
  equipmentId: String
})

const propertySearchValue = ref('')

const cards = ref();
const cardTemp = ref();
const equipmentId = ref();



const style = ref('chart')

const tableData = ref()


const getProperiesApi = async (equipmentId: string | undefined) => {
  let params = {
    identifier: '',
    equipmentId: equipmentId,
  }
  cards.value = await getProperies(params);
}


watch(
  () => props.equipmentId,
  (newVal) => {
    console.log("Updated productKey1:", newVal); // 会打印更新后的值
    getProperiesApi(props.equipmentId)
    equipmentId.value = props.equipmentId
  },
  { immediate: true } // 在组件挂载时立即执行一次回调
);


const propertySearch = async () => {
  let params = {
    identifier: propertySearchValue.value,
    equipmentId: equipmentId.value,
  }
  cards.value = await getProperies(params);
}

const showTlsData = async (card: any) => {
  title.value = "查看数据 : " + card.name
  cardTemp.value = card
  console.log(card.dataType.type == "3")
  if (card.dataType.type == "3") {
    style.value = "table"
    chartDisable.value = true
  } else {
    style.value = "chart"
    chartDisable.value = false
  }
  dialogFormVisible.value = true
  let params = {
    identifier: card.identifier,
    equipmentId: equipmentId.value,
    startTime: timeRange.value[0],
    endTime: timeRange.value[1],
  }
  let result = await getChartData(params)
  xdata.value = result.dataArray;
  ydata.value = result.dateArray;
  const reversedXdata = [...xdata.value].reverse()
  const reversedYdata = [...ydata.value].reverse()
  tableData.value = reversedXdata.map((item, index) => ({
    date: item,
    name: reversedYdata[index]?.toString() || '',
  }))
  generateChart(xdata, ydata)
}


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


const styleClick = async (label: any) => {
  if (style.value == 'chart') {
    generateChart(xdata, ydata)
  }
}

const handleClose = async () => {
  dialogFormVisible.value = false;
  propertySearch()
}

const timeChange = async () => {
  showTlsData(cardTemp.value)
}
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

.search-header {
  display: flex;
}

.search-header-input {
  width: 300px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

. {
  display: flex;
  justify-content: space-between;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 300px;
  height: 140px
}

.item {
  margin-bottom: 18px;
}
</style>
