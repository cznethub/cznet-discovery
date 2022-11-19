<template>
  <v-menu offset-y v-model="menu">
    <template v-slot:activator="{ on }">
      <v-text-field
        ref="search"
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
        @click:clear="onClear"
        v-on="on"
      />
    </template>
    <v-progress-linear
      v-if="isFetchingHints"
      indeterminate
      absolute
      color="yellow darken-2"
    ></v-progress-linear>
    <v-list>
      <v-list-item
        v-for="hint of hints"
        :key="hint"
      >
        <v-list-item-title>{{ hint }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Ref } from 'vue-property-decorator'
  import { sameRouteNavigationErrorHandler } from '@/constants'
  import { TYPEAHEAD_RESOLVER, TYPEAHEAD_QUERY } from '@/constants'
  import { fromEvent, from } from 'rxjs';
  import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap
  } from 'rxjs/operators';
  import gql from 'graphql-tag'
import SearchHistory from '@/models/search-history.model';

  const Typeahead = require(`@/graphql/${ TYPEAHEAD_QUERY }`)
  const typeaheadDebounceTime = 200

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
    @Ref('search') searchInput
    
    protected valueInternal = ''
    protected hints: string[] = []  // used to reactively bind to template
    protected menu = false
    protected isFetchingHints = false

    protected get typeaheadHints(): string[] {
      if (!this[TYPEAHEAD_RESOLVER] || !this.valueInternal) {
        return []
      }

      const hints = this[TYPEAHEAD_RESOLVER]
        .map(h => h.highlights)
        .flat().map(h => h.texts)
        .flat()
        .filter(t => t.type === 'hit')
        .map(t => t.value.toLowerCase())
        .filter((v:string) => v !== this.valueInternal.toLowerCase())
      
      return [...new Set(hints)].slice(0, 10) as string[]
    }

    created() {
      SearchHistory.log('test3')
      console.log(SearchHistory.all())
      console.log(SearchHistory.find('test3'))
      console.log(SearchHistory.find('test4'))
    }

    async mounted() {
      this.valueInternal = this.value
      await this.onTypeahead()
      this.hints = !this.valueInternal ? [] : this.typeaheadHints

      // https://www.learnrxjs.io/learn-rxjs/recipes/type-ahead
      fromEvent(this.searchInput.$el, 'keyup')
        .pipe(
          debounceTime(typeaheadDebounceTime),
          map((e: any) => e.target.value),
          distinctUntilChanged(),
          switchMap(
            () => from(this.onTypeahead())
          )
        )
        .subscribe(this.handleTypeahead)
    }

    protected async onTypeahead() {
      if (!this.valueInternal) {
        this.hints = []
        return
      }
      this.isFetchingHints = true

      try {
        const query = this.$apollo.queries[TYPEAHEAD_RESOLVER]
        // set query parameters
        query.setVariables({
          term: this.valueInternal,
          ...this.params
        })
        await query.refetch()
      }
      catch(e) {
        console.log(e)
      }
      this.isFetchingHints = false
    }

    protected handleTypeahead() {
      if (!this.valueInternal) {
        this.hints = []
      }
      else {
        this.hints = this.typeaheadHints
        this.menu = true
      }
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

    protected onClear() {
      this.hints = []
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
