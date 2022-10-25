<template>
  <div class="cd-home-search">
    <v-container class="banner d-flex flex-column justify-center align-center py-16">
      <div class="text-h4 my-4 text-center">Critical Zone Collaborative Network</div>
      <div class="text-h5 text--secondary mt-4 mb-12">Data Discovery Portal</div>
      <div class="search-container full-width px-4 text-center mb-4">
        <div class="text--secondary text-body-1 text-center my-4">Enter search terms here:</div>
        <cd-search />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import CdSearch from '@/components/search/cd.search.vue'

  @Component({
    name: 'cd-home-search',
    components: { CdSearch },
  })
  export default class CdHomeSearch extends Vue {

  }
</script>

<style lang="scss" scoped>
  .banner {
    background: #DDD;

    .search-container {
      max-width: 45rem;
    }
  }
</style>
