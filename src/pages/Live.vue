<template>
  <Layout background="beliefs-blur.jpg">
    <template slot="title">
      <h1 class="title is-size-1">Live</h1>
    </template>
    <div class="flex flex-col md:flex-row max-w-5xl mx-auto justify-between">
      <main class="content">
        <!-- <h2>No Live Stream This Week</h2>
				<p>
					<em>There will be no live stream this week as we have decided to meet outdoors for the month of September.</em>
				</p>-->
        <div class="video-wrapper">
          <iframe
            width="560"
            height="315"
            :src="$static.livePage.video"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </main>
      <LiveSidebar class="mt-6 md:mt-0 md:ml-6" />
    </div>
  </Layout>
</template>

<static-query>
query {
  livePage: settings (path: "/content/settings/live") {
    video
  }
}
</static-query>

<script>
import Layout from '@/layouts/Page.vue'
import LiveSidebar from '@/components/LiveSidebar.vue'
export default {
  metaInfo() {
    return {
      title: 'Live',
    }
  },
  components: {
    Layout,
    LiveSidebar,
  },
}
</script>

<style lang="postcss" scoped>
.content {
  width: 100%;
}
</style>
