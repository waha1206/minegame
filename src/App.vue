<template>
  <div id="app">
    <h1>掃雷遊戲</h1>
    <div class="container">
      <div class="main"></div>
      <div class="aside">
        <el-radio-group v-model="level" size="mini" @change="gameInit">
          <el-radio-button label="簡單"></el-radio-button>
          <el-radio-button label="中級"></el-radio-button>
          <el-radio-button label="高級"></el-radio-button>
        </el-radio-group>
        <div class="block">
          <span class="demonstration" :min="5" :max="100"
            >列數：{{ cols }}</span
          >
          <el-slider v-model="cols"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration" :min="5" :max="100"
            >行數：{{ rows }}</span
          >
          <el-slider v-model="rows"></el-slider>
        </div>
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
      level: "中級",
      cols: 10,
      rows: 10
    };
  },
  components: {},
  methods: {
    gameInit() {
      console.log(this.level);
    }
  }
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

  .block {
    margin-top: 10px;
    border-top: 1px solid blue;
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
