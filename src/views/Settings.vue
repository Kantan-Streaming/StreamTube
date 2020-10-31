<template>
  <div class="settings">
    <div class="header">
      <div class="back" @click="goBack()">
        <i class="fas fa-arrow-left"></i>
      </div>
      <div class="title">Settings</div>
    </div>
    <div class="content">
      <div class="input-group">
        <div class="title">youtubeApiKey</div>
        <input type="text" />
      </div>
      <div class="input-group">
        <div class="title">firebaseAppId</div>
        <input type="text" />
      </div>
      <div class="input-group">
        <div class="title">twitchBot</div>
        <input type="text" />
      </div>
      <div class="input-group">
        <div class="title">twitchToken</div>
        <input type="text" />
      </div>
      <div class="input-group">
        <div class="title">twitchChannel</div>
        <input type="text" />
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
export default {
  methods: {
    goBack() {
      router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.settings .header {
  display: flex;
  font-size: 25px;
  margin-top: 10px;
}
.settings .header .back {
  margin-left: 5px;
  cursor: pointer;
}
.settings .header .title {
  margin-left: 10px;
}

.settings .content {
  box-sizing: border-box;
  padding: 2rem;
}
.settings .content input {
  outline: none;
  border: 1px solid rgba(163, 50, 106, 0.75);
  color: whitesmoke;
  padding: 7px;
  font-size: 14px;
  background-color: #333333;
  width: 89%;
}
</style>
