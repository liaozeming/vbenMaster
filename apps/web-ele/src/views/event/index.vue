<template>
  <div style="width: 108%; height: 108%; overflow: hidden;">
    <iframe
      :src="url"
      width="100%"
      height="100%" 
      frameborder="0"
      style="margin-left: -100px;margin-top: -70px"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "http://39.105.123.254:18083/#/rule/rules", // 要显示的页面链接
    };
  },
};
</script>
