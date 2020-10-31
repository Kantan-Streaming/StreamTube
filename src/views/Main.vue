<template>
  <div class="main">
    <div class="video">
      <youtube
        :video-id="currentlyPlaying"
        :fitParent="true"
        :player-vars="playerVars"
        ref="youtube"
        @ready="play"
        @ended="ended"
        @error="error"
        @paused="paused"
        @playing="playing"
      ></youtube>
    </div>
    <div class="player-title">
      <div class="now-playing">
        <span v-if="nowPlaying.Type == 'youtube'"
          ><i class="fab fa-youtube" style="color: red"></i
        ></span>
        <span v-else-if="nowPlaying.Type == 'twitch'"
          ><i class="fab fa-twitch" style="color: #6441a5"></i
        ></span>
        {{ nowPlaying.Title }}
      </div>
      <div class="remain">
        <i class="fab fa-itunes-note"></i>
        {{ displayList.length + twitchPlayList.length }}
      </div>
    </div>
    <div class="list">
      <div class="song" v-for="(song, index) in twitchPlayList" :key="index">
        <div class="arrow">
          <i style="color: #6441a5" class="fab fa-twitch"></i>
        </div>
        <div class="image">
          <img
            :src="`https://img.youtube.com/vi/${song.VideoID}/0.jpg`"
            alt=""
          />
        </div>
        <div class="title">{{ song.Title }}</div>
      </div>
      <div class="song" v-for="(song, index) in displayList" :key="index">
        <div class="arrow">
          <i style="color: red" class="fab fa-youtube"></i>
        </div>
        <div class="image">
          <img
            :src="`https://img.youtube.com/vi/${song.VideoID}/0.jpg`"
            alt=""
          />
        </div>
        <div class="title">{{ song.Title }}</div>
      </div>
    </div>
    <div class="controls">
      <i class="control-icon fas fa-plus" @click="openModal"></i>
      <i
        class="control-icon fab fa-ethereum"
        style="color: lime"
        v-if="playType != 'youtube'"
        @click="addToPlaylist"
      ></i>
      <i class="control-icon fab fa-ethereum" v-else></i>
      <div style="width: 30%"></div>
      <div class="pause-play" style="width: 10%">
        <i v-if="playingStatus" class="fas fa-pause" @click="pause()"></i>
        <i v-else @click="play" class="fas fa-play"></i>
      </div>
      <input
        style="width: 25%"
        type="range"
        min="0"
        max="100"
        value="50"
        class="slider"
        id="myRange"
        v-model="volume"
      />
      <i class="control-icon fas fa-forward" @click="ended"></i>
      <i
        style="width: 5%"
        class="control-icon fas fa-step-forward"
        @click="next()"
      ></i>
    </div>
    <addSong @close="closeModal" v-if="addSongPopup" class="add-song" />
  </div>
</template>

<script>
import { Timestamp, db } from "../db";
import axios from "axios";
import tmi from "tmi.js";

import addSong from "@/components/addSong.vue";
import settings from "@/settings.json";

