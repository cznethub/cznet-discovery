<template>
  <v-card class="auth-redirect"> redirect here </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "auth-redirect",
  components: {},
})
export default class AuthRedirect extends Vue {
  created() {
    console.log("redirect");
    // window.close();
  }
}
</script>

<style lang="scss" scoped></style>
