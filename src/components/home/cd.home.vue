<template>
  <div class="cd-home">
    <cd-home-search />
    <!-- <v-btn color="primary">Primary</v-btn>
    <v-btn color="secondary">Secondary</v-btn>
    <v-btn color="accent">Accent</v-btn>
    <v-btn color="error">Error</v-btn>
    <v-btn color="success">Success</v-btn>
    <v-btn color="info">Info</v-btn> -->
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
