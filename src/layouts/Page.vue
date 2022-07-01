<template>
  <div id="app">
    <div id="wrapper">
      <Alert />
      <section
        class="hero is-dark has-background-image"
        :style="backgroundStyle"
      >
        <div class="hero-head">
          <Navbar />
        </div>
        <div class="hero-body">
          <div class="container has-text-centered">
            <slot name="title" />
          </div>
        </div>
        <div class="hero-foot">
          <slot name="footer" />
        </div>
      </section>
      <main class="section">
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default {
  components: {
    Alert,
    Navbar,
    Footer,
  },
  props: {
    background: {
      default: 'bible-blur.jpg',
    },
  },
  computed: {
    backgroundStyle() {
      return {
        'background-image': `url('${require('../assets/images/' +
          this.background)}')`,
      }
    },
  },
}
</script>

<style lang="scss">
.has-background-image {
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
}

.hero.is-dark {
  background-color: #3e3e3ead;
}
</style>
