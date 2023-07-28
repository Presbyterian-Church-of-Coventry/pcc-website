<template>
  <aside class="flex-none menu">
    <p class="menu-label">Links for {{ this.date }}</p>
    <ul class="menu-list">
      <li>
        <ul>
          <li v-if="exists">
            <a
              :href="this.link"
              target="_blank"
              rel="noreferrer noopener"
              >Bulletin &amp; Sermon Outline</a
            >
          </li>
          <li v-else>
            <a
              style="cursor: not-allowed"
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
import axios from 'axios'
export default {
  data() {
    return {
      date: "",
      link: "",
      exists: false
    }
  },
  created() {
    let now = new Date()
    now.setDate(now.getDate() + (7-now.getDay()) % 7)
    let month = now.getMonth() + 1
    let day = now.getDate()
    let year = now.getFullYear()
    this.date = month + "/" + day + "/" + year
    if (month < 10) {
      month = "0" + month
    }
    if (day < 10) {
      day = "0" + day
    }
    this.link = "https://s3.wasabisys.com/coventrypca.church/bulletins/Bulletin " + year + "-" + month + "-" + day + ".pdfa"

    axios
      .get(this.link)
      .then((response) => response.status)
      .then((data) => (this.exists = (data == 200)))
  }
}
</script>

<style lang="scss">
aside.menu ul.menu-list {
  position: sticky;
  top: 0;
}
</style>
