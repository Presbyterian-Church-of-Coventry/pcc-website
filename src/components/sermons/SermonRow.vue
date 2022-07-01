<template>
  <article class="sermon-row items-baseline">
    <!-- Sermon Image (mobile) -->
    <div v-if="showSeries" class="w-full block md:w-0 md:hidden">
      <g-link v-if="sermon.series" :to="sermon.series.path">
        <figure
          class="image w-full block md:w-0 md:hidden object-cover is-16by9"
        >
          <g-image :src="sermon.series.thumbnail" width="500"></g-image>
        </figure>
      </g-link>
      <figure
        v-else
        class="image w-full block md:w-0 md:hidden object-cover is-16by9"
      >
        <g-image src="~/assets/images/no_series.png" width="400"></g-image>
      </figure>
    </div>
    <div class="flex flex-col md:flex-row md:items-center">
      <!-- Sermon Image -->
      <div v-if="showSeries" class="hidden md:block pr-4 md:flex-none w-64">
        <g-link
          v-if="sermon.series"
          :to="sermon.series.path"
          class="block bg-gray-900"
        >
          <g-image
            :src="sermon.series.thumbnail"
            :alt="sermon.name"
            class="opacity-100 hover:opacity-75"
          ></g-image>
        </g-link>
        <g-image
          v-else
          src="~/assets/images/no_series.png"
          width="400"
        ></g-image>
      </div>

      <!-- Sermon Info -->
      <div class="flex flex-col flex-grow">
        <div>
          <span
            class="text-xs tracking-wider font-bold bg-gray-700 text-gray-100 uppercase rounded-full px-2 py-1"
            >{{ sermon.date }}</span
          >
        </div>

        <h3 class="is-size-4 is-block py-2">{{ sermon.title }}</h3>

        <div class="flex">
          <g-link
            v-if="sermon.preacher"
            class="text-sm"
            :to="sermon.preacher.path"
            >{{ sermon.preacher.name }}</g-link
          >
          <span class="ml-2" v-if="sermon.preacher">&bull;</span>
          <span
            class="text-sm hover:underline"
            :class="sermon.preacher && 'ml-2'"
            :inner-html.prop="sermon.scripture | scripture"
          ></span>
        </div>

        <div v-if="showSeries" class="text-sm">
          <p v-if="sermon.series">
            Series:
            <g-link :to="sermon.series.path" class="hover:underline">{{
              sermon.series.title
            }}</g-link>
          </p>
          <p v-else>Series: None</p>
        </div>
      </div>

      <div
        class="flex w-full md:flex-no-wrap md:w-auto justify-left pt-4 md:p-0 md:pl-4"
      >
        <a
          :href="sermon.audio"
          target="_blank"
          class="button is-primary is-outlined is-medium"
          >Listen</a
        >&nbsp;
        <a
          v-if="sermon.video"
          class="button is-primary is-outlined is-medium"
          :href="sermon.video"
          rel="noreferrer"
          target="_blank"
          >Watch</a
        >
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: ['sermon', 'showSeries'],
}
</script>

<style lang="postcss">
img {
  transition: ease 0.25s all;
}

.sermon-row:not(:first-of-type) {
  @apply mt-8 pt-8 border-t border-primary;
}
</style>
