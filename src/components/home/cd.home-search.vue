<template>
  <v-parallax dark class="cd-home-search" :src="require('@/assets/img/bg2.jpg')" height="650">
    <v-container class="d-flex flex-column justify-center align-center full-height pa-12"
      :style="{ 'background-image': 'linear-gradient(rgb(60 113 162 / 88%), rgb(40 74 64 / 7%))' }">
      <div class="text-h3 my-4 text-center has-text-shadow">Critical Zone Collaborative Network</div>
      <div class="text-h4 mt-4 mb-12 has-text-shadow">Data Discovery Portal</div>
      <div class="search-container full-width px-4 text-center mb-4">
        <div class="has-text-shadow font-weight-normal text-h6 mb-4">Enter search terms here:</div>
        <cd-search />
      </div>
    </v-container>
  </v-parallax>
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
  .search-container {
    max-width: 45rem;
  }

  ::v-deep .v-parallax__content {
    padding: 0;
  }
</style>
