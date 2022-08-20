<template>
  <Layout background="events.jpg">
    <template slot="title">
      <h1 class="title is-size-1">Events</h1>
    </template>
    <div class="title-row is-clearfix">
      <a
        class="button is-medium is-primary is-outlined calendar-feed"
        target="_blank"
        href="https://calendar.google.com/calendar/embed?src=office%40coventrypca.church&ctz=America%2FNew_York"
      >
        <ChurchIcon name="calendar" />
        <span class="ml-2">View Full Calendar</span>
      </a>
    </div>

    <main v-if="events.length" class="mt-8">
      <EventRow v-for="(event, index) of events" :event="event" :key="index" />
    </main>
    <main v-else>
      <h4 class="is-size-4 has-text-centered">
        <em>No Upcoming Featured Events</em>
      </h4>
    </main>
  </Layout>
</template>

<page-query>
query Events {
	allEvent (sortBy:"startDate", order:ASC) {
		edges {
			node {
				title
				content
				path
				startDate
				endDate
				thumbnail (width: 600)
			}
		}
	}
}
</page-query>

<script>
import dayjs from 'dayjs'

import Layout from '@/layouts/Page.vue'
import EventRow from '@/components/EventRow.vue'

export default {
  metaInfo() {
    return {
      title: 'Events',
    }
  },
  components: {
    Layout,
    EventRow,
  },
  computed: {
    events() {
      return this.$page.allEvent.edges
        .filter(edge => {
          return dayjs(edge.node.endDate).isAfter(dayjs())
        })
        .map(edge => edge.node)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/mixins';

@include until($desktop) {
  a.calendar-feed {
    margin: 20px 0;
  }
}

@include from($desktop) {
  .toggle-container {
    display: inline-block;
    margin-bottom: 20px;
  }

  a.calendar-feed {
    float: right;
  }
}
</style>
