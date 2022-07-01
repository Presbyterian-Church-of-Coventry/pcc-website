<template>
  <article
    class="preacher-row flex flex-col items-start md:flex-row md:items-center"
  >
    <div class="flex-none p-4 pl-0">
      <g-link :to="preacher.path" class="avatar-link block rounded-full">
        <g-image
          v-if="preacher.avatar"
          class="avatar"
          :src="preacher.avatar"
          :alt="preacher.name + `'s avatar`"
          width="400"
        />
        <g-image
          v-else
          class="avatar"
          src="~/assets/images/no_preacher.jpg"
          :alt="preacher.name + `'s avatar`"
          width="400"
        />
      </g-link>
    </div>
    <div class="flex-grow py-4 md:px-4">
      <h3 class="text-2xl">
        <g-link :to="preacher.path">
          {{ preacher.name }}
          <em>{{ preacher.role }}</em>
        </g-link>
      </h3>
      <div class="content mt-4" v-html="excerpt"></div>
    </div>
    <g-link class="mt-button flex-none" :to="preacher.path"
      >{{ possessiveName }} Sermons</g-link
    >
  </article>
</template>

<script>
export default {
  props: ['preacher'],
  computed: {
    excerpt() {
      return this.preacher.content.split('\n')[0]
    },
    possessiveName() {
      const endsWithS = /s$/.test(this.preacher.name)

      return endsWithS
        ? `View ${this.preacher.name}'`
        : `View ${this.preacher.name}'s`
    },
  },
}
</script>

<style lang="postcss" scoped>
.preacher-row:not(:first-of-type) {
  @apply border-t border-primary pt-4 mt-8;

  @screen md {
    @apply mt-4;
  }
}

.avatar-link {
  overflow: hidden;
  width: 150px;
  height: 150px;
}

.avatar-link:hover .avatar {
  filter: brightness(0.7);
  transform: scale(1.2);
}

.avatar {
  transition: 0.3s all ease;
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.mt-button {
  transition: 0.2s ease-in-out;
  @apply rounded text-primary font-bold px-4 py-2 border border-gray-400 shadow;
}

.mt-button:hover {
  @apply bg-primary text-white;
}
</style>
