<template>
  <v-parallax
    dark
    class="cd-home-search"
    alt="Snowy mountains over landscape with pine trees and a river"
    :src="require('@/assets/img/bg2.jpg')"
    height="450"
  >
    <v-container
      class="d-flex flex-column justify-center align-center full-height pa-12"
      :style="{
        'background-image':
          'linear-gradient(rgb(60 113 162 / 88%), rgb(40 74 64 / 7%))',
      }"
    >
      <div class="text-h3 my-4 text-center has-text-shadow">
        {{ $t("home.search.title") }}
      </div>
      <div class="text-h5 mt-2 mb-12 has-text-shadow text-center">
        {{ $t("home.search.subtitle") }}
      </div>
      <div class="search-container full-width px-4 text-center mb-4">
        <div class="has-text-shadow font-weight-normal text-h6 mb-2">
          {{ $t("home.search.inputLabel") }}
        </div>
        <cd-search ref="search" />
        <div class="has-text-shadow text-h5 mt-12 mb-2">
          Not sure what you are looking for?
        </div>
        <v-btn @click="searchInput.browse('CZNet')" color="white">Browse CZNet data products</v-btn>
      </div>
    </v-container>
  </v-parallax>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import CdSearch from "@/components/search/cd.search.vue";

@Component({
  name: "cd-home-search",
  components: { CdSearch },
})
export default class CdHomeSearch extends Vue {
  @Ref("search") searchInput;
}
</script>

<style lang="scss" scoped>
.cd-home-search {
  background-color: var(--v-navbar-base);
}

.search-container {
  max-width: 45rem;
}

::v-deep .v-parallax__content {
  padding: 0;
}
</style>