export default {
  components: {
    addSong
  },
  data() {
    return {
      currentlyPlaying: "",
      currentTitle: "",
      playingStatus: true,
      songQue: [],
      displayList: [],
      playlist: [],
      playerVars: {
        autoplay: 1,
        controls: 0
      },
      googleApiKey: settings.youtubeApiKey,
      lastPlayed: [],
      playedVideos: [],
      volume: 20,
      addSongPopup: false,
      nowPlaying: "",
      twitchRequests: [],
      twitchPlayList: [],
      playType: ""
    };
  },
  props: {
    srOn: Boolean
  },
  beforeMount() {
    this.currentlyPlaying = this.songQue[0];
    this.songQue.splice(0, 1);
    const client = new tmi.Client({
      options: { debug: true },
      connection: {
        secure: true,
        reconnect: true
      },
      identity: {
        username: settings.twitchBot,
        password: settings.twitchToken
      },
      channels: [settings.twitchChannel]
    });

    client.connect();
    client.on("message", (channel, tags, message) => {
      if (message.includes("!sr") && !this.srOn) {
        client.say(
          settings.twitchChannel,
          `@${tags["display-name"]} Sorry song requests are currently disabled`
        );
      } else if (message.includes("!sr")) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = message.match(regExp);
        if (match) {
          this.addRequest(match[7]);
          client.say(
            settings.twitchChannel,
            `@${tags["display-name"]} Thanks for requesting! your song is number ${this.twitchRequests.length} in queue`
          );
        } else {
          client.say(
            settings.twitchChannel,
            `@${tags["display-name"]} This is not a valid youtube link`
          );
        }
      }
    });
  },
  methods: {
    async getVideoTitle(id) {
      return axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${id}&key=${this.googleApiKey}`
        )
        .then(function(response) {
          return response.data.items[0].snippet.title;
        });
    },
    async getCurrentVideoTitle() {
      const that = this;
      return axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${this.currentlyPlaying}&key=${this.googleApiKey}`
        )
        .then(function(response) {
          that.currentTitle = response.data.items[0].snippet.title;
        });
    },
    pause() {
      this.$refs.youtube.player.pauseVideo();
    },
    play() {
      this.player.playVideo();
    },
    async ended() {
      await this.getCurrentVideoTitle();
      db.collection("history").add({
        Title: this.currentTitle,
        VideoID: this.currentlyPlaying,
        Date: Timestamp.fromDate(new Date())
      });
      this.next();
    },
    error() {
      this.currentlyPlaying = this.songQue[0];
      this.player.setVolume(this.volume);
    },
    next() {
      this.playedVideos.push(this.currentlyPlaying);
      const that = this;
      if (this.twitchRequests.length > 0) {
        this.currentlyPlaying = this.twitchRequests[0];
        this.twitchRequests.splice(0, 1);
        this.twitchPlayList.splice(0, 1);
        this.playType = "twitch";
      } else {
        this.currentlyPlaying = this.songQue[1];
        this.songQue.splice(0, 1);
        this.displayList.splice(0, 1);
        that.playType = "youtube";
      }
      this.player.setVolume(this.volume);
    },
    paused() {
      this.playingStatus = false;
    },
    playing() {
      this.playingStatus = true;
      const that = this;
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${this.currentlyPlaying}&key=${this.googleApiKey}`
        )
        .then(function(response) {
          db.collection("playing")
            .doc("now")
            .update({
              Title: response.data.items[0].snippet.title,
              Type: that.playType
            });
        });
    },
    openModal() {
      this.addSongPopup = true;
    },
    closeModal() {
      this.addSongPopup = false;
    },
    async addRequest(videoId) {
      let title = await this.getVideoTitle(videoId);
      this.twitchPlayList.push({
        VideoID: videoId,
        Title: title
      });
      this.twitchRequests.push(videoId);
    },
    addToPlaylist() {
      if (this.playType == "twitch") {
        db.collection("playlist").add({
          Title: this.nowPlaying.Title,
          VideoID: this.currentlyPlaying,
          TimeAdded: Timestamp.fromDate(new Date())
        });
      }
    }
  },
  computed: {
    player() {
      this.playingStatus == true;
      return this.$refs.youtube.player;
    }
  },
  firestore: {
    playlist: db.collection("playlist").orderBy("TimeAdded"),
    lastPlayed: db.collection("history").orderBy("Date"),
    nowPlaying: db.collection("playing").doc("now")
  },
  watch: {
    playlist: function() {
      const that = this;
      this.playlist.forEach(video => {
        that.songQue.push(video.VideoID);
        that.displayList.push(video);
        that.playType = "youtube";
      });
      let removedFirst = 0;
      if (removedFirst === 0) {
        this.displayList.splice(0, 1);
        removedFirst = 1;
      }
    },
    lastPlayed: function() {
      if (this.lastPlayed.length > 20) {
        db.collection("history")
          .doc(this.lastPlayed[0].id)
          .delete();
      }
    },
    volume: function() {
      this.player.setVolume(this.volume);
    }
  }
};
</script>

<style lang="scss" scoped>
.main .list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 220px;
}
.main .list .song {
  display: flex;
}
.main .list .song img {
  height: 60px;
}
.main .list .song .arrow {
  width: 30px;
  font-size: 15px;
  margin-left: 2px;
  margin-top: 15px;
}
.main .player-title {
  display: flex;
  padding: 5px;
  justify-content: space-between;
}
.main .player-title .remain {
  width: 40px;
  display: flex;
}
.main .list .song .title {
  margin-left: 10px;
  font-size: 20px;
  text-align: center;
}
.main .controls {
  width: 100%;
  display: flex;
  height: 80px;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 5px;
  position: fixed;
  bottom: 0;
  background-color: rgb(29, 29, 29);
}
.main .controls .pause-play i {
  border-radius: 50%;
  padding: 20px;
  border: white 2px solid;
  cursor: pointer;
}
.main .controls .control-icon {
  transform: translateY(34.5%);
  font-size: 20px;
  cursor: pointer;
}
.main .controls .slider {
  appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  margin-top: 27px;
  background: red;
  outline: none;
}
.main .controls .slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.main .controls .slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background: white;
  cursor: pointer;
}
.add-song {
  position: absolute;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.7);
  top: 25px;
  width: 100%;
  height: 100%;
}
</style>
