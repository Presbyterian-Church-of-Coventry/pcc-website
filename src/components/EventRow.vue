<template>
  <article class="event-row">
    <div class="date-and-image flex w-full block md:w-0 md:hidden">
      <div class="w-full md:hidden">
        <figure class="image is-16by9 shadow">
          <g-image :src="event.thumbnail" class="object-cover"></g-image>
        </figure>
      </div>
    </div>
    <div class="flex flex-1 mt-4">
      <div class="mr-4">
        <div class="event-date-circle">
          <span class="event-month block m-0 mt-1 uppercase">{{
            event.startDate | date('MMM')
          }}</span>
          <span class="event-day text-3xl leading-none">{{
            event.startDate | date('D')
          }}</span>
        </div>
      </div>
      <div class="event-image hidden md:block pr-4 md:flex-none w-64">
        <figure class="image is-16by9 shadow">
          <g-image :src="event.thumbnail" class="object-cover"></g-image>
        </figure>
      </div>
      <div class="event-info">
        <h2 class="subtitle is-size-4">{{ event.title }}</h2>
        <div class="event-time text-sm font-bold">
          <p>
            {{ event.startDate | date('h:mma') }} -
            {{ event.endDate | date('h:mma') }}
          </p>
        </div>
        <div class="content mt-2">
          <span class="content is-inline" v-html="event.content"></span>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: ['event'],
}
</script>

<style lang="postcss" scoped>
article.event-row:not(:first-child) {
  @apply mt-16;
}

.event-info .subtitle {
  margin-bottom: 0.5rem;
}

.event-date-circle {
  background: white;
  border: 1px solid whitesmoke;
  color: $primary;
  font-weight: bold;
  border-radius: 35px;
  width: 70px;
  height: 70px;
  margin: 0 20px 0 0;
  text-align: center;
  font-family: $family-sans-serif;
}
</style>
