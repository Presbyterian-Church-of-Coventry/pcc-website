<template>
  <Layout background="beliefs.jpg">
    <template slot="title">
      <h1 class="title is-size-1">Directions</h1>
    </template>
    <div class="flex flex-col md:flex-row max-w-5xl mx-auto justify-between">
      <main class="content w-full md:pr-4">
        <h2>Address</h2>
        <p>
          55 Trowbridge Road
          <br />Coventry, CT 06238 <br />office@coventrypca.church
        </p>
        <br />
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2974.402683596766!2d-72.36308868447703!3d41.798084979228584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e65f897f75e3d3%3A0xc5d9b1b491cd97fb!2sPresbyterian%20Church%20of%20Coventry!5e0!3m2!1sen!2sus!4v1634133063810!5m2!1sen!2sus"
          width="100%"
          frameborder="0"
          style="border: 0; height: 400px !important;"
          allowfullscreen
          loading="lazy"
        ></iframe>

        <!-- <iframe src= width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe> -->
      </main>
      <AboutSidebar />
    </div>
  </Layout>
</template>

<script>
import Layout from '@/layouts/Page.vue'
import AboutSidebar from '@/components/AboutSidebar.vue'

export default {
  components: {
    Layout,
    AboutSidebar,
  },
}
</script>
