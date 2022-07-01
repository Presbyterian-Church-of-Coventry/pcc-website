<template>
  <ClientOnly>
    <div v-if="show" class="notification is-danger has-text-centered">
      <strong v-html="$static.alert.content"></strong>
    </div>
  </ClientOnly>
</template>

<static-query>
query Alert {
  alert: settings (path: "/content/settings/alert") {
    content
    showUntil
  }
}
</static-query>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      open: true,
    }
  },
  computed: {
    show() {
      return dayjs().isBefore(dayjs(this.$static.alert.showUntil))
    },
  },
}
</script>

<style lang="scss" scoped>
.notification {
  border-radius: 0;
  margin: 0 !important;
  top: 0;
  z-index: 100;
}
</style>
