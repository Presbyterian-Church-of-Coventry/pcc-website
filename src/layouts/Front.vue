<template>
  <div id="app">
    <div id="wrapper">
      <Alert />
      <section class="hero is-dark is-fullheight has-background-image">
        <div class="hero-head">
          <Navbar />
        </div>
        <div class="hero-body">
          <div class="container has-text-centered">
            <slot name="title" />
          </div>
        </div>
        <div class="hero-foot">
          <slot name="hero-foot" />
        </div>
      </section>
      <div>
        <slot />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Alert,
    Navbar,
    Footer,
  },
}
</script>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/mixins';

.hero.is-dark {
  background-color: #2c303699;
}

.is-fullheight {
  min-height: 200px;

  @include from($desktop) {
    min-height: 650px;
  }

  height: 100vh;
}

.has-background-image {
  background-image: url('../assets/images/background6.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;

  @include from($desktop) {
    background-attachment: fixed;
  }
}
</style>
