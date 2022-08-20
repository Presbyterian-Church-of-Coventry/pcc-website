<template>
  <Layout>
    <link
      href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css"
      rel="stylesheet"
    />
    <v-app>
      <h1 class="text-3xl font-bold">Secret Sermon Upload Page</h1>
      <form v-on:submit.prevent="submitForm" id="form" autocomplete="off">
        <v-row class="p-3 space-x-4">
          <v-select
            :items="Object.keys(sermons)"
            v-model="sermon"
            outlined
            dense
            :disabled="sermons.length == 0"
            label="Select Sermon to Upload"
            color="light-grey"
            @change="fetchSermonInfo()"
          ></v-select>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :loading="loading2"
                :disabled="loading2 || sermons.length == 0"
                color="success"
                fab
                small
                v-bind="attrs"
                v-on="on"
                @click="refreshAPI()"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Fetch newest bulletins</span>
          </v-tooltip>
        </v-row>
        <div v-if="sermon && !loading">
          <h1 class="font-bold">Sermon Info:</h1>
          <!-- Fill out sermon information, when the API responds these boxes will be autofilled -->
          <v-text-field
            label="Title"
            v-model="form.title"
            outlined
            dense
            :rules="[(v) => !!v || 'This field is required']"
            color="light-grey"
          ></v-text-field>
          <v-text-field
            label="Passage"
            v-model="form.text"
            :rules="[(v) => !!v || 'This field is required']"
            outlined
            dense
            color="light-grey"
          ></v-text-field>
          <v-select
            :items="series"
            outlined
            dense
            v-model="form.series"
            label="Series"
            color="light-grey"
          ></v-select>
          <v-select
            :items="speakers"
            outlined
            dense
            :rules="[(v) => !!v || 'This field is required']"
            v-model="form.speaker"
            label="Speaker"
            color="light-grey"
          ></v-select>
          <v-text-field
            label="API Key"
            placeholder="xxxx-xxxx-xxxx"
            v-model="form.API_Key"
            :rules="[
              (v) => !!v || 'This field is required',
              (v) =>
                /(.{4}-.{4}.{4})\w/.test(v) ||
                'Does not conform to API key pattern',
            ]"
            outlined
            dense
            maxlength="14"
            color="light-grey"
          ></v-text-field>
          <div v-if="form.videoId">
            <h1 class="font-bold my-4">
              Select the portion of the livestream which is the sermon:
            </h1>
            <div class="yt-frame max-w-4xl grid place-items-center">
              <youtube
                :video-id="form.videoId"
                resize
                ref="youtube"
                @ready="playerReady"
                @paused="updateSlider"
              ></youtube>
            </div>
            <div>
              <v-card flat color="transparent">
                <v-card-text>
                  <v-row>
                    <v-col class="px-4">
                      <v-range-slider
                        v-model="form.value"
                        :max="sliderMax"
                        :min="0"
                        hide-details
                        class="align-center"
                        @change="scrubVideo()"
                      >
                        <template v-slot:prepend>
                          <v-text-field
                            :value="form.value[0]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px;"
                            @change="$set(form.value, 0, $event), scrubVideo()"
                          ></v-text-field>
                        </template>
                        <template v-slot:append>
                          <v-text-field
                            :value="form.value[1]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px;"
                            @change="$set(form.value, 1, $event), scrubVideo()"
                          ></v-text-field>
                        </template>
                      </v-range-slider>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </div>
          <div class="my-10 grid place-items-center" v-else-if="!videoId">
            <b>Livestream Loading</b>
            <v-progress-linear indeterminate color="red"></v-progress-linear>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button
              type="submit"
              :disabled="
                !form.date ||
                !form.text ||
                !form.title ||
                !form.videoId ||
                !form.speaker ||
                !form.API_Key
              "
              class="button is-primary is-outlined text-lg"
              value="Submit"
            >
              Upload Sermon
            </button>
            <button
              type="submit"
              class="button is-primary is-outlined transition-colors duration-150 text-lg cursor-pointer focus:shadow-outline hover:bg-red-800"
              @click="clearForm()"
            >
              Clear Form
            </button>
          </div>
        </div>
        <div v-else-if="loading">
          <v-progress-linear indeterminate color="grey"></v-progress-linear>
        </div>
      </form>
      <div v-if="sermons.length == 0" class="py-8 grid place-items-center">
        <v-btn
          :loading="loading1"
          :disabled="loading1"
          class="text-center"
          depressed
          block
          color="error"
          @click="reFetch()"
        >
          <v-icon dark>
            mdi-alert
          </v-icon>
          Server Unavailable - Reload</v-btn
        >
      </div>
    </v-app>
  </Layout>
