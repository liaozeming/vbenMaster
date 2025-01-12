<template>
<div>
  <el-form :inline="true" :model="tslSelect" class="demo-form-inline">
    <el-form-item label="功能类型" style="margin-left: 1%;">
      <el-select v-model="tslSelect.type" style="width: 140px;" placeholder="功能类型">
        <el-option label="属性" value="property"></el-option>
        <el-option label="服务" value="service"></el-option>
        <el-option label="事件" value="event"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="功能名称">
      <el-input v-model="tslSelect.name" placeholder="功能名称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="searchTsl">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="clearTsl">清空</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addTslFunction()">新增</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="tslList" style="width: 100%; margin-top :3px">
    <el-table-column label="功能类型" prop="tslType">
    </el-table-column>
    <el-table-column label="功能名称（全部）" prop="name" />
    <el-table-column label="标识符" prop="identifier" />
    <el-table-column label="数据类型" prop="dataTypeString" />
    <el-table-column label="数据定义" prop="dataDefine" />
    <el-table-column label="描述" prop="desc" />
    <el-table-column align="right">
      <template #header>
        <span style="margin-right: 36%;">操作</span>
      </template>
      <template #default="scope">
        <el-button size="small" @click="editTslDetail(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="deleteTsl(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 编辑 -->
  <el-dialog v-model="dialogFormVisible" title="添加物模型" style="width: 40%;">
    <el-form label-position="top" :model="form" ref="formRef" :rules="rules">
      <el-form-item label="功能类型" label-width="140" prop="type" v-if="editTlsShow === false">
        <el-radio-group v-model="form.type">
          <el-radio-button label="property" value="property">属性</el-radio-button>
          <el-radio-button label="service" value="service">服务</el-radio-button>
          <el-radio-button label="event" value="event">事件</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="功能类型" label-width="140" prop="name" v-if="editTlsShow === true">
        <el-input v-model="editType" autocomplete="off" :disabled="true" />
      </el-form-item>
      <el-form-item label="功能名称" label-width="140" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="标识符" label-width="140" prop="identifier">
        <el-input v-model="form.identifier" autocomplete="off" />
      </el-form-item>
      <!-- property -->
      <el-form-item label="数据类型" label-width="140" prop="dataType" v-if="form.type === 'property'">
        <el-select v-model="form.dataType" placeholder="请选择">
          <el-option v-for="item in dataTypeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- bool -->
      <el-form-item label="布尔值" label-width="140" prop="boolValue" v-if="form.dataType === '3'">
        <div style=" display: flex;">
          <span>0:</span> <el-input style="margin-left: 2%;" v-model="form.falseValue" autocomplete="off" />
        </div>
        <div style=" display: flex; margin-left: 5%;">
          <span>1:</span> <el-input style="margin-left: 2%;" v-model="form.trueValue" autocomplete="off" />
        </div>
      </el-form-item>
      <el-form-item label="数据长度：" label-width="140" prop="stringlValue" v-if="form.dataType === '4'">
        <el-input v-model="form.stringValue" autocomplete="off" />
      </el-form-item>
      <!-- int double float -->
      <el-form-item label="取值范围" v-if="checkProperty()">
        <div style="display: flex; justify-content: space-between; gap: 10%;">
          <el-input v-model="form.minValue" placeholder="最小值"></el-input>
          <span> ~ </span>
          <el-input v-model="form.maxValue" placeholder="最大值"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="步长" label-width="140" v-if="checkProperty()">
        <el-input v-model="form.step" autocomplete="off" />
      </el-form-item>
      <el-form-item label="单位" label-width="140" v-if="checkProperty()">
        <el-input v-model="form.unit" autocomplete="off" />
      </el-form-item>
      <el-form-item label="读写类型" label-width="140" prop="accessMode" v-if="form.type === 'property'">
        <el-radio v-model="form.accessMode" label="2">读写</el-radio>
        <el-radio v-model="form.accessMode" label="0">只读</el-radio>
      </el-form-item>
      <!-- service -->
      <el-form-item label="调用方式" label-width="140" prop="callType" v-if="form.type === 'service'">
        <el-radio v-model="form.callType" label="0">异步</el-radio>
        <el-radio v-model="form.callType" label="1">同步</el-radio>
      </el-form-item>
      <el-form-item label="输入参数" label-width="140" v-if="form.type === 'service'">
        <el-button type="text" @click="showParameter()">+增加参数</el-button>
      </el-form-item>

      <el-form-item label="输出参数" label-width="140" v-if="form.type === 'service'">
        <el-button type="text" @click="showParameter()">+增加参数</el-button>
      </el-form-item>

      <!-- event -->
      <el-form-item label="事件类型" prop="eventType" label-width="140" v-if="form.type === 'event'">
        <el-radio v-model="form.eventType" label="0">信息</el-radio>
        <el-radio v-model="form.eventType" label="1">告警</el-radio>
        <el-radio v-model="form.eventType" label="2">故障</el-radio>
      </el-form-item>


      <el-form-item label="输出参数" label-width="140" v-if="form.type === 'event'">
        <el-button type="text" @click="showParameter()">+增加参数</el-button>
      </el-form-item>

      <el-form-item label="描述" label-width="140" prop="productName">
        <el-input v-model="form.desc" autocomplete="off" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="tslResetSubmit">取消</el-button>
        <el-button type="primary" @click="tslSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 新增参数 -->

  <el-dialog v-model="parameterFormVisible" title="新增参数" style="width: 40%;">
    <el-form label-position="top" :model="parameterForm" ref="parameterFormRef" :rules="parameterFormRules">
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="parameterReset">取消</el-button>
        <el-button type="primary" @click="parameterSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import type { Product, ProductpageResult } from '#/api/core/product';
import { ElMessage, ElMessageBox, type ElForm } from 'element-plus';
import { dataType } from 'element-plus/es/components/table-v2/src/common.mjs';
import { addTlsApi, getTlsListApi, deleteTslcApi } from '#/api/core/tsl'
const props = defineProps({
  productKey: String
})


// 使用ref创建响应式数组
let tslList = ref<any>([]);

watch(
  () => props.productKey,
  (newVal) => {
    console.log("Updated productKey:", newVal); // 会打印更新后的值
    searchTsl()
    productKey.value = props.productKey;
  }
);

const productKey = ref()
const tslSelect = ref({
  type: '',
  name: ''
})
//清空搜索
const clearTsl = async () => {
  tslSelect.value.type = ''
  tslSelect.value.name = ''
  searchTsl()
}
//搜索
const searchTsl = async () => {
  const params = {
    type: tslSelect.value.type,
    name: tslSelect.value.name,
    productKey: props.productKey,
  };
  tslList.value = await getTlsListApi(params)
  console.log(tslList.value)
}

const editTlsShow = ref(false)
//编辑时候显示
const editType = ref('属性')

const editTslDetail = async (index: number, tls: any) => {
  console.log(tls)
  dialogFormVisible.value = true,
    editType.value = tls.tslType,
    editTlsShow.value = true,
    form.name = tls.name,
    form.identifier = tls.identifier,
    form.type = tls.tslType === '属性' ? 'property' : tls.tslType === '服务' ? 'service' : 'event',
    form.desc = tls.desc,
    form.dataType = tls.dataType,
    form.previousIdentifier = tls.identifier,
    form.callType = tls.callType,
    form.eventType = tls.eventType,
    form.minValue = tls.minValue,
    form.maxValue = tls.maxValue,
    form.step = tls.step,
    form.unit = tls.unit,
    form.falseValue = tls.falseValue,
    form.trueValue = tls.trueValue,
    form.stringValue = tls.stringValue,
    form.accessMode = tls.accessMode
}

const deleteTsl = async (index: number, tls: any) => {
  let params = {
    tslType: tls.tslType === '属性' ? 'property' : tls.tslType === '服务' ? 'service' : 'event',
    name: tls.name,
    productKey: productKey.value,
  }
  ElMessageBox.confirm(
    '你确认要删除该功能吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      //调用接口
      await deleteTslcApi(params);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //刷新列表
      searchTsl()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消了删除',
      })
    })
}


