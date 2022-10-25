<template>
  <div class="cd-home-search d-flex flex-column justify-center align-center py-10">
    <div class="display-2 my-4 text-center">Critical Zone Collaborative Network</div>
    <div class="display-1 text--secondary my-4">Data Discovery Portal</div>
    <div class="search-container full-width px-4 text-center">
      <div class="text--secondary text-body-1 text-center my-4">Enter search terms here:</div>
      <cd-search />
    </div>
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
  .cd-home-search {
    background: #DDD;
  }

  .search-container {
    max-width: 45rem;
  }
</style>
