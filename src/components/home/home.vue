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

  @Component({
    name: 'home',
    components: { },
  })
  export default class Home extends Vue {

  }
</script>

<style lang="scss" scoped>
  
</style>