</template>

<script type="text/javascript">
import axios from 'axios'
import Vue from 'vue'
import VueYoutube from 'vue-youtube'

Vue.use(VueYoutube)

export default {
  data() {
    return {
      form: {
        // Make these values empty until API responds
        date: null,
        text: null,
        title: null,
        speaker: null,
        series: null,
        API_Key: this.$route.query.api_key,
        value: [0, 1],
        videoId: null,
      },
      loading: false,
      loading1: false,
      loading2: false,
      sliderMax: 1,
      sermon: null,
      series: null,
      sermons: [],
      series: [],
      speakers: [],
      disabled: false,
      uploaded: false,
    }
  },
  async created() {
    this.fetchSermons()
    this.fetchSeries()
    this.fetchSpeakers()
  },
  methods: {
    async reFetch() {
      this.loading1 = true
      this.fetchSermons()
      this.fetchSeries()
      this.fetchSpeakers()
      await new Promise((r) => setTimeout(r, 1000))
      this.loading1 = false
    },
    fetchSermons() {
      axios.get('https://api.blazenetworking.com/pcc/v1/sermons')
        .then((response) => response.data)
        .then((data) => (this.sermons = data))
    },
    fetchSeries() {
      axios.get('https://api.blazenetworking.com/pcc/v1/series')
        .then((response) => response.data)
        .then((data) => (this.series = data))
    },
    fetchSpeakers() {
      axios.get('https://api.blazenetworking.com/pcc/v1/speakers')
        .then((response) => response.data)
        .then((data) => (this.speakers = data))
    },
    fetchSermonInfo() {
      this.loading = true
      var sermon = this.sermons[this.sermon]
      axios.get('https://api.blazenetworking.com/pcc/v1/sermon/' + sermon)
        .then((response) => response.data)
        .then(
          (data) => (
            (this.form.date = data.date),
            (this.form.speaker = data.preacher),
            (this.form.text = data.text),
            (this.form.title = data.title),
            (this.form.videoId = data.videoId),
            (this.uploaded = data.uploaded)((this.loading = false))
          )
        )
    },
    async refreshAPI() {
      this.loading2 = true
      await axios
        .post('https://api.blazenetworking.com/pcc/v1/refresh')
        .then((res) => {
          if (res.data == 'success') {
            alert('API Server checking for new sermon dates to upload!')
          } else {
            alert(
              'API Server already refreshed its data in the last 60 seconds'
            )
          }
        })
        .catch((error) => {
          alert(error)
        })
      this.loading2 = false
    },
    getDuration() {
      return new Promise((resolve) => {
        this.player.getDuration().then((response) => {
          resolve(response)
        })
      })
    },
    async playerReady() {
      var max = await this.player.getDuration()
      this.sliderMax = max
      this.form.value = [0, max]
      this.latestSlide = [0, max]
      this.player.seekTo(0)
      this.player.playVideo()
      this.player.pauseVideo()
    },
    // Scrobbles to wherever slider is
    scrubVideo() {
      if (this.form.value[0] - this.latestSlide[0] != 0) {
        this.player.seekTo(this.form.value[0])
      } else if (this.form.value[1] - this.latestSlide[1] != 0) {
        this.player.seekTo(this.form.value[1])
      }
      this.latestSlide = this.form.value
      this.player.playVideo()
      this.player.pauseVideo()
    },
    async updateSlider() {
      var time = await this.player.getCurrentTime()
      if (
        Math.abs(this.form.value[0] - time) >
        Math.abs(this.form.value[1] - time)
      ) {
        this.form.value = [this.form.value[0], Math.round(time)]
      } else {
        this.form.value = [Math.round(time), this.form.value[1]]
      }
    },
    async submitForm(submitEvent) {
      // POST form to API.
      if (
        this.form.date &&
        this.form.text &&
        this.form.title &&
        this.form.videoId &&
        this.form.speaker &&
        this.form.API_Key
      ) {
        axios
          .post(
            'https://api.blazenetworking.com/pcc/v1/upload',
            JSON.stringify(this.form)
          ) // <-- This link will need to be updated for wherever I put the API endpoints.
          .then((res) => {
            if (res.data == 'success') {
              alert(
                'No immediate problems! Go to /status for further progress.'
              )
            } else {
              alert(res.data)
            }
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    clearForm() {
      this.form = {
        date: null,
        text: null,
        title: null,
        speaker: null,
        series: null,
        API_Key: null,
        value: [0, this.sliderMax],
        videoId: this.form.videoId,
      }
    },
  },
  computed: {
    player() {
      return this.$refs.youtube.player
    },
  },
}
</script>
