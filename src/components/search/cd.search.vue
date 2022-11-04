<template>
  <v-text-field
    @keydown.enter="onSearch"
    v-model.trim="valueInternal"
    class="cz-search"
    prepend-inner-icon="mdi-magnify"
    placeholder="Search the CZNet catalog"
    rounded background-color="#FFF"
    full-width hide-details
    flat outlined
    dense
    clearable
  />
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component({
    name: 'cd-search',
    components: { },
  })
  export default class CdSearch extends Vue {
    @Prop() value!: string
    protected valueInternal = ''

    created() {
      this.valueInternal = this.value
    }

    protected onSearch() {
      this.onChange()
      if (this.valueInternal) {
        this.$router.push({ name: 'search', query: { q: this.valueInternal } })
          .catch((e) => {
            // Ignore the vuex err regarding  navigating to the page they are already on.
            if (e.name !== 'NavigationDuplicated' && !e.message.includes('Avoided redundant navigation to current location')) {
              // But print any other errors to the console
              console.error(e)
            }
          }
        )
      }
    }

    protected onChange() {
      this.$emit('input', this.valueInternal)
    }
  }
</script>

<style lang="scss" scoped>
  .cd-home-search {
    background: #DDD;
  }

  .search-container {
    max-width: 45rem;
  }
</style>
