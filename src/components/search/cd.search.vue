<template>
  <v-menu offset-y v-model="menu">
    <template v-slot:activator="{ on }">
      <v-text-field
        @keyup.up="onHintHighlighted"
        @keyup.down="onHintHighlighted"
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
    />
    <v-list>
      <v-list-item-group v-if="blink" @change="onHintSelected">
        <v-list-item
          v-for="hint of hints"
          ref="hintElements"
          :key="hint"
          dense
        >
          <v-list-item-title>{{ hint }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
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
    switchMap,
    tap
  } from 'rxjs/operators';
  import gql from 'graphql-tag'
  import SearchHistory from '@/models/search-history.model';

  const Typeahead = require(`@/graphql/${ TYPEAHEAD_QUERY }`)
  const typeaheadDebounceTime = 500

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
    @Ref('hintElements') hintElements
    
    protected valueInternal = ''
    protected valueHighlighted = ''
    protected previousValueInternal = ''
    protected hints: string[] = []  // used to reactively bind to template
    protected menu = false
    protected isFetchingHints = false
    protected blink = true

    protected get typeaheadHints(): string[] {
      if (!this[TYPEAHEAD_RESOLVER] || !this.valueInternal) {
        return []
      }

      const hints = this[TYPEAHEAD_RESOLVER]
        .map(h => h.highlights)
        .flat()
        .map(h => h.texts)
        .flat()
        .filter(t => t.type === 'hit')
        .map(t => t.value.toLowerCase())
        .filter((v:string) => v !== this.valueInternal.toLowerCase())
      
      return [...new Set(hints)].slice(0, 10) as string[]
    }

    created() {
      SearchHistory.log('test3')
      // console.log(SearchHistory.all())
      // console.log(SearchHistory.find('test3'))
      // console.log(SearchHistory.find('test4'))
    }

    async mounted() {
      this.valueInternal = this.value
      this.previousValueInternal = this.value
      await this._onTypeahead()
      this.hints = !this.valueInternal ? [] : this.typeaheadHints

      // https://www.learnrxjs.io/learn-rxjs/recipes/type-ahead
      fromEvent(this.searchInput.$el, 'input')
        .pipe(
          tap(() => { this.isFetchingHints = !!this.valueInternal }),
          debounceTime(typeaheadDebounceTime),
          map((e: any) => e.target.value),
          distinctUntilChanged(),
          switchMap(
            () => from(this._onTypeahead())
          )
        ).subscribe(() => {
          this._handleTypeahead()
        })
    }

    protected onSearch() {
      this._onChange()
      if (this.valueInternal && this.$route.name !== 'search') {
        this.$router
          .push({ name: 'search', query: { q: this.valueInternal } })
          .catch(sameRouteNavigationErrorHandler)
      }
    }

    protected onHintHighlighted(event: any) {
      const hintIndex = this.hintElements.findIndex(e => e.$el.classList.contains('v-list-item--highlighted'))

      // TODO: detect crossover and restore previous value
      // if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      //   if (hintIndex === this.hintElements.length - 1) {
      //     // Crossed over
      //     this.valueInternal = this.previousValueInternal
      //     this.menu = false
      //   }
      // }
      this.valueHighlighted = this.hints[hintIndex]
      this.valueInternal = this.valueHighlighted
    }

    protected async onHintSelected(seletedIndex: number) {
      if (seletedIndex !== undefined) {
        this.valueInternal = this.hints[seletedIndex]
        this.previousValueInternal = this.valueInternal
        this.isFetchingHints = !!this.valueInternal
        this.onSearch()
        await this._onTypeahead()
        this._handleTypeahead(false)
      }
    }

    protected onClear() {
      this.hints = []
    }

    private async _onTypeahead() {
      if (!this.valueInternal) {
        this.isFetchingHints = false
        this.hints = []
        return
      }

      try {
        const query = this.$apollo.queries[TYPEAHEAD_RESOLVER]
        // set query parameters
        query.setVariables({
          ...this.params,
          term: this.valueInternal,
        })
        await query.refetch()
      }
      catch(e) {
        console.log(e)
      }
    }

    private _handleTypeahead(bringUpHintsMenu = true) {
      if (!this.valueInternal) {
        this.hints = []
      }
      else {
        // Buetify doesn't handle well reasigning list items array!
        this.hints = this.typeaheadHints

        // Reinstantiate component to reset state.
        this.blink = false
        this.$nextTick(() => {
          this.blink = true
        })

        if (bringUpHintsMenu) {
          this.menu = true
        }
        this.isFetchingHints = false
      }
    }

    private _onChange() {
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
