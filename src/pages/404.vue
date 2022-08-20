<template>
  <Layout>
    <template slot="title">
      <h1 class="is-size-1">404 Error</h1>
      <h2 class="subtitle">
        Jesus is not here. And neither is your page!
      </h2>
    </template>
  </Layout>
</template>

<script>
import Layout from '@/layouts/404.vue'
export default {
  components: {
    Layout,
  },
}
</script>

<style lang="scss" scoped>
h1,
h2.subtitle {
  color: white !important;
}
</style>
