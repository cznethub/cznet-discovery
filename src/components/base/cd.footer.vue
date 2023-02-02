<template>
  <v-container flat class="footer text--secondary d-flex flex-column align-center full-width body-2">
    <div class="d-lg-flex justify-space-between full-width">
      <div class="has-space-bottom-2x">
        <div class="has-space-bottom text-h6 mb-1">Contact Us</div>
        <p><router-link to="/contact">Contact</router-link></p>
        <p><a :href="'mailto:' + supportEmail">Email Support</a></p>
        <p>Learn more about <a href="https://www.i-guide.org/"
          target="_blank">I-GUIDE</a>
        </p>
        <p>Visit <a href="https://www.i-guide.org/" target="_blank">i-guide.org</a></p>
      </div>

      <div>
        <div class="has-space-bottom text-h6 mb-1">Open Source</div>
        <p>The I-GUIDE Data Submission Portal is Open Source. Find us on <a href="https://github.com/cznethub/dsp" target="_blank">GitHub</a>.</p>
        <p>Report a bug <a href="https://github.com/cznethub/dsp/issues" target="_blank">here</a></p>
        <p>This is Version {{ version }} of the Data Discovery Portal</p>
      </div>
    </div>

    <v-divider />

    <div class="d-flex align-center flex-column gap-1 flex-sm-row has-space-top-2x">
      <div class="d-flex align-center gap-1 flex-1">
        <img :src="require('@/assets/img/nsf.png')" alt="NSF Logo" height="80px" />
        <div>(c) {{ year }} I-GUIDE All Rights Reserved<br>
Institute for Geospatial Understanding through an Integrative Discovery Environment (I-GUIDE) is supported by the National Science Foundation</div>
      </div>
      <p class="flex-1">This material is based upon work supported by the National Science Foundation (NSF) under award No. 2118329. Any opinions, findings, conclusions, or recommendations expressed in this material are those of the authors and do not necessarily reflect the views of the NSF.</p>
    </div>
  </v-container>
</template>

<script lang="ts">
  import { SUPPORT_EMAIL } from '@/constants'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    name: 'cd-footer',
    components: { },
  })
  export default class CdFooter extends Vue {
    protected supportEmail = SUPPORT_EMAIL
    protected get version() {
      return process.env.VUE_APP_VERSION || '0'
    }

    protected get year() {
      return (new Date()).getFullYear()
    }
  }
</script>

<style lang="scss" scoped>
  .footer {
    padding: 2rem 0;
  }

  .flex-1 {
    flex: 1;
  }
</style>
