<template>
  <Layout background="beliefs-blur.jpg">
    <template slot="title">
      <h1 class="title is-size-1">VBS</h1>
    </template>
    <div class="flex flex-col md:flex-row max-w-5xl mx-auto justify-between">
      <main class="content">
        <h2>{{ heading }}</h2>
        <template v-if="$page.vbsDay.published">
          <div v-if="$page.vbsDay.message" class="notification is-info">
            {{ $page.vbsDay.message }}
          </div>
          <p>
            <em>Clicking the links below will open videos in a new tab.</em>
          </p>
          <div v-html="$page.vbsDay.content"></div>
        </template>
        <template v-else>
          <p><em>Nice try sneaky! No peeking ;)</em></p>
        </template>
      </main>
      <Sidebar class="md:ml-6" :links="links" title="VBS" />
    </div>
  </Layout>
</template>

<page-query>
	query VBSDay ($path: String!) {
		vbsDay (path: $path) {
			title
			day
			date(format: "M/DD/YYYY")
			content
			published
			message
		}
		allVbsDay (sortBy:"date", order: ASC, filter: { published: { eq: true }}) {
			edges {
				node {
					title
					day
					date(format: "M/DD/YYYY")
					content
					path
				}
			}
		}
	}
</page-query>

<script>
import Layout from '@/layouts/Page.vue'
import Sidebar from '@/components/Sidebar.vue'
export default {
  metaInfo() {
    return {
      title: 'VBS - ' + this.heading,
    }
  },
  components: {
    Layout,
    Sidebar,
  },
  computed: {
    heading() {
      return `${this.$page.vbsDay.title} - ${this.$page.vbsDay.day}`
    },
    links() {
      return this.$page.allVbsDay.edges.map(({ node }) => {
        return {
          title: `${node.title} - ${node.day}`,
          path: node.path,
        }
      })
    },
  },
}
</script>
