<template>
  <Layout>
    <template slot="title">
      <h1 class="title is-size-1">Preachers</h1>
    </template>
    <div>
      <h2 class="text-2xl text-center bg-primary py-2 text-white">
        Our Pastors
      </h2>
      <PreacherRow
        :key="$page.seniorPastor.id"
        :preacher="$page.seniorPastor"
      />
      <PreacherRow
        v-for="{ node } of $page.pastors.edges"
        :key="node.id"
        :preacher="node"
      />
    </div>
    <div class="mt-8">
      <h2 class="text-2xl text-center bg-primary py-2 text-white">
        Pastor Emeritus
      </h2>
      <PreacherRow
        :key="$page.pastorEmeritus.id"
        :preacher="$page.pastorEmeritus"
      />
    </div>
  </Layout>
</template>

<page-query>
query Preachers {
  seniorPastor: preacher(id:"will-snyder") {
	id
	path
	lastName
	name
	content
	avatar
  }

  pastors: allPreacher(filter: { role: { regex:"Pastor" }, id: {nin: ["will-snyder", "brad-evans"]}}, order:ASC) {
    edges {
      node {
        id
        path
        lastName
	    name
        content
        avatar
	  }
	}
  }

  pastorEmeritus: preacher(id:"brad-evans") {
	id
	path
	lastName
	name
	content
	avatar
  }
}
</page-query>

<script>
import Layout from '@/layouts/SermonPage.vue'
import PreacherRow from '@/components/sermons/PreacherRow'

export default {
  metaInfo() {
    return {
      title: 'Sermons — Preachers',
    }
  },
  components: {
    Layout,
    PreacherRow,
  },
}
</script>
