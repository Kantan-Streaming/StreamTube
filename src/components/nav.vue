<template>
  <div class="nav">
    <div class="title">StreamTube</div>
    <div class="icons">
      <i class="fas fa-cog" @click="click('settings')"></i>
      <i class="fas fa-minus" @click="click('minimize')"></i>
      <i class="fas fa-times" @click="click('close')"></i>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { ipcRenderer } from "electron";
export default {
  methods: {
    click(type) {
      switch (type) {
        case "settings":
          router.push("/settings");
          break;
        case "minimize":
          ipcRenderer.send("minimizeApp");
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
