<template>
  <aside class="flex-none menu">
    <ul class="menu-list">
      <li>
        <g-link to="/about" exactActiveClass="is-active">About Us</g-link>
        <ul>
          <li v-for="page of aboutPages" :key="page.path">
            <g-link :to="page.path" exactActiveClass="is-active">{{
              page.title
            }}</g-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<static-query>
query AboutPages {
  allAboutPage(sortBy:"title") {
    edges{
      node{
        title
        slug
        path
      }
    }
  }  
}
</static-query>

<script>
export default {
  computed: {
    aboutPages() {
      const pages = this.$static.allAboutPage.edges
        .filter(edge => edge.node.slug !== 'index')
        .map(edge => edge.node)
      pages.push({
        title: 'Directions',
        path: '/about/directions',
        headings: [],
        slug: 'directions',
      })

      let order = [
        'What to Expect',
        'Beliefs',
        'Discovery Class',
        'Our Leaders',
        'Our Story',
        'Directions',
        'Nursery Information',
        'What is the Gospel?',
      ]
      return pages.sort((a, b) => {
        return order.indexOf(a.title) - order.indexOf(b.title)
      })
    },
  },
}
</script>

<style lang="scss">
aside.menu ul.menu-list {
  position: sticky;
  top: 0;
}
</style>