// 弹出框
const dialogFormVisible = ref(false)

const form = reactive({
  productKey: '',
  type: "property",
  name: "",
  identifier: "",
  dataType: "",
  minValue: '',
  maxValue: '',
  step: '',
  unit: '',
  accessMode: '2',
  desc: '',
  callType: '0',
  eventType: "0",
  falseValue: '',
  trueValue: '',
  stringValue: '',
  previousIdentifier: '',
})

const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const rules = reactive({
  type: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
  ],
  identifier: [
    { required: true, message: '请输入标识符', trigger: 'blur' },
    {
      pattern: /^[A-Za-z]+$/,
      message: '只允许英文输入',
      trigger: 'change'
    }],
  dataType: [
    { required: true, message: '请输入数据类型', trigger: 'blur' },
  ],
  callType: [
    { required: true, message: '请选择调用方式', trigger: 'blur' },
  ],
  accessMode: [
    { required: true, message: '请选择读写范围', trigger: 'blur' },
  ],
  eventType: [
    { required: true, message: '请选择事件类型', trigger: 'blur' },
  ],
  boolValue: [
    { required: true, validator: validateBoolValues, trigger: 'blur' },
  ],
  stringlValue: [
    { required: true, validator: validateStringValues, trigger: 'blur' },
  ],
})

