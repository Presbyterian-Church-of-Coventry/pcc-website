<template>
  <div>
    <h2 class="is-size-2 has-text-centered is-uppercase">
      What's going on at PCC
    </h2>
    <div v-if="events.length">
      <div class="flex flex-wrap mt-12 -mx-4">
        <div
          v-for="(event, index) of events"
          :key="index"
          class="px-4 w-full md:w-1/2 lg:w-1/3 flex flex-col items-center upcoming-event"
        >
          <g-link to="/events" class="w-full">
            <figure class="image is-16by9 shadow">
              <g-image :src="event.thumbnail" class="object-cover"></g-image>
            </figure>
          </g-link>
          <strong>{{ event.startDate | date('MMM DD | h:mma') }}</strong>
          <g-link to="/events">
            <h3 class="is-size-5">{{ event.title }}</h3>
          </g-link>
        </div>
      </div>
      <div class="mt-12 has-text-centered">
        <g-link to="/events" class="button is-medium is-dark is-outlined"
          >View All Events</g-link
        >
      </div>
    </div>
    <div v-else>
      <h4 class="is-size-4 has-text-centered">
        <em>No Upcoming Featured Events</em>
        <br />
        <a
          class="button is-primary is-outlined calendar-feed mt-4"
          target="_blank"
          href="https://calendar.google.com/calendar/embed?src=office%40coventrypca.church&ctz=America%2FNew_York"
        >
          <ChurchIcon name="calendar" />
          <span class="ml-2">View Full Calendar</span>
        </a>
      </h4>
    </div>
  </div>
</template>

<static-query>
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
</static-query>

<script>
import dayjs from 'dayjs'

export default {
  computed: {
    events() {
      return this.$static.allEvent.edges
        .filter((edge) => {
          return dayjs(edge.node.startDate).isAfter(dayjs())
        })
        .map((edge) => edge.node)
    },
  },
}
</script>

<style lang="postcss" scoped>
.upcoming-event {
  &:not(:first-child) {
    @apply mt-12;
    @screen md {
      @apply mt-0;
    }
  }

  figure {
    overflow: hidden;
  }

  strong {
    padding-top: 10px;
    display: block;
  }

  img {
    opacity: 0.8;
    transition: 0.25s ease-in-out;
  }

  &:hover img {
    transform: scale(1.1);
    opacity: 1;
  }
}
</style>
