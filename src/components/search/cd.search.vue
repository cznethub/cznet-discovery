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
      this.$router.push({ name: 'search', query: { q: this.valueInternal } })
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
