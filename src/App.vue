<template>
  <div id="app" class="container" style="padding:0;">
    <router-view :config="config" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {
        players: 5,
        dinting: 1,
        dintingMax: 2,
        blank: 0,
        blankMax: 1,
        isBegin: false,
        entry: [],
      uploading:true
      }
    };
  },
  mounted() {
    axios
      .get("http://a-1.vip/demo/dinting/api.php?type=getAll").then(({ data }) => {this.config.entry = data});
  }
};
</script>

<style lang="less">
#app {
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
