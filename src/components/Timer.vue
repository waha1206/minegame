<template>
  <div class="timer">{{ hh }}小時 {{ mm }}分鐘 {{ ss }}秒</div>
</template>

<script>
import EventBus from "../eventBus.js";
export default {
  name: "timer",
  data() {
    return {
      hh: "00",
      mm: "00",
      ss: "00",
      startTime: 0,
      endTime: 0,
      timerId: 0
    };
  },
  created() {
    EventBus.$on("boom-end", () => {
      console.log("計時結束");
      this.endTime = Date.now();
      this.showTimer(this.endTime - this.startTime);
      clearInterval(this.timerId);
    });
    EventBus.$on("start-timer", () => {
      console.log("開始嚕");
      this.startTime = Date.now();
      this.timerId = setInterval(() => {
        let s = Date.now() - this.startTime;
        this.showTimer(s);
      }, 500);
    });
  },
  methods: {
    showTimer(s) {
      this.ss = String(Math.trunc(s / 1000) % 60).padStart(2, "0");
      this.mm = String(Math.trunc(s / (1000 * 60)) % 60).padStart(2, "0");
      this.hh = String(Math.trunc(s / (1000 * 60 * 60)) % 60).padStart(2, "0");
    }
  }
};
</script>

<style lang="scss" scoped></style>
