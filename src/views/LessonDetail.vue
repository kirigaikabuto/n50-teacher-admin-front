<template>

  <div>
    <div class="page-title">
      <h3>Урок {{ lesson.name }}</h3>
      <h4>{{ lesson.created_date }}</h4>
    </div>

    <section>
      <div class="row">
        <div class="player col s12 m6 l7">
          <video-player class="video-player-box"
                        ref="videoPlayer"
                        :options="playerOptions"
                        :playsinline="true"
                        customEventName="customstatechangedeventname"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)"
                        @ended="onPlayerEnded($event)"
                        @waiting="onPlayerWaiting($event)"
                        @playing="onPlayerPlaying($event)"
                        @loadeddata="onPlayerLoadeddata($event)"
                        @timeupdate="onPlayerTimeupdate($event)"
                        @canplay="onPlayerCanplay($event)"
                        @canplaythrough="onPlayerCanplaythrough($event)"
                        @statechanged="playerStateChanged($event)"
                        @ready="playerReadied">
          </video-player>
        </div>
        <div class="col s12 m6 l7">
          <div class="card light-blue bill-card">
            <div class="card-content white-text">
              <span class="card-title">Описание</span>
              <span class="card-content">{{ this.lesson.description }}</span>
              <span class="card-title">Документ</span>
              <span class="card-content"><a :href="this.lesson.document_file_url" >Файл</a></span>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script>

import {mapActions} from "vuex"
import 'video.js/dist/video-js.css'

import {videoPlayer} from 'vue-video-player'

export default {
  name: "LessonDetail",
  data() {
    return {
      lesson: null,
      playerOptions: null,
    }
  },
  methods: {
    ...mapActions([
      "getLessonById",
    ]),
  },
  components: {
    videoPlayer,
  },
  mounted() {
    console.log(this.$route.params.id)
    this.getLessonById({"id": this.$route.params.id}).then((resp) => {
      this.lesson = resp
      this.playerOptions = {
        height: '300',
        width: '685',
        autoplay: true,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: "video/mp4",
          // mp4
          src: this.lesson.video_file_url,
          // webm
          // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
        }],
        poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg",
      }
    })
    console.log(this.lesson)

  },
}
</script>

<style scoped>

</style>