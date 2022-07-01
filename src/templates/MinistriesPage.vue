<template>
  <Layout background="beliefs-blur.jpg">
    <template slot="title">
      <h1 class="title is-size-1">{{ $page.ministriesPage.title }}</h1>
    </template>
    <div class="flex flex-col md:flex-row max-w-5xl mx-auto justify-between">
      <main class="content" v-html="$page.ministriesPage.content" />
      <MinistriesSidebar class="md:ml-6" />
    </div>
  </Layout>
</template>

<page-query>
query MinistriesPage ($path: String!) {
	ministriesPage: ministriesPage (path: $path) {
		title
		content
	}
}
</page-query>

<script>
import Layout from '@/layouts/Page.vue'
import MinistriesSidebar from '@/components/MinistriesSidebar.vue'
export default {
  metaInfo() {
    return {
      title: this.$page.ministriesPage.title,
    }
  },
  components: {
    Layout,
    MinistriesSidebar,
  },
}
</script>
