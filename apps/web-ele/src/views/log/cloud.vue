<template>
<div>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-select filterable clearable v-model="productId" placeholder="请选择产品" @change="getEquipmentData()">
        <el-option v-for="item in products" :key="item.id" :label="item.productName" :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select filterable clearable v-model="equipmentId" collapse-tags placeholder="请选择设备" @change="logPage()">
        <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-input v-model="content" placeholder="请输入内容关键字" @change="logPage()"></el-input>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-date-picker v-model="timeRange" @change="timeChange" type="datetimerange" range-separator="至"
        start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        :picker-options="pickerOptions" />
    </el-col>
    <el-col :span="8">
      <el-select v-model="state" placeholder="请选择状态" @change="logPage()">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select v-model="businessType" placeholder="业务类型" @change="logPage()">
        <el-option v-for="item in businessTypeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="createTime" label="时间" width="180">
        </el-table-column>
        <el-table-column prop="traceID" label="TraceID" width="180">
        </el-table-column>
        <el-table-column prop="data" label="消息内容" width="180">
        </el-table-column>
        <el-table-column prop="productName" label="产品名称">
        </el-table-column>
        <el-table-column prop="deviceName" label="DeviceName">
        </el-table-column>
        <el-table-column prop="businessType" label="业务类型">
        </el-table-column>
        <el-table-column prop="state" label="状态">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <div class="demo-pagination-block">
    <el-pagination class="demo-pagination-block-el-pagination" v-model:currentPage="currentPage"
      v-model:page-size="pageSize" :page-sizes="[1, 2, 3, 10, 30, 50, 100]" :small="small"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="logPage"
      @current-change="logPage" />
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getProductListApi } from '#/api/core/product'
import { getEquipmentsApi } from '#/api/core/equipment'
import dayjs from 'dayjs';
import { pageLogApi } from '#/api/core/log'

const products = ref()
const equipmentData = ref()

const productId = ref()
const equipmentId = ref('')
const content = ref('')

//分页
let currentPage = ref(1)
let pageSize = ref(10)
const small = ref(false)
let total = ref(1)

const pageChange = async (val: number) => {
}

const getProductList = async () => {
  const params = {
    productName: '',
  };
  products.value = await getProductListApi(params);
}
getProductList()

const getEquipmentData = async () => {
  equipmentId.value = ''
  equipmentData.value = []
  let params = {
    productId: productId.value == null ? '' : productId.value,
  }
  equipmentData.value = await getEquipmentsApi(params);
  logPage()
}
const options = ref([{
  value: 'success',
  label: '成功'
}, {
  value: 'error',
  label: '失败'
}])
const state = ref('')

const businessTypeOptions = ref([{
  value: 'success',
  label: '成功'
}, {
  value: 'error',
  label: '失败'
}])
const businessType = ref('')

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
  logPage()
}

const tableData = ref([])

const logPage = async () => {
  let params = {
    type: "cloud",
    productId: productId.value,
    equipmentId: equipmentId.value,
    data: content.value,
    startTime: timeRange.value[0],
    endTime: timeRange.value[1],
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    state: state.value,
    businessType: businessType.value
  }
  let result = await pageLogApi(params);
  total.value = result.total;
  tableData.value = result.items;
}
logPage()
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

.demo-pagination-block {
  margin: 1%;
  float: right;
}
</style>
