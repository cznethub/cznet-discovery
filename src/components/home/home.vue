<template>
  <v-container class="home">
    <div>Home Component</div>
    <v-btn color="primary">Primary</v-btn>
    <v-btn color="secondary">Secondary</v-btn>
    <v-btn color="accent">Accent</v-btn>
    <v-btn color="error">Error</v-btn>
    <v-btn color="success">Success</v-btn>
    <v-btn color="info">Info</v-btn>
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
      schemaorg: gql`${Search}`,
    }
  })
  export default class Home extends Vue {
    async created() {
      const response = await this.refetch()
      console.log(response)
    }

    async refetch() {
      // Query execution example
      const query = this.$apollo.queries.schemaorg
      query.setVariables({ limit: 10, after: null })
      return query.refetch()
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
