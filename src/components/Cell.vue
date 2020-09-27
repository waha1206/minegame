<template>
  <td
    :class="{
      boom: cellData.isShowBoom,
      'mine-clear': cellData.isClear,
      mark: cellData.isMarked
    }"
    @mousedown="cellClick"
    class="cell"
    :style="{ width: size.w + 'px', height: size.h + 'px' }"
  >
    <!-- <template v-if="cellData.isBoom">
      B
    </template> -->
    <!-- <template v-else> -->
    <template>
      <span
        :style="{ color: getNumColor(cellData.data) }"
        v-if="cellData.data != 0 && cellData.isClear"
        >{{ cellData.data }}</span
      >
    </template>
    <!-- -{{ cellData.cellIndex }} -->
  </td>
</template>

<script>
import EventBus from "../eventBus.js";
export default {
  name: "cell",
  data() {
    return {};
  },
  methods: {
    getNumColor(num) {
      console.log(num);
      switch (num) {
        case 1:
          return "#fff";
        case 2:
          return "yellow";
        default:
          return "red";
      }
    },
    cellClick(e) {
      // 如果已經被清除過了，再點就是誤操作，返回
      if (this.cellData.isClear) {
        return;
      }

      if (e.button === 2) {
        this.$set(this.cellData, "isMarked", !this.cellData.isMarked);
        // 透過 EventBus 傳遞一個事件，讓所有其他的組件都可以監聽
        EventBus.$emit("click-cell");
      }
      // 0 = 左鍵
      if (e.button === 0) {
        if (this.cellData.isBoom) {
          // 是炸彈，就爆炸
          EventBus.$emit("boom-end");
          console.log("BOOM");
        } else {
          // 如果被標示了小旗子，就不做任何處理
          if (this.cellData.isMarked) return;
          // 透過 EventBus 傳遞一個事件，讓所有其他的組件都可以監聽
          EventBus.$emit("click-cell");
          // 讓當前的單元格顯示數字，清除當前單元格
          // this.$set(this.cellData, "isClear", true);
          // console.log(this.cellData.isClear);
          // 因為要處理的還包括了其他子組件，所以要把清理的座標，發給父容器讓她處理
          // 不應該再子元件裡面處理
          this.$emit("clearBoom", this.cellData.cellIndex);
        }
      }
    }
  },
  props: {
    cellData: { type: Object, required: true },
    size: {
      type: Object,
      required: false,
      default() {
        return {
          w: 30,
          h: 30
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
td {
  // 文字居中
  text-align: center;
  // 表格居中 垂直居中
  vertical-align: middle;
}
.mine-clear {
  background-color: #333 !important;
}
.mark {
  // 加上反斜線代表根目錄
  background-image: url(/flag.png) !important;
  background-size: cover;
}
.boom {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url(/boom.png) !important;
    background-size: contain;
  }
}
</style>
