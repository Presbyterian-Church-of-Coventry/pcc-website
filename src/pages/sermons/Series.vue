<template>
  <Layout>
    <template slot="title">
      <h1 class="title is-size-1">Sermon Series</h1>
    </template>
    <div id="series">
      <ul v-if="$page.series.edges.length" class="columns is-multiline">
        <li
          v-for="{ node } in $page.series.edges"
          :key="node.id"
          class="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen has-text-centered series-thumbnail"
        >
          <g-link :to="node.path">
            <figure class="image is-16by9">
              <g-image :src="node.thumbnail" alt="series thumbnail" />
            </figure>
            <h4 class="text-xl text-gray-700">{{ node.title }}</h4>
          </g-link>
        </li>
      </ul>
      <p v-else>Sorry, no sermon series yet</p>
    </div>
  </Layout>
</template>

<page-query>
query {
  series: allSeries (sortBy: "date") {
	edges {
	  node {
		title
		date
		thumbnail (width: 500)
		path
		belongsTo (limit:1) {
		  edges {
			node {
			  ...on Sermon {
				title
				date
			  }
			}
		  }
		}
	  }
	}
  }
}

</page-query>

<script>
const _ = require('lodash')

import Layout from '@/layouts/SermonPage.vue'
import SermonTabs from '@/components/sermons/SermonTabs.vue'

export default {
  metaInfo() {
    return {
      title: 'Sermon Series',
    }
  },
  components: {
    Layout,
    SermonTabs,
  },
}
</script>

<style lang="scss" scoped>
.series-thumbnail {
  .image {
    transition: all 0.3s ease-in-out;
  }

  &:hover .image {
    transform: scale(0.9);
  }
}
</style>
