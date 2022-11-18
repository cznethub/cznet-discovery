<template>
  
<div>
    <v-menu offset-y :disabled="!hints.length" v-model="menu">
      <template v-slot:activator="{ on }">
        <v-text-field
          @keydown.enter="onSearch"
          v-model.trim.lazy="valueInternal"
          class="cz-search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search the CZNet catalog"
          rounded background-color="#FFF"
          full-width hide-details
          flat outlined
          dense
          clearable
          v-on="on"
        />
      </template>
      <v-list v-if="hints.length">
        <v-list-item
          v-for="hint of hints"
          :key="hint"
        >
          <v-list-item-title>{{ hint }}</v-list-item-title>
        </v-list-item>
      </v-list>
  </v-menu>
</div>

</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
  import { sameRouteNavigationErrorHandler } from '@/constants'
  import { TYPEAHEAD_RESOLVER, TYPEAHEAD_QUERY } from '@/constants'
  import gql from 'graphql-tag'

  const Typeahead = require(`@/graphql/${ TYPEAHEAD_QUERY }`)

  const typeaheadDebounceTime = 300

  @Component({
    name: 'cd-search',
    components: { },
    apollo: {
      [TYPEAHEAD_RESOLVER]: {
        query: gql`${Typeahead}`,
        variables: { term: ' ' },
        // errorPolicy: 'ignore'
      },
    }
  })
  export default class CdSearch extends Vue {
    @Prop() value!: string
    @Prop({ default: () => ({}) }) params!: { [key:string]: any }
    
    protected valueInternal = ''
    protected hints: string[] = []  // used to reactively bind to template
    protected menu = false
    private timeout: any = null

    protected get typeaheadHints(): string[] {
      if (!this[TYPEAHEAD_RESOLVER]) {
        return []
      }

      const hints = this[TYPEAHEAD_RESOLVER]
        .map(h => h.highlights)
        .flat().map(h => h.texts)
        .flat()
        .filter(t => t.type === 'hit')
        .map(t => t.value)
        .filter((v:string) => v.toLowerCase() !== this.valueInternal.toLowerCase())
      
      const uniqueHints = [...new Set(hints)]
        .slice(0, 10)
      
      return uniqueHints as string[]
    }

    @Watch('valueInternal')
    protected onValChange() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.onTypeahead()
      }, typeaheadDebounceTime)
    }

    created() {
      this.valueInternal = this.value
      this.onTypeahead()
    }

    protected async onTypeahead() {
      if (!this.valueInternal) {
        this.hints = []
        return
      }
      // this.isSearching = true

      try {
        const query = this.$apollo.queries[TYPEAHEAD_RESOLVER]

        // set query parameters
        query.setVariables({
          term: this.valueInternal,
          ...this.params
        })

        this.hints = []
        console.log('cleared')
        
        const result = await query.refetch()
        this.hints = this.typeaheadHints
        console.log(this.hints)
        this.menu = true  // TODO: this doesn't always open the menu
      }
      catch(e) {
        console.log(e)
      }
      // this.isSearching = false
    }

    protected onSearch() {
      this.onChange()
      if (this.valueInternal && this.$route.name !== 'search') {
        this.$router
          .push({ name: 'search', query: { q: this.valueInternal } })
          .catch(sameRouteNavigationErrorHandler)
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
