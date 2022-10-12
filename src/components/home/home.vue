<template>
  <v-container class="home">
    <div>Home Component</div>
    <v-btn color="primary">Primary</v-btn>
    <v-btn color="secondary">Secondary</v-btn>
    <v-btn color="accent">Accent</v-btn>
    <v-btn color="error">Error</v-btn>
    <v-btn color="success">Success</v-btn>
    <v-btn color="info">Info</v-btn>

    <div v-for="r of fuzzy_search" :key="r._id">{{ r.name }}</div>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import gql from 'graphql-tag'

  const Search = require('@/graphql/Search.gql')

  @Component({
    name: 'home',
    components: { },
    apollo: {
      fuzzy_search: {
        query: gql`${Search}`,
        variables: { term: ' ', limit: 0 }
      },
    }
  })
  export default class Home extends Vue {
    protected fuzzy_search = []

    async created() {
      console.log('created')
      await this.refetch()
      console.log(this)
      // console.log(response)
    }

    async refetch() {
      // Query execution example
      const query = this.$apollo.queries.fuzzy_search
      return query.refetch({ limit: 10, term: 'Temperature' })
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
