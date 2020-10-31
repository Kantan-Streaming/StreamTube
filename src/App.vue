<template>
  <div id="app">
    <Nav
      :srOn="enableSongRequests"
      @toggleSettings="toggleSettings"
      @toggleSongRequests="toggleSongRequests"
    />
    <Main :srOn="enableSongRequests" />
    <Settings v-if="showSettings" @close="closeSettings" class="settings" />
  </div>
</template>

<script>
import Nav from "@/components/nav.vue";
import Main from "@/views/Main.vue";
import Settings from "@/views/Settings.vue";
export default {
  components: {
    Nav,
    Main,
    Settings
  },
  data() {
    return {
      showSettings: false,
      enableSongRequests: true
    };
  },
  methods: {
    toggleSongRequests() {
      this.enableSongRequests = !this.enableSongRequests;
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    closeSettings() {
      this.showSettings = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.settings {
  z-index: 9;
  position: absolute;
  top: 25px;
  background-color: rgb(29, 29, 29);
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap");
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(29, 29, 29);
  margin: 0;
}
html {
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  font-family: "Montserrat", sans-serif;
  width: 100%;
  height: 100%;
  color: whitesmoke;
  overflow: hidden;
  margin-top: 25px;
}
::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
::-webkit-scrollbar-thumb:active {
  background: #000000;
}
::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-track:hover {
  background: #666666;
}
::-webkit-scrollbar-track:active {
  background: #333333;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
