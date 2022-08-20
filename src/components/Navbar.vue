<template>
  <nav class="navbar is-dark">
    <div class="navbar-brand">
      <g-link to="/" class="navbar-item" aria-label="Home">
        <Logo class="logo" />
      </g-link>

      <div
        class="navbar-burger burger"
        data-target="navMenu"
        :class="{ 'is-active': !collapsed }"
        @click="toggleCollapse"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="navMenu" :class="['navbar-menu', { 'is-active': !collapsed }]">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <g-link class="navbar-link" to="/about" exactActiveClass="is-active"
            >About</g-link
          >
          <div class="navbar-dropdown">
            <g-link
              v-for="page of aboutPages"
              :key="page.path"
              class="navbar-item"
              :to="page.path"
              exactActiveClass="is-active"
              >{{ page.title }}</g-link
            >
          </div>
        </div>
        <g-link class="navbar-item" to="/events" exactActiveClass="is-active"
          >Events</g-link
        >
        <div class="navbar-item has-dropdown is-hoverable">
          <a href="#" class="navbar-link">Resources</a>

          <div class="navbar-dropdown">
            <g-link class="navbar-item" to="/live" activeClass="is-active"
              >Live 📺</g-link
            >
            <g-link
              class="navbar-item"
              to="/sermons/all"
              activeClass="is-active"
              >Sermons</g-link
            >
            <g-link
              class="navbar-item"
              to="/bulletins"
              exactActiveClass="is-active"
              >Bulletins</g-link
            >
            <g-link class="navbar-item" to="/resources/recommended-books"
              >Recommended Books</g-link
            >
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <g-link
            class="navbar-link"
            to="/ministries"
            exactActiveClass="is-active"
            >Ministries</g-link
          >
          <div class="navbar-dropdown">
            <g-link
              v-for="page of ministryPages"
              :key="page.path"
              class="navbar-item"
              :to="page.path"
              exactActiveClass="is-active"
              >{{ page.title }}</g-link
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<static-query>
query AboutPages {
  allAboutPage {
    edges{
      node{
        title
        slug
        path
      }
    }
  }
  allMinistriesPage {
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
import Logo from '~/assets/images/pcc-logo.svg'
export default {
  components: {
    Logo,
  },
  methods: {
    toggleCollapse() {
      this.collapsed
        ? this.$store.commit('expandNavbar')
        : this.$store.commit('collapseNavbar')
    },
  },
  computed: {
    collapsed() {
      return this.$store.state.navbarCollapsed
    },
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
    ministryPages() {
      const pages = this.$static.allMinistriesPage.edges
        .filter(edge => edge.node.slug !== 'index')
        .map(edge => edge.node)

      let order = [
        'Music',
        'Adult',
        'RUF at UCONN',
        'Young Adults',
        'Youth',
        "Children's Ministry",
        'Vacation Bible School',
      ]

      return pages.sort((a, b) => {
        return order.indexOf(a.title) - order.indexOf(b.title)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/mixins';
@import '@/assets/_colors.scss';

.logo {
  height: 30px;
  width: auto;
}

@include from($desktop) {
  .navbar-dropdown a.navbar-item {
    color: black !important;
    &:hover {
      color: white !important;
    }

    &.is-active {
      background-color: $primary !important;
      color: white !important;
      &:hover {
        background-color: $dark !important;
      }
    }
  }
}
</style>
