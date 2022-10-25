<template>
  <div class="cd-home">
    <cd-home-search />
    <v-container class="text-center py-12">
      <div class="display-1 my-4">Featured Data and Research Products</div>
      <div class="text--secondary text-body-2 my-4 d-inline-block" style="max-width: 35rem;">
        Click on the links below to view and access CZNet's latest featured data and other research products  
      </div>
      <div class="d-flex flex-column flex-md-row gap-2 px-4 mt-8">
        <v-card elevation="1" min-height="100" width="100%"></v-card>
        <v-card elevation="1" min-height="100" width="100%"></v-card>
        <v-card elevation="1" min-height="100" width="100%"></v-card>
      </div>
    </v-container>

    <v-divider></v-divider>

    <v-container class="text-center py-12">
      <div class="display-1 mt-4">Contribute Data or Research Products</div>
      <div class="text--secondary text-body-2 mt-2 mb-4 d-inline-block" style="max-width: 35rem;">
        This Data Discovery Portal provides tools for discovering and accessing data related to the Critical Zone Collaborative network and the Earth's Critical Zone  
      </div>
      <br>

      <div class="text-subtitle-2 mt-4 d-inline-block" style="max-width: 30rem;">If you have data or other research products that you want to contribute, visit the CZNet Data Submission Portal</div>
      <br>

      <v-btn href="https://dsp.criticalzone.org" class="my-4" small color="primary">Contribute Data</v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import CdHomeSearch from "@/components/home/cd.home-search.vue"

  @Component({
    name: 'cd-home',
    components: { CdHomeSearch }
  })
  export default class CdHome extends Vue {
    
  }
</script>

<style lang="scss" scoped>
  
</style>
