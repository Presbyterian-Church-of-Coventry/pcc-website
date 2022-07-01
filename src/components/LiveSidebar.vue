<template>
  <aside class="flex-none menu">
    <p class="menu-label">Links for {{ $static.livePage.date }}</p>
    <ul class="menu-list">
      <li>
        <ul>
          <li>
            <a
              :href="$static.livePage.bulletinLink"
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

<static-query>
query {
  livePage: settings (path: "/content/settings/live") {
    date
    bulletinLink
  }
}
</static-query>

<script>
export default {}
</script>

<style lang="scss">
aside.menu ul.menu-list {
  position: sticky;
  top: 0;
}
</style>