// 自定义验证器
function validateBoolValues(rule: any, value: any, callback: (error?: Error) => void) {
  const { falseValue, trueValue } = form;

  // 检查是否两个值都填写
  if (falseValue.trim() === '' || trueValue.trim() === '') {
    callback(new Error('布尔值的 0 和 1 都不能为空'));
  } else {
    callback(); // 验证通过
  }
}

function validateStringValues(rule: any, value: any, callback: (error?: Error) => void) {
  const { stringValue } = form;
  if (stringValue.trim() === '') {
    callback(new Error('数据长度不能为空'));
  } if (Number(stringValue) > 10240 || Number(stringValue) < 1) {
    callback(new Error('字符串长度应为1-10240'));
  }
  else {
    callback(); // 验证通过
  }
}

const tslResetSubmit = async () => {
  formRef.value?.resetFields();
  dialogFormVisible.value = false;
}

const tslSubmit = async () => {
  if (formRef.value) {
    // 使用 validate 方法进行验证
    formRef.value.validate(async (valid) => {
      if (valid) {
        form.productKey = productKey.value
        let result = await addTlsApi(form);
        if (result != null) {
          ElMessage({
            type: 'success',
            message: '新增成功',
          })
          dialogFormVisible.value = false;
          formRef.value?.resetFields();
          searchTsl()
        }
      } else {
        console.log("数据验证失败!")
      }
    });
  }
}

const dataTypeList = ref([{
  value: '0',
  label: 'int32(整数型)'
}, {
  value: '1',
  label: 'float(单精度浮点型)'
}, {
  value: '2',
  label: 'double(双精度浮点型)'
}, {
  value: '3',
  label: 'bool(布尔型)'
}, {
  value: '4',
  label: 'text(字符串)'
}]);


const checkProperty = () => {
  return form.type === 'property' && (form.dataType === '0' || form.dataType === '1' || form.dataType === '2')
}


//新增参数 服务 事件出入参
const parameterFormVisible = ref(false)

const parameterForm = reactive({
  productName: "abc"
})

const parameterFormRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`

const parameterFormRules = reactive({
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'change' },
  ],
})


const parameterReset = async () => {
  parameterFormRef.value?.resetFields();
  parameterFormVisible.value = false;
}

const parameterSubmit = async () => {
  if (parameterFormRef.value) {
    // 使用 validate 方法进行验证
    parameterFormRef.value.validate(async (valid) => {
      if (valid) {
        let result = null;
        if (result != null) {
          ElMessage({
            type: 'success',
            message: '新增成功',
          })
          parameterFormVisible.value = false;
          parameterFormRef.value?.resetFields();
        }
      } else {
        console.log("数据验证失败!")
      }
    });
  }
}

const showParameter = async () => {
  parameterFormVisible.value = true;
}

const addTslFunction = async () => {
  formRef.value?.resetFields(),
    dialogFormVisible.value = true,
    editTlsShow.value = false,
    form.name = '',
    form.identifier = '',
    form.type = 'property',
    form.desc = '',
    form.dataType = '',
    form.previousIdentifier = '',
    form.callType = '',
    form.eventType = '',
    form.minValue = '',
    form.maxValue = '',
    form.step = '',
    form.unit = '',
    form.falseValue = '',
    form.trueValue = '',
    form.stringValue = '',
    form.accessMode = ''
}

</script>

<style scoped></style>
