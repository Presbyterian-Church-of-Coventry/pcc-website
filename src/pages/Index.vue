<template>
  <Layout>
    <template slot="title">
      <h1 class="text-4xl md:text-5xl">Presbyterian Church of Coventry</h1>
      <h2 class="text-xl mt-4 md:mt-0">
        A congregation of The Presbyterian Church in America
      </h2>
    </template>
    <template slot="hero-foot">
      <div
        class="section time-and-location-block has-text-centered-touch lg:px-12 xl:px-1/10 lg:relative lg:-top-32 lg:mb-6"
      >
        <div class="service-times">
          <p>
            Join us for Sunday Worship at 10:30am. Sunday School meets at 9:30am
          </p>
          <p>
            Evening Worship is at 6pm (except for the 2nd Sunday of the month).
          </p>
        </div>
        <div>
          <g-link
            to="/about/directions"
            class="flex items-center justify-center directions text-white hover:text-link mt-4 lg:mt-0"
          >
            <ChurchIcon name="navigation" class="nav-icon inline-block -mt-1" />
            <strong class="leading-none">How to Get Here</strong>
          </g-link>
        </div>
      </div>
    </template>
    <div class="top-section has-background-dark has-text-light">
      <div class="info-blocks lg:px-12 xl:px-1/10 lg:relative lg:-top-32">
        <div class="columns is-marginless">
          <div class="column is-paddingless is-one-half-tablet">
            <g-link to="/about/what-to-expect">
              <g-image
                src="~/assets/images/what-to-expect.jpg"
                alt="what to expect"
                width="700"
                height="350"
                fit="cover"
              />
              <p class="tracking-wider uppercase">What to Expect at PCC</p>
            </g-link>
          </div>
          <div class="column is-paddingless is-one-half-tablet">
            <g-link to="/about/beliefs">
              <g-image
                src="~/assets/images/beliefs.jpg"
                alt="our beliefs"
                width="700"
                height="350"
                fit="cover"
              />
              <p class="tracking-wider uppercase">Our Beliefs</p>
            </g-link>
          </div>
        </div>
      </div>
      <div
        class="latest-sermon lg:px-12 xl:px-1/10 lg:relative lg:-top-16 py-8 lg:p-0"
      >
        <LatestSermonBlock />
        <div class="text-center lg:text-right">
          <g-link
            class="inline-block text-white text-lg mt-4 p-2 hover:underline"
            to="/sermons/all"
            >View All Sermons ⟶</g-link
          >
        </div>
      </div>
    </div>
    <section class="section">
      <UpcomingEventsBlock />
    </section>
    <section
      class="section is-medium has-text-white has-text-centered connect-block max-w-960"
    >
      <div class="is-size-4">
        For the glory of God and the joy of his people PCC is a church devoted
        to biblical worship, reformed theology, the fellowship of the saints,
        and the advancement of gospel of Christ.
      </div>
      <div class="connect-buttons columns is-multiline">
        <div class="column">
          <g-link
            to="/about/gospel"
            class="button is-large is-white is-outlined"
            >What is the Gospel?</g-link
          >
        </div>
        <div class="column">
          <g-link
            to="/ministries/shepherding"
            class="button is-large is-white is-outlined"
            >Connect</g-link
          >
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/layouts/Front.vue'
import LatestSermonBlock from '@/components/LatestSermonBlock.vue'
import UpcomingEventsBlock from '@/components/UpcomingEventsBlock.vue'

export default {
  metaInfo: {
    title: 'Presbyterian Church of Coventry',
    titleTemplate: '%s',
  },
  components: {
    Layout,
    LatestSermonBlock,
    UpcomingEventsBlock,
  },
}
</script>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/mixins';

h1.title {
  font-size: 62px;
  font-weight: 200;
}

@include from($desktop) {
  .time-and-location-block {
    color: white;
    font-size: 18px;

    .service-times {
      float: left;
    }

    .directions {
      float: right;
    }
  }
}

.directions {
  &:hover .nav-icon {
    transform: rotate(405deg);
  }

  .nav-icon {
    transition: transform 0.3s ease-in-out;
    transform: rotate(45deg);
    margin-right: 10px;
  }
}

.nav-icon {
  transform: rotate(45deg);
}

.top-section {
  color: whitesmoke !important;
  h1.title {
    color: whitesmoke;
  }
}

.info-blocks {
  .columns {
    background-color: rgba(0, 0, 0, 0.45);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.35);
    .column {
      text-align: center;
      overflow: hidden;
      position: relative;
    }

    a {
      color: white !important;
      display: block;
      background-color: #222020;
      transition: 0.25s ease-in-out;

      img {
        object-fit: cover;
        display: block;
        height: 100%;
        width: 100%;
        transition: 0.25s ease-in-out;
        filter: opacity(0.7);
      }

      &:hover {
        background-color: #353232;
        img {
          transform: scale(1.12);
        }
      }

      p {
        display: block;
        position: absolute;
        font-weight: 700;
        font-size: 23.5px;
        line-height: 30px;
        margin: 0 auto;
        max-width: 44%;
        height: auto;
        left: 0;
        right: 0;
        top: calc(50%);
        transform: translateY(-50%);
      }
    }
  }
}

.connect-block {
  background-image: url('../assets/images/connect.jpg');
  background-size: cover;
  background-position: center;
  @include from($desktop) {
    background-attachment: fixed;
  }

  .connect-buttons {
    margin-top: 20px;
  }

  .button {
    border-radius: 0;
    &:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>
