<template>
  <div class="add-song">
    <div class="content">
      <div class="header">
        <div class="title">Add Song</div>
        <i class="fas fa-times" @click="closeModal"></i>
      </div>
      <div class="form single">
        <div class="subtitle">Add Single Song</div>
        <input v-model="singleUrl" type="text" name="" id="" />
        <button @click="addSingle">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import settings from "@/settings.json";
import { Timestamp, db } from "../db";

export default {
  data() {
    return {
      googleApiKey: settings.youtubeApiKey,
      singleUrl: ""
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    addSingle() {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = this.singleUrl.match(regExp);
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${match[7]}&key=${this.googleApiKey}`
        )
        .then(function(response) {
          db.collection("playlist").add({
            Title: response.data.items[0].snippet.title,
            VideoID: match[7],
            TimeAdded: Timestamp.fromDate(new Date())
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-song {
  box-sizing: border-box;
  padding: 40px;
}
.content {
  background-color: rgb(68, 68, 68);
  padding: 10px;
  border-radius: 25px;
  height: 90%;
}
.add-song .header {
  display: flex;
  justify-content: space-between;
  font-size: 25px;
}
.add-song .form {
  text-align: center;
  margin-top: 100px;
}
.add-song .form input {
  outline: none;
  border: 1px solid rgba(163, 50, 106, 0.75);
  color: whitesmoke;
  padding: 7px;
  font-size: 14px;
  background-color: #333333;
  width: 70%;
}
.add-song .form button {
  outline: none;
  display: inline-block;
  padding: 0.3em 1.2em;
  margin: 0 0.1em 0.1em 0;
  border: 0.16em solid rgba(255, 255, 255, 0);
  border-radius: 2em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  color: #ffffff;
  text-shadow: 0 0.04em 0.04em rgba(0, 0, 0, 0.35);
  text-align: center;
  transition: all 0.2s;
  background-color: #9a4ef1;
}

.add-song .form button:hover {
  border-color: rgba(255, 255, 255, 1);
}
</style>
