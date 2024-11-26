<template>
  <div>
    <div class="flex flex-col items-center md:flex-row justify-between">
      <a
        class="button is-primary is-outlined legacy text-lg"
        href="https://www.sermonaudio.com/search.asp?SourceOnly=true&currSection=sermonssource&keyword=coventry"
        target="_blank"
      >
        <ChurchIcon name="archive" />
        <span class="ml-2">SermonAudio</span>
      </a>
      <section
        class="flex flex-col lg:flex-row mt-4 lg:mt-0 justify-end items-center"
      >
        <h2 class="hidden lg:block text-xl">
          Subscribe to our Podcast:
        </h2>
        <div class="flex lg:block">
          <a
            class="button is-primary is-outlined podcast lg:ml-4"
            target="_target"
            rel="noreferrer"
            href="https://podcasts.apple.com/us/podcast/presbyterian-church-of-coventry/id1486436318"
          >
            <ChurchIcon name="itunes" size="6" />
            <span class="hidden md:block md:ml-2">iTunes</span>
          </a>
          <a
            class="button is-primary is-outlined podcast ml-4"
            target="_target"
            rel="noreferrer"
            href="https://podcasts.google.com/feed/aHR0cHM6Ly9jb3ZlbnRyeXBjYS5jaHVyY2gvcG9kY2FzdC54bWw"
          >
            <ChurchIcon name="google-podcast" size="6" />
            <span class="hidden md:block md:ml-2">Google Podcasts</span>
          </a>
        </div>
      </section>
    </div>
    <div
      class="flex flex-col items-start md:flex-row justify-end md:items-center mt-4"
    >
      <div class="hidden md:flex items-center">
        Filter By:
        <g-link to="/sermons/all" class="filter-link">All</g-link>
        <g-link to="/sermons/series" class="filter-link">Series</g-link>
        <g-link to="/sermons/scripture" class="filter-link">Scripture</g-link>
        <g-link to="/sermons/preachers" class="filter-link">Preacher</g-link>
      </div>
      <div class="inline-block md:hidden relative w-full">
        <select
          id="mobileFilter"
          class="block mb-0 appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          aria-label="Filter By"
          @change="handleMobileFilterChange"
        >
          <option disabled selected>Filter By</option>
          <option value="all">All</option>
          <option value="series">Series</option>
          <option value="scripture">Scripture</option>
          <option value="preachers">Preacher</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
          <svg
            class="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleMobileFilterChange(e) {
      e.preventDefault()
      this.$router.push(`/sermons/${e.target.value}`)
    },
  },
}
</script>

<style lang="postcss" scoped>
.filter-link {
  @apply block px-3 py-2 border border-primary bg-white text-primary ml-3;

  &:hover,
  &.active {
    @apply bg-primary text-white;
  }
}

@include from($desktop) {
  .toggle-container {
    display: inline-block;
    margin-bottom: 20px;
  }

  a.legacy {
    float: right;
  }
}
</style>
