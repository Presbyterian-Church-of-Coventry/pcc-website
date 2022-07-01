<template>
  <Layout>
    <template slot="title">
      <h1 class="title is-size-1">{{ series.title }}</h1>
    </template>
    <template slot="breadcrumbs">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <g-link to="/sermons/series">All Series</g-link>
          </li>
          <li class="is-active">
            <a href="#" aria-current="page">{{ $page.series.title }}</a>
          </li>
        </ul>
      </nav>
    </template>
    <template slot="hero">
      <div class="container is-fullhd columns">
        <div class="column is-one-third">
          <g-image
            :src="series.thumbnail"
            alt="series thumbnail"
            class="thumbnail"
          />
        </div>
        <div class="column">
          <div class="leading-relaxed content" v-html="series.content"></div>
        </div>
      </div>
    </template>

    <div v-if="sermons && sermons.length">
      <SermonRow
        v-for="sermon of sermons"
        :sermon="sermon"
        :key="sermon.slug"
      />
    </div>
    <div v-else class="content">
      <p>Sorry, no sermons yet</p>
    </div>
  </Layout>
</template>

<page-query>
query Series ($id: ID!) {
	series (id: $id) {
		title
		content
		thumbnail (width: 400)
		id
		belongsTo(filter:{typeName:{eq:Sermon}}) {
			edges {
				node {
					...on Sermon {
						title
						audio
						video
						scripture
						preacher {
							name
							path
						}
						path
						date (format: "MMMM DD, YYYY")
					}
				}
			}
		}
	}
}
</page-query>

<script>
import Layout from '@/layouts/SermonPageHero.vue'
import SermonRow from '@/components/sermons/SermonRow.vue'
import SermonTabs from '@/components/sermons/SermonTabs.vue'

export default {
  metaInfo() {
    return {
      title: `Sermon Series — ${this.$page.series.title}`,
    }
  },
  components: {
    Layout,
    SermonTabs,
    SermonRow,
  },
  computed: {
    series() {
      return this.$page.series
    },
    sermons() {
      return this.$page.series.belongsTo.edges.map((sermon) => {
        return { ...sermon.node }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(img.thumbnail) {
  background-color: rgba(0, 0, 0, 0.45);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.35);
}
</style>
