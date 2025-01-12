<template>
<div class="whole">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>实时日志</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>

    <el-table :data="messages" height="620">
      <!-- 显示消息类型和时间 -->
      <el-table-column prop="type" label="类型" width="80">
      </el-table-column>
      <el-table-column prop="time" label="时间" width="100">
      </el-table-column>
      <!-- 显示消息内容 -->
      <el-table-column prop="content" label="内容" width="270" :formatter="removeBackslashes" >
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
const props = defineProps({
  equipmentId: String
})


// 定义消息对象的类型
interface Message {
  type: string;  // 例如: 消息的类型
  content: string;  // 例如: 消息的内容
  time: string
}

// 定义消息的类型
const messages = ref<Message[]>([]);

// 创建 EventSource 实例的引用
let eventSource: EventSource | null = null;

// 组件挂载时初始化 SSE 连接
onMounted(() => {
  eventSource = new EventSource('http://localhost:8899/sse');

  eventSource.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data) as Message;
    // 将接收到的消息添加到 messages 中
    // messages.value.push(data);
    messages.value.unshift(data);
    console.log(messages.value)
  };

  eventSource.onerror = (error: Event) => {
    console.error('SSE Error: ', error);
  };
});

// 组件销毁前关闭 SSE 连接
onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close();
  }
});

// 去除反斜杠的格式化函数
const removeBackslashes = (row: any, column: any, cellValue: string) => {
  return cellValue.replace(/[\s\\]+/g, ''); // 去掉所有反斜杠
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
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
  width: 500px;
  height: 690px;
}
</style>
