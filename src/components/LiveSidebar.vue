<template>
  <aside class="flex-none menu">
    <p class="menu-label">Links for {{ date }}</p>
    <ul class="menu-list">
      <li>
        <ul>
          <li v-if="bulletinLink">
            <a :href="bulletinLink" target="_blank" rel="noreferrer noopener"
              >Bulletin &amp; Sermon Outline</a
            >
          </li>
          <li v-else>
            <a
              style="cursor: not-allowed;"
              target="_blank"
              rel="noreferrer noopener"
              >Bulletin &amp; Sermon Outline</a
            >
          </li>
          <li>
            <g-link
              to="https://hymnary.org/hymnal/TH1990"
              exactActiveClass="is-active"
              >Trinity Hymnal Online</g-link
            >
          </li>
          <li>
            <g-link to="https://www.esv.org" exactActiveClass="is-active"
              >ESV Online</g-link
            >
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      date: '',
      bulletinLink: '',
    }
  },
  created() {
    let now = new Date()
    now.setDate(now.getDate() + ((7 - now.getDay()) % 7))
    let month = now.getMonth() + 1
    let day = now.getDate()
    let year = now.getFullYear()
    this.date = `${month}/${day}/${year}`
  },
}
</script>

<page-query>
query {
  settings: allSetting(filter: { path: { eq: "live" }}) {
    edges {
      node {
        bulletinLink
      }
    }
  }
}
</page-query>

<style lang="scss">
aside.menu ul.menu-list {
  position: sticky;
  top: 0;
}
</style>
