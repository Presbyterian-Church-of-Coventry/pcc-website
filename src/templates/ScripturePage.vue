<template>
  <Layout>
    <template slot="title">
      <h1 class="title is-size-1">Sermons from {{ $context.fields.title }}</h1>
    </template>
    <template slot="breadcrumbs">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <g-link to="/sermons/scripture">Scripture</g-link>
          </li>
          <li class="is-active">
            <a href="#" aria-current="page">{{ $context.fields.title }}</a>
          </li>
        </ul>
      </nav>
    </template>
    <div v-if="sermons && sermons.length">
      <SermonRow
        v-for="sermon of sermons"
        :sermon="sermon"
        :key="sermon.slug"
        :showSeries="true"
      />
    </div>
    <div v-else class="content">
      <p>Sorry, no sermons yet</p>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/layouts/SermonPage.vue'
import SermonTabs from '@/components/sermons/SermonTabs.vue'
import SermonRow from '@/components/sermons/SermonRow.vue'

export default {
  metaInfo() {
    return {
      title: this.$context.fields.title,
    }
  },
  components: {
    Layout,
    SermonTabs,
    SermonRow,
  },
  computed: {
    sermons() {
      return this.$context.fields.sermons.map((sermon) => sermon.node)
    },
  },
}
</script>
