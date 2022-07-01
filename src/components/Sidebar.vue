<template>
  <aside class="flex-none menu">
    <ul class="menu-list">
      <li>
        <p class="menu-label">
          {{ title }}
        </p>
        <ul>
          <li v-for="link of links" :key="link.path">
            <g-link :to="link.path" exactActiveClass="is-active">
              {{ link.title }}
            </g-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  props: ['title', 'links'],
}
</script>

<style lang="scss">
aside.menu ul.menu-list {
  position: sticky;
  top: 0;
}
</style>
