<template>
  <Layout background="beliefs-blur.jpg">
    <template slot="title">
      <h1 class="title is-size-1">Recommended Books</h1>
    </template>
    <main class="content max-w-5xl mx-auto">
      <section v-for="section in sections" :key="section.category">
        <h1>{{ section.category }}</h1>
        <div class="book-container">
          <div v-for="book in section.books" :key="book.name" class="book">
            <a
              v-if="book.link"
              :href="book.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <figure class="image is-2by3 book-image">
                <g-image
                  v-if="book.imageSrc"
                  :src="book.imageSrc"
                  :alt="book.name"
                ></g-image>
              </figure>
            </a>
            <figure v-else class="image is-2by3 book-image">
              <g-image
                v-if="book.imageSrc"
                :src="book.imageSrc"
                :alt="book.name"
              ></g-image>
            </figure>
          </div>
        </div>
      </section>
    </main>
  </Layout>
</template>

<page-query>
query RecommendedBooks {
  recommendedBooks: settings(path: "/content/settings/recommended-books") {
    sections {
      category
      books {
        name
        image
        link
      }
    }
  }
}
</page-query>

<script>
import Layout from '@/layouts/Page.vue'

const bookImages = require.context(
  '../../../content/images/books',
  false,
  /\.jpg$/
)

export default {
  metaInfo() {
    return {
      title: 'Recommended Books',
    }
  },
  components: {
    Layout,
  },
  computed: {
    sections() {
      return (this.$page.recommendedBooks.sections || []).map((section) => ({
        ...section,
        books: section.books.map((book) => ({
          ...book,
          imageSrc: this.bookImage(book.image),
        })),
      }))
    },
  },
  methods: {
    bookImage(image) {
      if (!image) return null

      const filename = image.split('/').pop()
      try {
        return bookImages(`./${filename}`)
      } catch (error) {
        return null
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
.book-container {
  @apply flex items-center justify-start;
}

.book {
  @apply w-64 p-4 max-w-sm;
}

.book a img {
  transition: all 0.3s ease-in-out;
}

.book a:hover img {
  filter: brightness(70%);
  transform: scale(1.1);
}

figure.book-image {
  @apply object-cover m-0 overflow-hidden;
}
</style>
