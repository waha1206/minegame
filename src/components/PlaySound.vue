<template>
  <div class="playsound">
    <audio ref="sd" :src="srcSound"></audio>
  </div>
</template>

<script>
// 要監聽 EventBus 裡面的事件，先要引入
import EventBus from "../eventBus.js";
export default {
  name: "playsound",
  // 未來會從 父組件 傳遞一個檔案所在位置過來，會是一個字串，這邊會是檔案的位置
  props: {
    srcSound: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  created() {
    EventBus.$on("click-cell", () => {
      // 想要取得 DOM Element 的資訊時（例如寬度）
      // 想要從 父元件 取得 子元件 的資料時 => $refs.<你放在元素裡面的 value --- ref ="value">
      console.log("playSound - click-sound", this.srcSound);
      this.$refs.sd.play();
    });
    EventBus.$on("boom-end", () => {
      setTimeout(() => {
        this.$refs.sd.play();
      }, 100);
    });
  }
};
</script>

<style lang="scss" scoped>
.playsound {
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
}
</style>
