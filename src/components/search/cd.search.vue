<template>
  <v-menu offset-y v-model="menu">
    <template v-slot:activator="{ on }">
      <v-text-field
        ref="search"
        @keyup.up="onHintHighlighted('up')"
        @keyup.down="onHintHighlighted('down')"
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
      <v-list-item-group v-if="showList" ref="hintsGroup">
        <v-list-item
          v-for="(hint, index) of hints"
          ref="hintElements"
          :key="index"
          @click="onHintSelected($event, hint)"
        >
          <v-list-item-title>{{ hint }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'
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
    @Ref('hintsGroup') hintsGroup
    
    protected valueInternal = ''
    protected valueHighlighted = ''
    protected previousValueInternal = ''
    protected hints: string[] = []  // used to reactively bind to template
    protected menu = false
    protected isFetchingHints = false
    protected showList = true
    protected detectCrossover = false

    protected get typeaheadHints(): string[] {
      if (!this[TYPEAHEAD_RESOLVER] || !this.valueInternal) {
        return []
      }

      const minCharacters = 3
      const hints = this[TYPEAHEAD_RESOLVER]
        .map(h => h.highlights)
        .flat()
        .map(h => h.texts)
        .flat()
        .filter(t => t.type === 'hit' && t.value.length > minCharacters)
        .map(t => t.value.toLowerCase())
        .filter((v:string) => v !== this.valueInternal.toLowerCase())
      
      return [...new Set(hints)].slice(0, 10) as string[]
    }

    // Buetify doesn't handle well reasigning list items array
    @Watch('hints', { deep: true })
    protected onHintsChanged() {
      // Reinstantiate component to reset state.
      this.showList = false
      this.$nextTick(() => {
        this.showList = true
      })
      this.detectCrossover = false
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
      this.previousValueInternal = this.valueInternal
      if (this.valueInternal && this.$route.name !== 'search') {
        this.$router
          .push({ name: 'search', query: { q: this.valueInternal } })
          .catch(sameRouteNavigationErrorHandler)
      }
    }

    protected onHintHighlighted(direction: 'up' | 'down') {
      const hintIndex = this.hintElements.findIndex(e => e.$el.classList.contains('v-list-item--highlighted'))

      if (this.detectCrossover) {
        const hasCrossedOver =
          direction === 'up' && hintIndex === this.hints.length - 1 ||
          direction === 'down' && hintIndex === 0

        if (hasCrossedOver) {
          this.valueInternal = this.previousValueInternal
          this.menu = false
          this.detectCrossover = false
          return
        }
      }
      else {
        this.detectCrossover = true
      }

      if (hintIndex >= 0) {
        this.valueHighlighted = this.hints[hintIndex]
        this.valueInternal = this.valueHighlighted
      }
      else {
        // this.valueInternal = this.previousValueInternal
        // this.valueInternal = this.valueInput
      }
    }

    protected async onHintSelected(event: PointerEvent, hint: string) {
      // We only act on mouse events. The enter key is already captured in the input.
      // The value is already populated by onHintHighlighted.
      if (event.type === 'click' && ['mouse', 'pen', 'touch'].includes(event.pointerType)) {
        this.valueInternal = hint
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
        this.isFetchingHints = false
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
        this.hints = this.typeaheadHints

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
