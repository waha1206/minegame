<template>
  <div id="app">
    <h1>掃雷遊戲</h1>
    <div class="container">
      <div class="main">
        <table class="mine-table">
          <tr v-for="(rowItem, rIndex) of rows" :key="'row_' + rIndex">
            <!-- <td
              :style="{ width: cellWidth + 'px', height: cellHeight + 'px' }"
              v-for="(colsItem, cIndex) of cols"
              :key="'col_' + cIndex"
            ></td> -->
            <cell
              @clearBoom="clearBoom"
              :cell-data="cellArray[rIndex * cols + cIndex]"
              :size="{ w: cellWidth, h: cellHeight }"
              v-for="(colsItem, cIndex) of cols"
              :key="'col_' + cIndex"
            ></cell>
          </tr>
        </table>
      </div>
      <div class="aside">
        <el-radio-group v-model="level" size="mini" @change="changeLevel">
          <el-radio-button label="簡單"></el-radio-button>
          <el-radio-button label="中級"></el-radio-button>
          <el-radio-button label="高級"></el-radio-button>
        </el-radio-group>
        <div class="block">
          <span class="demonstration">列數：{{ cols }}</span>
          <el-slider v-model="cols" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">行數：{{ rows }}</span>
          <el-slider v-model="rows" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <el-switch
            style="display: block"
            v-model="isCellWHSync"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是否同步寬高"
          >
          </el-switch>
        </div>
        <div class="block">
          <span class="demonstration">行高：{{ cellWidth }}</span>
          <el-slider v-model="cellWidth" :min="5"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">列高：{{ cellHeight }}</span>
          <el-slider v-model="cellHeight" :min="5"></el-slider>
        </div>
        <div class="block">
          <el-button type="danger" @click="initCellData">重置</el-button>
        </div>
      </div>
    </div>
    <timer></timer>
    <play-sound :src-sound="sound"></play-sound>
  </div>
</template>

<script>
import Cell from "./components/Cell";
import PlaySound from "./components/PlaySound";
import Timer from "./components/Timer";
import "element-ui/lib/theme-chalk/index.css";
import EventBus from "./eventBus.js";

export default {
  name: "app",
  data: function() {
    return {
      level: "簡單", // 簡單 1, 中級 2, 高級 3, 係數 0.15 100*0.15*2 = 30個地雷
      cols: 10,
      rows: 10,
      cellWidth: 30,
      cellHeight: 30,
      isCellWHSync: true,
      // {isBoom: false, data:2, isMarked:false , isClear:false}
      cellArray: [],
      isReset: true,
      sound: "click.mp3"
    };
  },
  created() {
    this.initCellData();
    // 點擊滑鼠右鍵出現 menu 的功能關閉
    document.oncontextmenu = () => {
      return false;
    };
    EventBus.$on("click-cell", () => {
      this.isReset && EventBus.$emit("start-timer");
      this.isReset = false;
    });
    EventBus.$on("boom-end", () => {
      this.sound = "boom.mp3";
      this.boomEnd();
    });
  },
  methods: {
    boomEnd() {
      this.cellArray.forEach(item => {
        if (item.isBoom) {
          item.isShowBoom = true;
        } else {
          this.$set(item, "isClear", true);
        }
      });
    },
    clearBoom(index) {
      const innerClearBoom = cIndex => {
        if (cIndex >= 0 && cIndex < this.cellArray.length) {
          let cell = this.cellArray[cIndex];
          if (cell.isMarked || cell.isBoom || cell.isClear) {
            return;
          }
          this.$set(this.cellArray[cIndex], "isClear", true);
          this.clearBoom(cIndex);
        }
      };
      // 如果當前自己不是0，那個，直接把自己清理掉，isClear true
      let cell = this.cellArray[index];
      if (cell.data !== 0) {
        this.$set(cell, "isClear", true);
        return;
      }
      // 如果自己是 0 周圍的元素都要 clear
      for (let i = -1; i <= 1; i++) {
        let startIndex = index - this.cols * i - 1;
        if (index % this.cols > 0) {
          innerClearBoom(startIndex);
        }
        innerClearBoom(startIndex + 1);
        if (index % this.cols < this.cols - 1) {
          innerClearBoom(startIndex + 2);
        }
      }
      // 如果被清理的元素，自己也是 0 那麼，該元素的周遭 8 個也要清理，使用遞歸元素
    },
    getBoomsNum(index, boomsSet) {
      let count = 0; // 周圍的炸彈數

      for (let i = -1; i <= 1; i++) {
        let startIndex = index - i * this.cols - 1;
        if (index % this.cols > 0) {
          count += boomsSet.has(startIndex);
        }
        count += boomsSet.has(startIndex + 1);
        if (index % this.cols < this.cols - 1) {
          count += boomsSet.has(startIndex + 2);
        }
      }
      return count;
    },
    changeLevel() {
      this.initCellData();
    },
    initCellData() {
      // 設置重置狀態
      EventBus.$emit("boom-end");
      this.isReset = true;
      this.sound = "click.mp3";
      //動態初始化一下： Cell 數組，動態隨機生成地雷數據
      let sum = this.cols * this.rows;
      //計算一共需要隨機設計多少地雷
			let randomBooms = this.getLevelNum() * 0.15 * sum; // eslint-disable-line
      // console.log(randomBooms);
      //不重複的數組，所以要定義一個set
      let randomIndexSet = new Set();
      while (randomIndexSet.size < randomBooms) {
        randomIndexSet.add(Math.trunc(Math.random() * sum));
      }
      //每次初始化的時候，輕鬆 cellArray 裡面的資料
      this.cellArray = [];
      // has() 方法對一個指定值元素在 Set 物件中的存在與否回傳一個布林值。
      for (let i = 0; i < sum; i++) {
        let isBoom = randomIndexSet.has(i);
        let data = this.getBoomsNum(i, randomIndexSet);
        this.cellArray.push({
          isBoom,
          isShowBoom: false,
          data,
          isMarked: false,
          isClear: false,
          cellIndex: i
        });
      }
    },
    getLevelNum() {
      if (this.level === "簡單") {
        return 1;
      } else if (this.level === "中級") {
        return 2;
      } else {
        return 3;
      }
    }
  },
  watch: {
    cellWidth(newValue) {
      this.isCellWHSync && (this.cellHeight = newValue);
    },
    cellHeight(newValue) {
      this.isCellWHSync && (this.cellWidth = newValue);
    },
    rows() {
      this.initCellData();
    },
    cols() {
      this.initCellData();
    }
  },
  components: {
    cell: Cell,
		"play-sound": PlaySound, // eslint-disable-line
    timer: Timer
  }
};
</script>

<style lang="scss">
#app {
  h1 {
    text-align: center;
  }
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
  .mine-table {
    border-collapse: collapse;
    td {
      width: 30px;
      height: 30px;
      border: 1px solid #c09;
      background-color: aliceblue;
    }
  }
}
</style>
