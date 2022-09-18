<template>
  <div>
    <home></home>
    <router-view name="content" />
    <router-view name="footer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Home from "@/components/home/home.vue"

@Component({
  name: "app",
  components: { Home },
})
export default class App extends Vue {
  
}
</script>

<style lang="scss" scoped>

</style>
