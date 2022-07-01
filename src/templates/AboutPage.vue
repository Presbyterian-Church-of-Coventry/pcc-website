<template>
  <Layout background="beliefs-blur.jpg">
    <template slot="title">
      <h1 class="title is-size-1">{{ $page.aboutPage.title }}</h1>
    </template>
    <div class="flex flex-col md:flex-row max-w-5xl mx-auto justify-between">
      <main class="content" v-html="$page.aboutPage.content"></main>
      <AboutSidebar class="md:ml-6" />
    </div>
  </Layout>
</template>

<page-query>
query AboutPage ($path: String!) {
	aboutPage: aboutPage (path: $path) {
		title
		content
	}
}
</page-query>

<script>
import Layout from '@/layouts/Page.vue'
import AboutSidebar from '@/components/AboutSidebar.vue'
export default {
  metaInfo() {
    return {
      title: this.$page.aboutPage.title,
    }
  },
  components: {
    Layout,
    AboutSidebar,
  },
}
</script>
