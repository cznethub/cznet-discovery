<template>
  <div class="cd-home">
    <cd-home-search />
    <cd-featured-datasets></cd-featured-datasets>

    <v-divider />

    <v-container class="text-center py-12">
      <div class="display-1 mt-4">{{ $t("home.contribute.title") }}</div>
      <v-list-subheader
        class="text-body-1 mt-2 mb-4 d-inline-block font-weight-light"
        style="max-width: 35rem"
      >
        {{ $t("home.contribute.subtitle") }}
      </v-list-subheader>
      <br />

      <div
        class="text-body-1 mt-4 d-inline-block font-weight-light"
        style="max-width: 30rem"
      >
        {{ $t("home.contribute.body") }}
      </div>
      <br />

      <v-btn :href="dspUrl" class="my-4" small color="primary">{{
        $t("home.contribute.buttonText")
      }}</v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";
import { DSP_URL } from "@/constants";
import CdHomeSearch from "@/components/home/cd.home-search.vue";
import CdFeaturedDatasets from "@/components/home/cd.featured-datasets.vue";

@Component({
  name: "cd-home",
  components: { CdHomeSearch, CdFeaturedDatasets },
})
class CdHome extends Vue {
  dspUrl = DSP_URL;
}
export default toNative(CdHome);
</script>

<style lang="scss" scoped></style>
