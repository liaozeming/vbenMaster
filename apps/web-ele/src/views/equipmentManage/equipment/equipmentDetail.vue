<template>
<div class="equipment-detail">

  <div class="header">
    <el-page-header @back="goBack" content="设备详细信息"></el-page-header>
    <!-- <span>产品详细信息</span> -->

    <div class="header-button">
      <el-button type="primary" style="margin-right: 2%;">发布</el-button>
    </div>
  </div>

  <el-divider></el-divider>
  <el-descriptions class="margin-top" size="medium" :column="2" direction="horizontal">
    <el-descriptions-item label="产品:">{{ equipmentDetail?.projectName }}</el-descriptions-item>
    <el-descriptions-item label="DeviceSecret:">{{ equipmentDetail?.deviceSecret }}</el-descriptions-item>
    <el-descriptions-item label="ProductKey:">{{ equipmentDetail?.productKey }}</el-descriptions-item>
  </el-descriptions>

  <el-divider></el-divider>

  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">

    <el-tab-pane label="设备信息" name="first">

      <el-descriptions class="margin-top" size="default" :column="3" direction="horizontal">
        <el-descriptions-item label="产品名称:">{{ equipmentDetail?.projectName }}</el-descriptions-item>
        <el-descriptions-item label="ProductKey:">{{ equipmentDetail?.productKey }}</el-descriptions-item>
        <el-descriptions-item label="节点类型:">{{ equipmentDetail?.nodeType }}</el-descriptions-item>
        <el-descriptions-item label="DeviceName:">{{ equipmentDetail?.name }}</el-descriptions-item>
        <el-descriptions-item label="备注名称:">{{ equipmentDetail?.remarks }}</el-descriptions-item>
        <el-descriptions-item label="认证方式:">{{ equipmentDetail?.nodeType }}</el-descriptions-item>
        <el-descriptions-item label="ip地址:">{{ equipmentDetail?.ip }}</el-descriptions-item>
        <el-descriptions-item label="固件版本:">{{ equipmentDetail?.version }}</el-descriptions-item>
        <el-descriptions-item label="创建时间:">{{ equipmentDetail?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="激活时间:">{{ equipmentDetail?.activeTime }}</el-descriptions-item>
        <el-descriptions-item label="最后上线时间:">{{ equipmentDetail?.lastOnlineTime }}</el-descriptions-item>
        <el-descriptions-item label="当前状态:">{{ getStateText(equipmentDetail?.enable, equipmentDetail?.state)
          }}</el-descriptions-item>
        <el-descriptions-item label="MQTT 连接参数:"> 3 <el-button type="text" @click="showMqtt"
            style="margin-left: 2%;">查看</el-button>
        </el-descriptions-item>
      </el-descriptions>

    </el-tab-pane>

    <el-tab-pane label="Topic 类列表" name="second">
      <topicList :equipmentId="equipmentId"></topicList>
    </el-tab-pane>

    <el-tab-pane label="物模型数据" name="third">
      <tls :equipmentId="equipmentId"></tls>
    </el-tab-pane>


    <el-tab-pane label="分组" name="four">
      <group :equipmentId="equipmentId"></group>
    </el-tab-pane>

    <el-tab-pane label="任务" name="five">
      <task></task>
    </el-tab-pane>
    <!-- <el-tab-pane label="功能定义" name="third">
        <product-function-define :productKey="product?.productKey"/>
      </el-tab-pane>
      <el-tab-pane label="消息解析" name="fourth">消息解析</el-tab-pane>  -->
  </el-tabs>

  <!-- 弹出层 mqtt -->
  <el-dialog v-model="dialogFormVisible" title="MQTT 连接参数" :max-height="'160vh'" :fullscreen="false"
    style="margin-top: 15%;">
    <div style="max-height: 80vh; overflow-y: auto;">
      <div class="custom-descriptions">
        <!-- 每一行的标签和值 -->
        <div class="custom-item">
          <div class="custom-label">clientId</div>
          <div class="custom-content">
            {{ equipmentDetail.mqtt.clientId }}
          </div>
        </div>
        <div class="custom-item">
          <div class="custom-label">username</div>
          <div class="custom-content">
            {{ equipmentDetail.mqtt.userName }}
          </div>
        </div>
        <div class="custom-item">
          <div class="custom-label">passwd</div>
          <div class="custom-content">
            {{ equipmentDetail.mqtt.passwd }}
          </div>
        </div>
        <div class="custom-item">
          <div class="custom-label">mqttHostUrl</div>
          <div class="custom-content">
            {{ equipmentDetail.mqtt.mqttHostUrl }}
          </div>
        </div>
        <div class="custom-item">
          <div class="custom-label">port</div>
          <div class="custom-content">
            {{ equipmentDetail.mqtt.port }}
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="copyText">一键复制</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

</div>
</template>


<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import topicList from './topicList.vue';
import group from './group.vue';
import tls from './tls.vue';
import task from './task.vue';
import { getEquipmentDetailApi } from '#/api/core/equipment'
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const route = useRoute();
const equipmentId = ref()
const routeId = route.params.id; // 获取路径参数 id
equipmentId.value = routeId


const dialogFormVisible = ref(false)


const router = useRouter();


const equipmentDetail = ref<any>();

const getEquipmentDetail = async () => {
  const params = {
    equipmentId: equipmentId.value,
  };
  equipmentDetail.value = await getEquipmentDetailApi(params);
  textToCopy.value = JSON.stringify(equipmentDetail.value.mqtt);
}

getEquipmentDetail()

const activeName = ref('first')

const handleClick = async (tab: any, event: any) => {
  console.log(tab, event);
}

const emit = defineEmits(['backToEquipment'])

const goBack = () => {
  router.go(-1)
}

const getStateText = (enable: any, state: any) => {
  const stateMapping: { [key: number]: string } = {
    0: '未激活',
    1: '离线',
    2: '在线',
  };
  return !enable ? "禁用" : stateMapping[state] || '未知状态'
}

const showMqtt = () => {
  dialogFormVisible.value = true
}

const textToCopy = ref('')

// 复制文本
const copyText = async () => {
  try {
    await navigator.clipboard.writeText(textToCopy.value);
    ElMessage({
      message: '复制成功',
      type: 'success',
    });
  } catch (err) {
    console.error("复制失败", err);
  }
};
</script>


<style scoped>
.equipment-detail {
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
  margin-left: 1%;
}

.custom-descriptions {
  font-family: Arial, sans-serif;
}

.custom-item {
  display: flex;
  /* 启用 flexbox 布局 */
  justify-content: flex-start;
  /* 标签和内容从左到右排列 */
  padding: 8px 0;
  /* 添加上下间距 */
}

.custom-label {
  font-weight: bold;
  /* 标签字体加粗 */
  width: 150px;
  /* 固定标签列宽度 */
  text-align: left;
  /* 标签内容左对齐 */
  white-space: nowrap;
  /* 不换行 */
}

.custom-content {
  flex: 1;
  /* 内容列占用剩余空间 */
  text-align: left;
  /* 内容左对齐 */
  word-wrap: break-word;
  /* 内容超长时换行 */
  white-space: normal;
  /* 允许换行 */
}
</style>
