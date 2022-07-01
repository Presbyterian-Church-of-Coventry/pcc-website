<template>
  <Layout background="beliefs-blur.jpg">
    <template slot="title">
      <h1 class="title is-size-1">Recommended Books</h1>
    </template>
    <main class="content max-w-5xl mx-auto">
      <h1>Apologetics</h1>
      <div class="book-container">
        <div class="book">
          <a href="https://amzn.com/0875522432" target="_blank">
            <figure class="image is-2by3 book-image">
              <g-image
                src="~/../content/images/books/frame_apologetics-to-the-glory-of-god.jpg"
              ></g-image>
            </figure>
          </a>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/keller_making-sense-of-god.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/oliphint_the-battle-belongs-to-the-lord.jpg"
            ></g-image>
          </figure>
        </div>
      </div>
      <h1>Christian Living</h1>
      <div class="book-container">
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/packer_knowing-god.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/bridges_the-pursuit-of-holiness.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/ferguson_devoted-to-god.jpg"
            ></g-image>
          </figure>
        </div>
      </div>
      <h1>Theology</h1>
      <div class="book-container">
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/boice_foundations-of-the-christian-faith.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/leith_introduction-to-the-reformed-tradition.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/mckim_calvins-institutes.jpg"
            ></g-image>
          </figure>
        </div>
      </div>
      <h1>Gospel</h1>
      <div class="book-container">
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/stott_basic-christianity.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/bridges_the-gospel-for-real-life.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/horton_puttin-amazing-back-into-grace.jpg"
            ></g-image>
          </figure>
        </div>
      </div>
      <h1>Ministry</h1>
      <div class="book-container">
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/welch_side-by-side.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/horton_puttin-amazing-back-into-grace.jpg"
            ></g-image>
          </figure>
        </div>
      </div>
      <h1>Church History</h1>
      <div class="book-container">
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/reid_reformation.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/noll_turning-points.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/wilken_the-spirit-of-early-christian-thought.jpg"
            ></g-image>
          </figure>
        </div>
      </div>
      <h1>Biography</h1>
      <div class="book-container">
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/metaxas_bonhoeffer.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/sayer_a-life-of-cs-lewis.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/nichols_martin-luther.jpg"
            ></g-image>
          </figure>
        </div>
      </div>
      <h1>Evangelism</h1>
      <div class="book-container">
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/piper_let-the-nations-be-glad.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/miller_outgrowing-the-ingrown-church.jpg"
            ></g-image>
          </figure>
        </div>
        <div class="book">
          <figure class="image is-2by3 book-image">
            <g-image
              src="~/../content/images/books/packer_evangelism-and-the-sovereignty-of-god.jpg"
            ></g-image>
          </figure>
        </div>
      </div>
    </main>
  </Layout>
</template>

<page-query>
query Misc {
  books: misc (path: "/misc/recommended-books") {
    content
  }
}
</page-query>

<script>
import Layout from '@/layouts/Page.vue'
// import MinistriesSidebar from '@/components/MinistriesSidebar.vue'
export default {
  metaInfo() {
    return {
      title: 'Recommended Books',
    }
  },
  components: {
    Layout,
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
