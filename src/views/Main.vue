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
    <div class="remain">Remaining Songs - {{ displayList.length }}</div>
    <div class="list">
      <div class="song" v-for="(song, index) in displayList" :key="index">
        <div class="arrow">
          <i style="color: #696969" class="fas fa-caret-right"></i>
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
      <i
        style="width: 40%"
        class="control-icon fas fa-plus"
        @click="openModal"
      ></i>
      <div class="pause-play" style="width: 10%">
        <i v-if="playingStatus" class="fas fa-pause" @click="pause()"></i>
        <i v-else @click="play" class="fas fa-play"></i>
      </div>
      <input
        style="width: 30%"
        type="range"
        min="0"
        max="100"
        value="50"
        class="slider"
        id="myRange"
        v-model="volume"
      />
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
import addSong from "@/components/addSong.vue";
import axios from "axios";
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
      volume: 50,
      addSongPopup: false
    };
  },
  beforeMount() {
    this.currentlyPlaying = this.songQue[0];
    this.songQue.splice(0, 1);
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
      this.currentlyPlaying = this.songQue[1];
      this.songQue.splice(0, 1);
      this.player.setVolume(this.volume);
    },
    paused() {
      this.playingStatus = false;
    },
    playing() {
      this.playingStatus = true;
      this.displayList.splice(0, 1);
    },
    openModal() {
      this.addSongPopup = true;
    },
    closeModal() {
      this.addSongPopup = false;
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
    lastPlayed: db.collection("history").orderBy("Date")
  },
  watch: {
    playlist: function() {
      const that = this;
      this.playlist.forEach(video => {
        that.songQue.push(video.VideoID);
        that.displayList.push(video);
      });
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
  font-size: 25px;
  margin-left: 2px;
  margin-top: 15px;
}
.main .remain {
  padding: 5px;
}
.main .list .song .title {
  margin-left: 10px;
  font-size: 20px;
  text-align: center;
}
.main .controls {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 20px;
  position: fixed;
  bottom: 0;
}
.main .controls .pause-play i {
  border-radius: 50%;
  padding: 20px;
  border: white 2px solid;
}
.main .controls .control-icon {
  transform: translateY(34.5%);
  font-size: 20px;
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
