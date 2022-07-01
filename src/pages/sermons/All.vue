<template>
  <Layout>
    <template slot="title">
      <h1 class="title is-size-1">All Sermons</h1>
    </template>
    <template>
      <transition-group name="fade">
        <SermonRow
          v-for="{ node } of loadedSermons"
          :key="node.path"
          :sermon="node"
          :showSeries="true"
        />
      </transition-group>
      <ClientOnly>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more" class="mt-2">
            You've scrolled through all the sermons ;)
          </div>
          <div slot="no-results" class="mt-2">Sorry, no sermons yet :(</div>
        </infinite-loading>
      </ClientOnly>
    </template>
  </Layout>
</template>

<page-query>
query Sermon ($page: Int) {
  sermons: allSermon (sortBy: "date", perPage: 10, page: $page) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
    edges {
      node {
        id
        title
        path
        audio
        video
        preacher {
            name
            path
        }
        date (format: "MMMM DD, YYYY")
        series {
            title
            thumbnail(width: 400)
            path
        }
        scripture
      }
    }
  }
}
</page-query>

<script>
import Layout from '@/layouts/SermonPage.vue'
import SermonRow from '@/components/sermons/SermonRow.vue'

export default {
  metaInfo() {
    return {
      title: 'All Sermons',
    }
  },
  components: {
    Layout,
    SermonRow,
  },
  data() {
    return {
      loadedSermons: [],
      currentPage: 1,
    }
  },
  created() {
    this.loadedSermons.push(...this.$page.sermons.edges)
  },
  methods: {
    async infiniteHandler($state) {
      if (this.currentPage + 1 > this.$page.sermons.pageInfo.totalPages) {
        $state.complete()
      } else {
        const { data } = await this.$fetch(
          `/sermons/all/${this.currentPage + 1}`
        )
        if (data.sermons.edges.length) {
          this.currentPage = data.sermons.pageInfo.currentPage
          this.loadedSermons.push(...data.sermons.edges)
          $state.loaded()
        } else {
          $state.complete()
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.pagination) {
  margin-bottom: 10px;
}
</style>
