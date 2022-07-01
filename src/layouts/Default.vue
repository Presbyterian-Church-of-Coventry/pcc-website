<template>
  <div id="app">
    <div id="wrapper">
      <Alert />
      <Navbar />
      <section class="section">
        <div>
          <slot />
        </div>
      </section>
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

<style></style>
