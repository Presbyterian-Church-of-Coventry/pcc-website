<template>
  <Layout background="beliefs-blur.jpg">
    <template slot="title">
      <h1 class="title is-size-1">Giving</h1>
    </template>
    <div class="text-center">
      <main class="content">
        <div class="relative">
          <iframe
            id="v-frame"
            width="100%"
            frameborder="0"
            allow="clipboard-write"
            src="https://secure.myvanco.com/L-Z9Y3"
            scrolling="no"
          ></iframe>
        </div>
      </main>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/layouts/Page.vue'


export default {
  components: {
    Layout,
  },
  mounted () {
    // iframe sizing
    window.onmessage = (e) => {
      const n = document.getElementById('v-frame')
      'https://secure.myvanco.com' === e.origin &&
        e.data.height &&
        ((n.height = e.data.height), (n.overflow = 'hidden'))
    }
  }
}
</script>
