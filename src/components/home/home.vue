<template>
  <div class="home">
    home component here!!
  </div>
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
