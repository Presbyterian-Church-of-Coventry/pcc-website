// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import Vuex from 'vuex'

import Buefy from 'buefy'
import InfiniteLoading from 'vue-infinite-loading'

import DefaultLayout from '~/layouts/Default.vue'
import ChurchIcon from '@/components/ChurchIcon.vue'

import dayjs from 'dayjs'

require('typeface-montserrat')
import '@/assets/theme.scss'
import '@/assets/main.css'
import Vuetify from 'vuetify'

export default function (Vue, { router, head, isClient, appOptions }) {
  Vue.use(Buefy)
  Vue.use(InfiniteLoading)

  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
  })

  const opts = {
    icons: {
      iconfont: 'mdi',
    },
  }
  Vue.use(Vuetify)
  appOptions.vuetify = new Vuetify(opts)

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  // Register ChurchIcon component globally
  Vue.component('ChurchIcon', ChurchIcon)

  // Scripture Filter
  Vue.filter('scripture', function (value) {
    if (value) {
      value = value.toString()
      return `<a href="https://biblia.com/books/esv/${value.replace(
        /\ /g,
        ''
      )}" target="_blank" rel="noreferrer">${value}</a>`
    } else {
      return ''
    }
  })

  // Date Filter
  Vue.filter('date', function (value, format) {
    if (value) {
      if (format) {
        return dayjs(value).format(format)
      } else {
        return dayjs(value).format('MM/DD/YYYY hh:mm')
      }
    }
  })

  // Add body attrs
  // head.bodyAttrs = { class: 'my-gridsome' }

  head.script.push({
    body: true,
    type: 'text/javascript',
    innerHTML: `
			if (window.netlifyIdentity) {
				window.netlifyIdentity.on('init', user => {
					if (!user) {
						window.netlifyIdentity.on('login', () => {
							document.location.href = '/admin/'
						})
					}
				})
			}
		`,
  })

  // Add an external JS file
  head.script.push({
    src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
    defer: true,
  })

  // head.script.push({
  // 	src: 'https://cdn.jsdelivr.net/npm/amplitudejs@4.0.0/dist/amplitude.js'
  // })

  // Add Vuex Store to control navbar collapsing
  Vue.use(Vuex)
  appOptions.store = new Vuex.Store({
    state: {
      navbarCollapsed: true,
    },
    mutations: {
      collapseNavbar(state) {
        state.navbarCollapsed = true
      },
      expandNavbar(state) {
        state.navbarCollapsed = false
      },
    },
  })

  router.afterEach((to, from) => {
    appOptions.store.commit('collapseNavbar')
  })
}
