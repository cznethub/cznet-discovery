<template>
  <div class="cd-home">
    <cd-home-search />
    <cd-featured-datasets></cd-featured-datasets>

    <v-divider></v-divider>

    <v-container class="text-center py-12">
      <div class="display-1 mt-4">Contribute Data or Research Products</div>
      <div class="text--secondary text-body-2 mt-2 mb-4 d-inline-block" style="max-width: 35rem;">
        The I-GUIDE platform is designed to harness the vast, diverse, and distributed geospatial data at different spatial and temporal scales and make them broadly accessible and usable to convergence research and education enabled by cutting-edge cyberGIS and cyberinfrastructure.
      </div>
      <br>

      <div class="text-subtitle-2 mt-4 d-inline-block" style="max-width: 30rem;">If you have data or other research products that you want to contribute, visit the I-GUIDE Submission Portal</div>
      <br>

      <v-btn href="https://dsp.criticalzone.org" class="my-4" :disabled="true" small color="accent">Contribute Data</v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import CdHomeSearch from "@/components/home/cd.home-search.vue"
  import CdFeaturedDatasets from "@/components/home/cd.featured-datasets.vue"

  @Component({
    name: 'cd-home',
    components: { CdHomeSearch, CdFeaturedDatasets }
  })
  export default class CdHome extends Vue {

  }
</script>

<style lang="scss" scoped>
  
</style>
