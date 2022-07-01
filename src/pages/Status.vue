<template>
  <Layout>
    <h1 class="text-3xl font-bold">Special Status Page ;)</h1>
    <button
      class="mt-4 button is-primary is-outlined legacy text-lg"
      @click="updateBulletins"
    >
      Update Bulletins
    </button>
    <img
      class="mt-4"
      src="https://api.netlify.com/api/v1/badges/0b403c8f-5538-4026-b21b-75188f92bf72/deploy-status"
      alt="Deploy status badge"
    />
    <div class="mt-4">
      <img :src="imgUrl()" />
    </div>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      status: null,
      img: null,
    }
  },
  async computed() {
    this.updateStatus()
  },
  methods: {
    updateStatus() {
      fetch('https://api.blazenetworking.com/pcc/v1/status')
        .then((response) => response.text())
        .then((data) => ((this.status = data), this.imgUrl()))
    },
    async updateBulletins() {
      const updated = fetch(
        'https://wt-e912d81343ad4eb04a77abd08cfa41e1-0.sandbox.auth0-extend.com/pcc-update-bulletins'
      )
      alert('Bulletins will be updated now ;)')

      if (process.isClient) {
        location.reload()
      }
    },
    imgUrl() {
      switch (String(this.status).trim()) {
        case 'success':
          return 'https://img.shields.io/badge/sermon%20upload-success-success'
        case 'failed':
          return 'https://img.shields.io/badge/sermon%20upload-failed-critical'
        case 'idle':
          return 'https://img.shields.io/badge/sermon%20upload-idle-inactive'
        case 'processing':
          return 'https://img.shields.io/badge/sermon%20upload-processing-informational'
        default:
          return 'https://img.shields.io/badge/-loading-red'
      }
    },
  },
  mounted: function () {
    window.setInterval(() => {
      this.updateStatus()
    }, 5000)
  },
}
</script>
