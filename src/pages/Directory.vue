<template>
  <Layout background="beliefs-blur.jpg">
    <template slot="title">
      <h1 class="title is-size-1">Directory</h1>
    </template>
    <div class="text-center">
      <main class="content">
        <p>
          Use the embedded directory below, or go to the dedicated webpage
          <a href="https://servantkeeper.com/directory/coventrypca/">here</a>.
        </p>
        <div class="relative" style="padding-bottom: 400px">
          <iframe
            class="w-full h-full absolute left-0 right-0"
            src="https://servantkeeper.com/directory/coventrypca"
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
}
</script>
