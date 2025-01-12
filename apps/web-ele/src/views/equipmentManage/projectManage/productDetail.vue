  <template>
  <div class="project-detail">

    <div class="header">
      <el-page-header @back="goBack" content="产品详情">
      </el-page-header>
      <div class="header-button">
        <el-button type="primary" @click="" style="margin-left: 2%;">发布</el-button>
      </div>
    </div>

    <el-divider></el-divider>
    <el-descriptions class="margin-top" size="medium" :column="2" direction="horizontal">
      <el-descriptions-item label="产品名称:">{{ product?.productName }}</el-descriptions-item>
      <el-descriptions-item label="ProductKey:">{{ product?.productKey }}</el-descriptions-item>
      <el-descriptions-item label="ProductSecret:">{{ product?.productSecret }}</el-descriptions-item>
      <el-descriptions-item label="设备数:"> 3 <el-button type="text" @click="toEquipments()" style="margin-left: 2%;">前往管理</el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-divider></el-divider>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">

      <el-tab-pane label="产品信息" name="first">

        <el-descriptions class="margin-top" title="产品信息" :column="3" direction="horizontal">
          <el-descriptions-item label="产品名称：">{{ product?.productName }}</el-descriptions-item>
          <el-descriptions-item label="节点类型：">{{ product?.nodeType }}</el-descriptions-item>
          <el-descriptions-item label="创建时间：">{{ product?.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人：">{{ product?.createPerson }}</el-descriptions-item>
          <el-descriptions-item label="所属品类：">{{ product?.type }}</el-descriptions-item>
          <el-descriptions-item label="数据格式：">{{ product?.dataFormat }}</el-descriptions-item>
          <el-descriptions-item label="认证方式：">{{ product?.identifyType }}</el-descriptions-item>
          <el-descriptions-item label="连网协议：">{{ product?.onLineType }}</el-descriptions-item>
          <el-descriptions-item label="状态：">{{ product?.state }}</el-descriptions-item>
          <el-descriptions-item label="产品描述:">{{ product?.description }}</el-descriptions-item>
        </el-descriptions>

      </el-tab-pane>

      <el-tab-pane label="Topic 类列表" name="second">
        <topic-list :productKey="product?.productKey"></topic-list>
      </el-tab-pane>

      <el-tab-pane label="功能定义" name="third">
        <product-function-define :productKey="product?.productKey"/>
      </el-tab-pane>
      <el-tab-pane label="消息解析" name="fourth">消息解析</el-tab-pane>
    </el-tabs>
  </div>
</template>


<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import type { Product } from '#/api/core/product';
import { getProductDetail } from '#/api/core/product'
import { useRouter } from 'vue-router';
import topicList from './topicList.vue'
import productFunctionDefine from './productFunctionDefine.vue'

const router = useRouter();

const props = defineProps({
  productDetailId: String
})

const product = ref<Product>();

const productDetail = async () => {
  const params = {
    productId: props.productDetailId,
  };
  product.value = await getProductDetail(params);
}

productDetail()

const activeName = ref('first')

const handleClick = async (tab: any, event: any) => {
  console.log(tab, event);
}

const emit = defineEmits(['backToProject'])

const goBack = () => {
  // router.go(-1)
  //router.push({path:'/equipment/productManage'})
  // router.back()
  emit('backToProject')
}

const toEquipments = () => {
  router.push({ path: '/equipment/equipmentManage'});
}
</script>


<style scoped>
.project-detail {
  margin: 1%;
}

.margin-top {
  width: 100%;
  margin-top: 1%;
}

.header {
  display: flex;
  justify-content: space-between;
}

.header-button {
  margin-right: 1%;
}
</style>
