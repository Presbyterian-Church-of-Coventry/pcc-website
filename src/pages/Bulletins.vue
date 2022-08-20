<template>
  <Layout>
    <template slot="title">
      <h1 class="title is-size-1">Bulletins</h1>
    </template>
    <div>
      <transition-group tag="div" class="flex flex-wrap justify-center -mx-4">
        <div
          v-for="{ node } of loadedBulletins"
          :key="node.id"
          class="w-full md:w-1/2 lg:w-1/3 mb-4 px-4"
        >
          <a
            class="w-full inline-flex items-center rounded bg-gray-200 text-gray-900 hover:bg-gray-300 hover:text-gray-900 px-4 py-2"
            :href="node.url"
            target="_blank"
          >
            <ChurchIcon name="pdf" class="mr-4 text-red-400" size="10" />
            <div>
              <span
                class="text-xs bg-gray-600 text-gray-100 uppercase font-bold rounded-full px-2 inline-block"
                >{{ node.date }}</span
              >
            </div>
          </a>
        </div>
      </transition-group>
      <ClientOnly>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more" class="mt-2">
            You've scrolled through all of the bulletins ;)
          </div>
          <div slot="no-results" class="mt-2">
            Sorry, no bulletins yet :(
          </div>
        </infinite-loading>
      </ClientOnly>
    </div>
  </Layout>
</template>

<page-query>
query Bulletins ($page: Int) {
  bulletins: allBulletin (sortBy: "date", perPage: 12, page: $page) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
    edges {
      node {
        id
        title
        date (format: "MMMM DD, YYYY")
        url
      }
    }
  }
}
</page-query>

<script>
import Layout from '@/layouts/Page.vue'

export default {
  metaInfo() {
    return {
      title: 'Bulletins',
    }
  },
  components: {
    Layout,
  },
  data() {
    return {
      loadedBulletins: [],
      currentPage: 1,
    }
  },
  created() {
    this.loadedBulletins.push(...this.$page.bulletins.edges)
  },
  methods: {
    async infiniteHandler($state) {
      if (this.currentPage + 1 > this.$page.bulletins.pageInfo.totalPages) {
        $state.complete()
      } else {
        const { data } = await this.$fetch(`/bulletins/${this.currentPage + 1}`)
        if (data.bulletins.edges.length) {
          this.currentPage = data.bulletins.pageInfo.currentPage
          this.loadedBulletins.push(...data.bulletins.edges)
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
a:hover .card {
  background-color: whitesmoke;
}
</style>
