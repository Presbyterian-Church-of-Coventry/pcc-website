<template>
  <div class="layout">
    <Alert />
    <section class="hero is-dark has-background-image" :style="backgroundStyle">
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
    <main>
      <section class="section">
        <SermonTabs />
      </section>
      <section v-if="hasBreadcrumbs" class="section pt-0">
        <slot name="breadcrumbs" />
      </section>
      <section v-if="hasHero" class="hero is-primary is-bold">
        <div class="hero-body">
          <slot name="hero" />
        </div>
      </section>
      <section class="section">
        <slot />
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue'
import Navbar from '@/components/Navbar'
import SermonTabs from '@/components/sermons/SermonTabs'
import Footer from '@/components/Footer'

export default {
  components: {
    Alert,
    Navbar,
    SermonTabs,
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
    hasBreadcrumbs() {
      return !!this.$slots.breadcrumbs
    },
    hasHero() {
      return !!this.$slots.hero
    },
  },
}
</script>

<style>
.has-background-image {
  background-size: cover;
  background-position: center;
}
</style>
