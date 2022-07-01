<template>
  <transition name="fade" mode="out-in">
    <router-view />
  </transition>
</template>

<static-query>
query App {
  metadata {
    siteName
    siteDescription
  }
}
</static-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$static.metadata.siteName,
      meta: [
        {
          key: 'description',
          name: 'description',
          content: this.$static.metadata.siteDescription,
        },
      ],
    }
  },
}
</script>

<style lang="postcss" scoped>
/**
 * Transitions
 */

.fade-enter-active,
.fade-leave-active {
  transition: ease 0.3s;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  /* filter: blur(2px); */
  opacity: 0;
}
</style>
