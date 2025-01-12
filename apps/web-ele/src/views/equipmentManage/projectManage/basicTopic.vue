<template>
<div>
  <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
    <el-table-column prop="function" label="功能" width="100">
    </el-table-column>
    <el-table-column prop="topic" label="Topic类" width="680">
    </el-table-column>
    <el-table-column prop="permission" label="操作权限" width="100">
    </el-table-column>
    <el-table-column prop="description" label="	描述">
    </el-table-column>
  </el-table>
</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { getProductTopic } from '#/api/core/product'
const props = defineProps({
  productKey: String
})


watch(
  () => props.productKey,
  (newVal) => {
    console.log("Updated productKey1:", newVal); // 会打印更新后的值
    getBaseTopic(newVal)
  }
);

const tableData = ref([])

const getBaseTopic = async (productKey: string | undefined) => {

  const params = {
    productKey: productKey,
    type: '基础'
  };
  tableData.value = await getProductTopic(params);
}




// 合并单元格逻辑
const objectSpanMethod = (param: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  const { rowIndex, columnIndex } = param;
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: 4,
        colspan: 1,
      };
    } if (rowIndex === 4) {
      return {
        rowspan: 4,
        colspan: 1,
      };
    } if (rowIndex === 8) {
      return {
        rowspan: 2,
        colspan: 1,
      };
    } if (rowIndex === 10) {
      return {
        rowspan: 2,
        colspan: 1,
      };
    } if (rowIndex === 12) {
      return {
        rowspan: 3,
        colspan: 1,
      };
    }if (rowIndex === 15) {
      return {
        rowspan: 1,
        colspan: 1,
      };
    }else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};

</script>

<style scoped></style>
