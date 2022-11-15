<template>
  <v-parallax dark class="cd-home-search" :src="'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg' || require('@/assets/img/bg.jpg')">
    <v-container class="d-flex flex-column justify-center align-center py-16">
      <div class="text-h4 my-4 text-center has-text-shadow">Critical Zone Collaborative Network</div>
      <div class="text-h5 mt-4 mb-12 has-text-shadow">Data Discovery Portal</div>
      <div class="search-container full-width px-4 text-center mb-4">
        <div class="text-body-1 text-center my-4 has-text-shadow">Enter search terms here:</div>
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
</style>
