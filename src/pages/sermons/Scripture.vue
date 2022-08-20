<template>
  <Layout>
    <template slot="title">
      <h1 class="title is-size-1">Scripture</h1>
    </template>
    <div class="columns">
      <div class="column">
        <h2
          class="bible-title subtitle is-block has-background-primary has-text-centered has-text-light"
        >
          Old Testament
        </h2>
        <div class="columns">
          <div class="column">
            <ul>
              <li
                v-for="(book, index) of books.OT[0]"
                :key="index"
                class="bible-book has-text-grey-light"
              >
                <g-link
                  v-if="sermonCount(book) > 0"
                  :to="`/sermons/scripture/${sanitizeBook(book)}`"
                >
                  {{ book }}
                  <span class="tag is-light is-normal has-text-weight-bold">{{
                    sermonCount(book)
                  }}</span>
                </g-link>
                <span v-else>{{ book }}</span>
              </li>
            </ul>
          </div>
          <div class="column">
            <ul>
              <li
                v-for="(book, index) of books.OT[1]"
                :key="index"
                class="bible-book has-text-grey-light"
              >
                <g-link
                  v-if="sermonCount(book) > 0"
                  :to="`/sermons/scripture/${sanitizeBook(book)}`"
                >
                  {{ book }}
                  <span class="tag is-light is-normal has-text-weight-bold">{{
                    sermonCount(book)
                  }}</span>
                </g-link>
                <span v-else>{{ book }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="column">
        <h2
          class="bible-title subtitle is-block has-background-primary has-text-centered has-text-light"
        >
          New Testament
        </h2>
        <div class="columns">
          <div class="column">
            <ul>
              <li
                v-for="(book, index) of books.NT[0]"
                :key="index"
                class="bible-book has-text-grey-light"
              >
                <g-link
                  v-if="sermonCount(book) > 0"
                  :to="`/sermons/scripture/${sanitizeBook(book)}`"
                >
                  {{ book }}
                  <span class="tag is-light is-normal has-text-weight-bold">{{
                    sermonCount(book)
                  }}</span>
                </g-link>
                <span v-else>{{ book }}</span>
              </li>
            </ul>
          </div>
          <div class="column">
            <ul>
              <li
                v-for="(book, index) of books.NT[1]"
                :key="index"
                class="bible-book has-text-grey-light"
              >
                <g-link
                  v-if="sermonCount(book) > 0"
                  :to="`/sermons/scripture/${sanitizeBook(book)}`"
                >
                  {{ book }}
                  <span class="tag is-light is-normal has-text-weight-bold">{{
                    sermonCount(book)
                  }}</span>
                </g-link>
                <span v-else>{{ book }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query Sermons {
  sermons: allSermon {
    edges{
      node{
        scripture
      }
    }
  }
}
</page-query>

<script>
import Layout from '@/layouts/SermonPage.vue'

const _ = require('lodash')
let bibleBooks = require('@/assets/data/bible-books.json')

export default {
  metaInfo() {
    return {
      title: 'Scripture',
    }
  },
  components: {
    Layout,
  },
  data() {
    return {
      books: bibleBooks,
    }
  },
  methods: {
    sanitizeBook(book) {
      return book.toLowerCase().replace(/\ /g, '-')
    },
    sermonCount(book) {
      return this.passages.filter(passage =>
        new RegExp(`^${book}`, 'i').test(passage)
      ).length
    },
  },
  computed: {
    passages() {
      return this.$page.sermons.edges.map(({ node }) => node.scripture)
    },
  },
}
</script>

<style lang="postcss" scoped>
h2.bible-title {
  font-weight: bold;
  border-radius: 5px;
  padding: 5px 0;
  text-transform: uppercase;
}

.bible-book {
  font-weight: bold;
  padding: 3px;

  a {
    @apply text-primary;

    &:hover {
      @apply underline;
    }
  }
}
</style>
