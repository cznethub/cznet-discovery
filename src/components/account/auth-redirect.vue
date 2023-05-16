<template>
  <v-container>
    <div class="text-h5">You have signed in!</div>
    <p class="font-weight-regular text-body-1 mt-4">
      You can return to the main page. This window will be closed
      automatically...
    </p>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "auth-redirect",
  components: {},
})
export default class AuthRedirect extends Vue {
  mounted() {
    // Get a dictionary of parameters in the redirect response URL
    const dict: any = {};
    this.$route.hash.split("&").reduce((acc, curr) => {
      const [key, val] = curr.split("=");
      acc[key] = val;
      return acc;
    }, dict);

    postMessage(dict.access_token || "", "http://localhost:8080");
  }
}
</script>

<style lang="scss" scoped></style>
