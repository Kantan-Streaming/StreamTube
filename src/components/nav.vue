<template>
  <div class="nav">
    <div class="title">StreamTube</div>
    <div class="icons">
      <i
        v-if="isPinned"
        style="color: red"
        class="fas fa-lock"
        @click="click('unpin')"
      ></i>
      <i
        v-else
        style="color: lime"
        class="fas fa-lock-open"
        @click="click('pin')"
      ></i>
      <i class="fas fa-cog" @click="click('settings')"></i>
      <i class="fas fa-minus" @click="click('minimize')"></i>
      <i class="fas fa-times" @click="click('close')"></i>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      isPinned: false
    };
  },
  methods: {
    click(type) {
      switch (type) {
        case "settings":
          this.$emit("toggleSettings");
          break;
        case "minimize":
          ipcRenderer.send("minimizeApp");
          break;
        case "pin":
          this.isPinned = true;
          ipcRenderer.send("pin");
          break;
        case "unpin":
          this.isPinned = false;
          ipcRenderer.send("unpin");
          break;
        default:
          ipcRenderer.send("closeApp");
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.nav {
  position: absolute;
  height: 25px;
  top: 0;
  width: 100%;
  background-color: rgb(54, 54, 54);
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  align-items: space-between;
}
.nav .title {
  margin-top: 3px;
  padding-left: 5px;
}
.nav .icons {
  padding-right: 3px;
  margin-top: 3px;
}

.nav .icons i {
  padding-right: 10px;
  -webkit-app-region: no-drag !important;
  cursor: pointer;
}
</style>
