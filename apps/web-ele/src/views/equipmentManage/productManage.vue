<template>
<div>
  <div v-show=!show>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>产品管理</span>
          <el-button class="button" text @click="createProduct()">创建产品</el-button>
        </div>
      </template>


      <el-table :data="productList" style="width: 100%">
        <el-table-column label="产品名称" prop="productName" />
        <el-table-column label="ProductKey" prop="productKey" />
        <el-table-column label="节点类型" prop="nodeType" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column align="right">
          <template #header>
            <el-input v-model="search" @change="searchProduct" size="small" placeholder="请输入产品名称查询" />
          </template>
          <template #default="scope">
            <el-button size="small" @click="getProductDetail(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteProject(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- 产品详情 -->
  <div v-if="show">
    <ProductDetail :productDetailId="productDetailId" @backToProject="backToProjectList()" />
  </div>

  <!-- 弹出框 -->
  <!-- Form -->
  <div class="dialog-form">
    <el-dialog v-model="dialogFormVisible" :title="title">
      <el-form label-position="top" :model="form" ref="formRef" :rules="rules">
        <!-- <el-form-item label="年龄" prop="age" :rules="[
          { required: true, message: '年龄不能为空' },
          { type: 'number', message: '年龄必须为数字值' }
        ]">
          <el-input v-model.number="form.age" autocomplete="off"></el-input>
        </el-form-item> -->

        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="productName">
          <el-input v-model="form.productName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属品类" :label-width="formLabelWidth" prop="type">
          <el-input v-model="form.type" autocomplete="off" />
        </el-form-item>
        <el-form-item label="结点类型" prop="nodeType">
          <el-radio-group v-model="form.nodeType">
            <el-radio label="直连设备"></el-radio>
            <el-radio label="网关子设备"></el-radio>
            <el-radio label="网关设备"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="连网方式" prop="onLineType">
          <el-radio-group v-model="form.onLineType">
            <el-radio label="Wi-Fi"></el-radio>
            <el-radio label="蜂窝(2G/3G/4G/5G)"></el-radio>
            <el-radio label="以太网"></el-radio>
            <el-radio label="其他"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="数据格式" prop="dataFormat">
          <el-radio-group v-model="form.dataFormat">
            <el-radio label="ICA 标准数据格式(Alink Json)"></el-radio>
            <el-radio label="透传/自定义"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="认证方式" prop="identifyType">
          <el-radio-group v-model="form.identifyType">
            <el-radio label="设备密钥"></el-radio>
            <el-radio label="ID²"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label=" 产品描述" :label-width="formLabelWidth" prop="description">
          <el-input type="textarea" autosize v-model="form.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetSubmitProduct">取消</el-button>
          <el-button type="primary" @click="submitProduct">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>


  <div class="demo-pagination-block" v-show="pageShow">
    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
      :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
      :total="total" @size-change="pageChange" @current-change="pageChange" />
  </div>

</div>
</template>

<script setup lang="ts">
import ProductDetail from './productDetail.vue'
import ProductAdd from './productAdd.vue'


import { reactive, computed, ref } from 'vue'
import type { Product, ProductpageResult } from '#/api/core/product';
import { getProductListApi, addProductListApi, deleteProductListApi, productPageList } from '#/api/core/product'
import { useRouter } from 'vue-router';
import { ElForm, ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter();

const search = ref('')
const show = ref(false)
// 使用ref创建响应式数组
const productList = ref<Product[]>([]);

//搜索
const searchProduct = async () => {

  const params = {
    productName: search.value,
  };
  productList.value = await getProductListApi(params);
  console.log(productList.value.length)
  total.value = productList.value.length
}
searchProduct()

//查看
const productDetailId = ref('')
const getProductDetail = async (index: number, product: Product) => {
  console.log(index)
  console.log(product.id)
  show.value = !show.value
  pageShow.value = false
  productDetailId.value = product.id
}


//删除产品
const deleteProject = async (index: number, product: Product) => {
  console.log(product.id)
  const params = {
    projectId: product.id,
  };
  ElMessageBox.confirm(
    '你确认要删除该产品信息吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      //调用接口
      let result = await deleteProductListApi(params);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //刷新列表
      searchProduct();
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
const formLabelWidth = '140px'
const form = reactive({
  identifyType: '',
  productName: '',
  type: '',
  nodeType: '',
  onLineType: '',
  dataFormat: '',
  description: ''
})
//定义变量,控制标题的展示
const title = ref('新增产品')

//显示创建产品
const createProduct = async () => {
  dialogFormVisible.value = true;
}

const backToProjectList = async () => {
  show.value = false;
  pageShow.value = true;
}



const rules = reactive({
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请输入所属品类', trigger: 'change' },
  ],
  nodeType: [
    { required: true, message: '请输入结点类型', trigger: 'change' },
  ],
  onLineType: [
    { required: true, message: '请输入连网方式', trigger: 'change' },
  ],
  dataFormat: [
    { required: true, message: '请输入数据格式', trigger: 'change' },
  ],
  identifyType: [
    { required: true, message: '请输入认证方式', trigger: 'change' },
  ],
})

const formRef = ref<InstanceType<typeof ElForm> | null>(null);  // `formRef` 的类型是 `ElForm` 实例或者 `null`


//创建产品
const submitProduct = async () => {
  if (formRef.value) {
    // 使用 validate 方法进行验证
    formRef.value.validate(async (valid) => {
      if (valid) {
        let result = await addProductListApi(form);
        console.log(result == null)
        if (result != null) {
          ElMessage({
            type: 'success',
            message: '新增成功',
          })
          dialogFormVisible.value = false;
          formRef.value?.resetFields();
          currentPage.value = 1;
          pageSize.value = 10;
          searchProduct()
        }
      } else {
        console.log("数据验证失败!")
      }
    });
  }

};
const resetSubmitProduct = async () => {
  formRef.value?.resetFields();
  dialogFormVisible.value = false;
}

//分页
let currentPage = ref(1)
let pageSize = ref(10)
const small = ref(false)
const disabled = ref(false)
const background = ref(false)
const pageShow = ref(true)
let total = ref(1)

// 使用ref创建响应式数组
const projectDataPage = ref<ProductpageResult>();

const pageChange = async (val: number) => {
  let params = {
    productName: search.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }
  projectDataPage.value = await productPageList(params);
  productList.value = projectDataPage.value.items;
  total.value = projectDataPage.value.total;
}


</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}

.dialog-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-pagination-block {
  margin: 1%;
  float: right;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>
