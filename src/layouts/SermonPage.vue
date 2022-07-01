<template>
  <PageLayout>
    <template slot="title">
      <slot name="title" />
    </template>
    <section>
      <SermonTabs />
    </section>
    <section v-if="hasBreadcrumbs" class="section px-0">
      <slot name="breadcrumbs" />
    </section>
    <div class="mt-8">
      <slot />
    </div>
  </PageLayout>
</template>

<script>
import PageLayout from '@/layouts/Page'
import SermonTabs from '@/components/sermons/SermonTabs'

export default {
  components: {
    PageLayout,
    SermonTabs,
  },
  computed: {
    hasBreadcrumbs() {
      return !!this.$slots.breadcrumbs
    },
  },
}
</script>
