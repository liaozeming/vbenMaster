<template>
  <div>
    <h1>Real-time MQTT Messages via SSE</h1>
    <div v-if="messages.length === 0">No messages received yet.</div>
    <div v-else>
      <ul>
        <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 定义消息的类型
const messages = ref<string[]>([]);

// 创建 EventSource 实例的引用
let eventSource: EventSource | null = null;

// 组件挂载时初始化 SSE 连接
onMounted(() => {
  eventSource = new EventSource('http://localhost:8899/sse');

  eventSource.onmessage = (event: MessageEvent) => {
    // 将接收到的消息添加到 messages 中
    messages.value.push(event.data);
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
</script>

<style scoped>
/* 添加样式来美化页面 */
h1 {
  color: #42b983;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  background-color: #f9f9f9;
  padding: 8px;
  margin: 4px;
  border-radius: 4px;
}
</style>
