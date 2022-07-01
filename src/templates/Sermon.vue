<template>
  <Layout>
    <audio
      autoplay
      ref="audio"
      @timeupdate="currentTime = $event.target.currentTime"
      @loadedmetadata="duration = $event.target.duration"
    >
      <source :src="$page.sermon.audio" type="audio/mp3" />
    </audio>

    <div class="full-height">
      <article id="audio-card">
        <figure class="image">
          <g-image :src="thumbnail" alt="series thumbnail" width="200" />
        </figure>
        <h1 class="is-size-4">{{ sermon.title }}</h1>
        <h2 class="subtitle" v-if="audioPlayer">
          {{ currentTime | formatTime }} / {{ duration | formatTime }}
        </h2>

        <input
          type="range"
          class="progress is-primary"
          :value="progress"
          min="0"
          max="100"
          @change="increaseCurrentTime"
        />

        <button
          id="playButton"
          class="button w-16 h-16 is-primary is-outlined rounded-full"
          @click="togglePlay"
        >
          <ChurchIcon name="pause" v-if="playing" />
          <ChurchIcon name="play" v-else />
        </button>
      </article>
    </div>
  </Layout>
</template>

<page-query>
query Sermon ($path: String!) {
	sermon: sermon (path: $path) {
		title
		audio
		series {
			thumbnail (width: 200, height: 200)
		}
	}
}
</page-query>

<script>
import Layout from '@/layouts/Sermon.vue'
export default {
  metaInfo() {
    return {
      title: this.$page.sermon.title,
    }
  },
  data() {
    return {
      audioPlayer: undefined,
      playing: true,
      duration: 0,
      currentTime: 0,
    }
  },
  mounted() {
    this.audioPlayer = this.$refs.audio
  },
  components: {
    Layout,
  },
  methods: {
    togglePlay() {
      this.playing = !this.playing
      this.playing ? this.audioPlayer.play() : this.audioPlayer.pause()
    },
    increaseCurrentTime(e) {
      console.log(e)
      console.log(e.target.value)
      this.audioPlayer.currentTime = Math.floor(
        (e.target.value * this.duration) / 100
      )
    },
  },
  computed: {
    sermon() {
      return this.$page.sermon
    },
    progress() {
      return Math.floor((this.currentTime / this.duration) * 100) || 0
    },
    thumbnail() {
      return (
        (this.$page.sermon.series && this.$page.sermon.series.thumbnail) ||
        require('../assets/images/default-series.png')
      )
    },
    formattedCurrentTime() {
      return (
        Math.floor(this.currentTime / 60) +
        ':' +
        Math.floor(this.currentTime % 60)
          .toString()
          .padStart(2, '0')
      )
    },
  },
  filters: {
    formatTime: function (value) {
      return (
        Math.floor(value / 60) +
        ':' +
        Math.floor(value % 60)
          .toString()
          .padStart(2, '0')
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/mixins';
@import '@/assets/_colors.scss';

.full-height {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  #audio-card {
    height: auto;
    width: 400px;
    max-width: 100%;

    padding: 40px;

    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;

    @include from($tablet) {
      box-shadow: 1px 10px 30px 0 rgba(0, 0, 0, 0.1);
      border-radius: 20px;
    }

    figure.image {
      max-width: 200px;
    }

    img {
      border-radius: 5px;
      box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
    }

    h1 {
      padding: 20px 0;
    }
  }
}
// Range Styles
input[type='range'] {
  width: 210px;
  height: 30px;
  overflow: hidden;
  cursor: pointer;
}
input[type='range'],
input[type='range']::-webkit-slider-runnable-track,
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
}
input[type='range']::-webkit-slider-runnable-track {
  width: 200px;
  height: 10px;
  background: #aaa;
}
input[type='range']::-webkit-slider-thumb {
  position: relative;
  height: 30px;
  width: 30px;
  margin-top: -10px;
  background: steelblue; // $primary
  border-radius: 50%;
  border: 2px solid white;
}
input[type='range']::-webkit-slider-thumb::before {
  position: absolute;
  content: '';
  height: 10px; /* equal to height of runnable track */
  width: 500px; /* make this bigger than the widest range input element */
  left: -502px; /* this should be -2px - width */
  top: 8px; /* don't change this */
  background: #777;
}
</style>
