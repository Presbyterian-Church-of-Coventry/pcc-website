<template>
  <!-- Main container -->
  <section
    class="flex flex-col lg:text-left lg:flex-row items-center lg:items-start justify-between latest-sermon-block"
  >
    <!-- Left side -->
    <div class="flex-none">
      <div class="date">
        <h3 class="uppercase font-bold tracking-wider">
          Latest Sermon
        </h3>
        <span
          class="inline-block bg-gray-300 text-gray-800 px-2 text-xs mt-1 font-bold uppercase tracking-wider rounded-full"
          >{{ sermon.date }}</span
        >
      </div>
    </div>

    <!-- Middle -->
    <div
      class="text-center px-4 pt-0 mt-4 lg:text-left lg:mt-0 lg:px-12 flex-grow"
    >
      <p class="is-size-4">{{ sermon.title }}</p>
      <p v-if="sermon.preacher">{{ sermon.preacher.name }}</p>
    </div>

    <!-- Right side -->
    <div class="sm:hidden flex flex-col">
      <a
        v-if="sermon.video"
        :href="sermon.video"
        target="_blank"
        rel="noreferrer"
        class="button is-white is-outlined is-medium tracking-wider mt-4"
        >Watch</a
      >
      <g-link
        v-if="sermon.audio"
        :to="sermon.path"
        target="_blank"
        rel="noreferrer"
        class="button is-white is-outlined is-medium tracking-wider mt-4"
        >Listen</g-link
      >
      <a
        v-if="sermon.audio"
        :href="sermon.audio"
        class="button is-white is-outlined is-medium tracking-wider mt-4"
        :download="sermon.title"
        rel="noreferrer"
        >Download</a
      >
    </div>
    <div class="hidden sm:block mt-4 lg:mt-0 flex-none p-2 md:text-right">
      <div class="buttons has-addons">
        <a
          v-if="sermon.video"
          :href="sermon.video"
          target="_blank"
          rel="noreferrer"
          class="button is-white is-outlined is-medium tracking-wider"
          >Watch</a
        >
        <g-link
          v-if="sermon.audio"
          :to="sermon.path"
          target="_blank"
          rel="noreferrer"
          class="button is-white is-outlined is-medium tracking-wider"
          >Listen</g-link
        >
        <a
          v-if="sermon.audio"
          :href="sermon.audio"
          class="button is-white is-outlined is-medium tracking-wider"
          :download="sermon.title"
          rel="noreferrer"
          >Download</a
        >
      </div>
    </div>
  </section>
</template>

<static-query>
query Sermon {
  sermons: allSermon(sortBy: "date") {
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
      }
    }
  }
}
</static-query>

<script>
export default {
  computed: {
    sermon() {
      return this.$static.sermons.edges[0].node
    },
  }
}
</script>

<style lang="postcss" scoped>
.latest-sermon-block {
  color: white !important;

  .buttons {
    display: block;
  }

  .button {
    border-width: 3px;
    padding: 20px;
    text-transform: uppercase;
    border-radius: 0;
    font-size: 14px;
    font-weight: bold;

    @screen sm {
      &:not(:last-child) {
        border-right-width: 0;
      }
    }
  }
}
</style>
