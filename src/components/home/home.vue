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
  import ApolloQuery from 'vue-apollo'
  import gql from 'graphql-tag'
  const Resources = require('@/graphql/Resources.gql')

  @Component({
    name: 'home',
    components: { ApolloQuery },
    apollo: {
      geojson_checksum_normalizeds: gql`${Resources}`,
    }
  })
  export default class Home extends Vue {
    async created() {
      // Query execution example
      const query = this.$apollo.queries.geojson_checksum_normalizeds
      query.setVariables({ $limit: 10, $after: null })
      const res = await query.refetch()
      console.log(res.data)
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
