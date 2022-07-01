<template>
  <Layout>
    <template slot="title">
      <h1 class="title">{{ possessiveName }} Sermons</h1>
    </template>
    <template slot="breadcrumbs">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <g-link to="/sermons/preachers">Preachers</g-link>
          </li>
          <li class="is-active">
            <a href="#" aria-current="page">{{ $page.preacher.name }}</a>
          </li>
        </ul>
      </nav>
    </template>
    <template slot="hero">
      <div class="flex flex-col md:flex-row items-center">
        <g-image
          v-if="preacher.avatar"
          :src="preacher.avatar"
          :alt="`${preacher.name}'s picture`"
          class="avatar rounded-full"
        />
        <g-image
          v-else
          class="avatar rounded-full"
          src="~/assets/images/no_preacher.jpg"
          :alt="`${preacher.name}'s placeholder image`"
          width="200"
        />
        <div
          class="content leading-relaxed mt-8 md:mt-0 md:ml-8"
          v-html="preacher.content"
        ></div>
      </div>
    </template>

    <div v-if="$page.preacher.sermons.edges.length">
      <SermonRow
        v-for="{ node } of $page.preacher.sermons.edges"
        :sermon="node"
        :key="node.id"
        :showSeries="true"
      />
    </div>
    <div v-else class="content">
      <p>Sorry, no sermons yet</p>
    </div>
  </Layout>
</template>

<page-query>
query Preacher ($id: ID!) {
	preacher: preacher (id: $id) {
		name
		avatar(width:400)
		content
		sermons: belongsTo(filter:{typeName:{eq:Sermon}}) {
			edges {
				node {
					...on Sermon {
						title
						audio
						video
						scripture
						series {
							title
							thumbnail(width: 400)
							path
						}
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

export default {
  metaInfo() {
    return {
      title: this.$page.preacher.name,
    }
  },
  components: {
    Layout,
    SermonRow,
  },
  computed: {
    preacher() {
      return this.$page.preacher
    },
    possessiveName() {
      const endsWithS = /s$/.test(this.preacher.name)

      return endsWithS ? `${this.preacher.name}'` : `${this.preacher.name}'s`
    },
  },
}
</script>

<style lang="postcss" scoped>
.avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
</style>
