<template>
  <div id="app">
    <div id="wrapper">
      <Alert />
      <section class="hero is-dark is-fullheight background-404">
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

<style scoped>
.background-404 {
  /* background-image: ; */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-position: center center;
  background-size: cover;
  background-image: url('../assets/images/empty-tomb.jpg');
  background-color: #292929;
  background-blend-mode: overlay;
}
</style>
