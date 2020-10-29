<template>
  <div class="settings">
    <div class="header">
      <div class="back" @click="goBack()">
        <i class="fas fa-arrow-left"></i>
      </div>
      <div class="title">Settings</div>
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
</style>
