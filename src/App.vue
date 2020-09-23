<template>
  <div id="app">
    <h1>掃雷遊戲</h1>
    <div class="container">
      <div class="main"></div>
      <div class="aside">
        <el-radio-group v-model="level" size="mini">
          <el-radio-button label="簡單">簡單</el-radio-button>
          <el-radio-button label="中級">中級</el-radio-button>
          <el-radio-button label="高級">高級</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";

export default {
  name: "app",
  data: function() {
    return {
      level: "中級"
    };
  },
  components: {}
};
</script>

<style lang="scss">
#app {
  .container {
    display: flex;
    & > div {
      border: 1px solid #ccc;
    }
  }

  .main {
    flex: 5 0 500px;
    min-height: 300px;
  }
  .aside {
    flex: 2 0 200px;
    min-height: 300px;
  }
}
</style>
