<template>
  <b-pagination
    :total="total"
    :current="current"
    order="is-centered"
    :per-page="perPage"
    @change="changePage"
  ></b-pagination>
</template>

<script>
export default {
  props: ['path', 'total', 'current', 'perPage'],
  methods: {
    changePage(newPage) {
      if (newPage === 1) {
        this.$router.push({ path: this.path })
      } else {
        this.$router.push({ path: `${this.path}/${newPage}` })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ > .pagination {
  margin-bottom: 10px;
}
</style>
