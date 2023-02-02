<template>
  <aside class="flex-none menu">
    <ul class="menu-list">
      <li>
        <g-link to="/ministries" exactActiveClass="is-active"
          >Our Ministries</g-link
        >
        <ul>
          <li v-for="page of ministriesPages" :key="page.path">
            <g-link :to="page.path" exactActiveClass="is-active">
              {{ page.title }}
            </g-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<static-query>
query MinistriesPages {
  allMinistriesPage(sortBy:"title") {
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
    ministriesPages() {
      const pages = this.$static.allMinistriesPage.edges
        .filter(edge => edge.node.slug !== 'index')
        .map(edge => edge.node)

      let order = [
        // 'Music',
        'Discipleship',
        'Shepherdng',
        'Adult',
        'RUF at UCONN',
        'Young Adults',
        'Youth',
        "Children's Ministry",
        // 'Vacation Bible School',
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
