<template>
  <v-container class="cd-search-results text-body-1">
    <div class="d-flex">
      <v-container class="sidebar flex-shrink-0">
        <div class="text-subtitle-2 mb-6">Filter by:</div>
        <!-- PUBLICATION YEAR -->
        <div class="mb-4">
          <v-checkbox
            v-model="filter.publicationYear.isActive"
            @change="onSearch"
            label="Publication year"
            dense
            hide-details
          />
          <v-range-slider
            v-model="filter.publicationYear.range"
            @change="filter.publicationYear.isActive && onSearch()"
            :min="filter.publicationYear.min"
            :max="filter.publicationYear.max"
            class="mb-1"
            hide-details
          />
          <div class="d-flex gap-1">
            <v-text-field
              @change="onSliderChange(filter.publicationYear, 0, $event)"
              :value="filter.publicationYear.range[0]"
              type="number"
              small dense outlined hide-details 
            />
            <v-text-field
              @change="onSliderChange(filter.publicationYear, 0, $event)"
              :value="filter.publicationYear.range[1]"
              type="number"
              small dense outlined hide-details
            />
          </div>
        </div>

        <!-- DATA COVERAGE -->
        <div class="mb-6">
          <v-checkbox
            v-model="filter.dataCoverage.isActive"
            @change="onSearch"
            dense
            label="Data coverage"
            hide-details
          />
          <v-range-slider
            v-model="filter.dataCoverage.range"
            @change="filter.dataCoverage.isActive && onSearch()"
            :min="filter.dataCoverage.min"
            :max="filter.dataCoverage.max"
            class="mb-1"
            hide-details
          />
          <div class="d-flex gap-1">
            <v-text-field
              @change="onSliderChange(filter.dataCoverage, 0, $event)"
              :value="filter.dataCoverage.range[0]"
              type="number"
              small dense outlined hide-details 
            />
            <v-text-field
              @change="onSliderChange(filter.dataCoverage, 1, $event)"
              :value="filter.dataCoverage.range[1]"
              type="number"
              small dense outlined hide-details
            />
          </div>
        </div>

        <v-text-field
          @change="$set(filter, 'creatorName', $event); onSearch()"
          :value="filter.creatorName"
          label="Author / Creator name"
          class="mb-6"
          hide-details
          clearable
          outlined
          dense
        />

        <!-- <v-select
          :items="filter.czProjects.options"
          v-model="filter.czProjects.value"
          class="mb-6"
          clearable
          outlined
          label="CZ project"
          hide-details
          dense
        /> -->

        <v-select
          :items="filter.repository.options"
          v-model="filter.repository.value"
          @change="onSearch"
          class="mb-6"
          clearable
          outlined
          label="Repository"
          hide-details
          dense
        />

        <div>
          <div class="text-body-2">Content type</div>
          <v-checkbox
            v-for="(option, index) of filter.contentType.options"
            :key="index"
            v-model="filter.contentType.value"
            @change="onSearch"
            hide-details
            dense
            :label="option"
            :value="option"
          />
        </div>
      </v-container>
      
      <v-container class="results-content">
        <cd-search v-model="searchQuery" @input="onSearch" />
        <div class="my-6 d-lg-flex flex-row justify-space-between gap-1 d-table">
          <!-- <div class="d-table-row d-lg-flex align-center flex-row">
            <small class="d-table-cell text-right text-lg-left pr-2 py-2" style="white-space: nowrap">View mode:</small>
            <v-btn-toggle class="d-table-cell" v-model="view" dense mandatory>
              <v-btn small><v-icon small>mdi-view-list-outline</v-icon></v-btn>
              <v-btn small><v-icon small>mdi-map</v-icon></v-btn>
            </v-btn-toggle>
          </div> -->
          <div class="d-table-row d-lg-flex align-center flex-row">
            <small class="d-table-cell text-right text-lg-left pr-2" style="white-space: nowrap">Sort results by:</small>
            <v-btn-toggle
              class="d-table-cell"
              v-model="sort"
              dense
            >
              <v-btn small value="dateCreated">Date</v-btn>
              <v-btn small value="name">Title</v-btn>
            </v-btn-toggle>
          </div>
        </div>
        <div class="results-container mb-12">
          <template v-if="isSearching">
            <div v-for="index in 4" :key="index" class="mb-16">
              <div class="d-flex">
                <div class="flex-grow-1">
                  <v-skeleton-loader
                    type="heading"
                  />
                  <v-skeleton-loader
                    class="mt-2"
                    max-width="180"
                    type="text"
                  />
                  <v-skeleton-loader
                    max-width="100"
                    type="text"
                  />
                </div>
                <v-skeleton-loader
                  width="100"
                  max-height="50"
                  type="image"
                />
              </div>
              <v-skeleton-loader
                class="my-2"
                type="paragraph"
              />
              <div class="d-flex align-center my-2 gap-1">
                <v-skeleton-loader
                  width="90"
                  type="text"
                />
                <v-skeleton-loader
                  width="90"
                  type="text"
                />
                <v-skeleton-loader
                  width="90"
                  type="text"
                />
              </div>
              <v-skeleton-loader
                type="button"
              />
            </div>
          </template>
          <div v-if="!filtering_cznet.length" class="text-body-2 text--secondary text-center mt-8">
            <div>No results found.</div>
          </div>
          <div v-for="result of filtering_cznet" class="mb-12 text-body-2" :key="result._id">
            <a class="result-title text-body-1 text-decoration-none"
              :href="result.url"
              v-html="getResultFieldHighlightedHtml(result, 'name')"
            ></a>
            <div class="my-1">{{ getResultAuthors(result) }}</div>
            <div class="my-1">{{ getResultCreationDate(result) }}</div>
            <div class="my-1" v-if="result.datePublished">Publication Date: {{ getResultPublicationDate(result) }}</div>
            <p class="mt-4" v-html="getResultFieldHighlightedHtml(result, 'description')"></p>
            <a class="mb-4 d-block" :href="result.url">{{ result.url }}</a>
            <div class="mb-2"><strong>Keywords: </strong><span v-html="getResultFieldHighlightedHtml(result, 'keywords')"></span></div>
            <div class="mb-2" v-if="result.funding"><strong>Funded by: </strong>{{ getResultFunding(result) }}</div>
            <div class="mb-2"><strong>License: </strong>{{ result.license.text }}</div>
          </div>
        </div>
        <div id="sensor"></div>
        <div v-if="isFetchingMore" class="text-subtitle-2 text--secondary text-center">Loading more results...</div>
        <div v-if="filtering_cznet.length && !hasMore" class="text-subtitle-2 text--secondary text-center">End of results.</div>
      </v-container>
    </div>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import CdSearch from '@/components/search/cd.search.vue'
  import gql from 'graphql-tag'
  import scrollMonitor from 'scrollmonitor'

  const Search = require('@/graphql/Search.gql')
  const maxPublicationYear = (new Date()).getFullYear()
  const minPublicationYear = 1900

  @Component({
    name: 'cd-search-results',
    components: { CdSearch },
    apollo: {
      filtering_cznet: {
        query: gql`${Search}`,
        variables: { term: ' ' },
        // errorPolicy: 'ignore'
      },
    }
  })
  export default class CdSearchResults extends Vue {
    protected filtering_cznet = []
    protected searchQuery = ''
    protected pageNumber = 1
    protected pageSize = 30
    protected hasMore = true
    protected isSearching = false
    protected isFetchingMore = false
    protected sort: 'dateCreated' | 'name' | null = null
    protected view: 'list' | 'map' = 'list'
    protected filter = {
      publicationYear: { 
        min: minPublicationYear, 
        max: maxPublicationYear, 
        range: [maxPublicationYear - 50, maxPublicationYear],
        isActive: false
      },
      dataCoverage: { 
        min: minPublicationYear, 
        max: maxPublicationYear, 
        range: [maxPublicationYear - 50, maxPublicationYear],
        isActive: false
      },
      creatorName: '',
      czProjects: {
        options: ['Drylands Cluster'],
        value: null
      },
      contentType: {
        options: ['Dataset', 'Notebook/Code', 'Software'],
        value: []
      },
      repository: {
        options: ['HydroShare', 'EarthChem Library'],
        value: null
      }
    }

    protected get queryParams() {
      const queryParams: { [key:string]: any } = { 
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        term: this.searchQuery
      }

      // PUBLICATION YEAR
      if (this.filter.publicationYear.isActive) {
        queryParams.publishedStart = this.filter.publicationYear.range[0]
        queryParams.publishedEnd = this.filter.publicationYear.range[1]
      }

      // DATA COVERAGE
      if (this.filter.dataCoverage.isActive) {
        queryParams.dataCoverageStart = this.filter.dataCoverage.range[0]
        queryParams.dataCoverageEnd = this.filter.dataCoverage.range[1]
      }

      // CREATOR NAME
      if (this.filter.creatorName) {
        queryParams.creatorName = this.filter.creatorName.trim()
      }

      // REPOSITORY
      if (this.filter.repository.value) {
        queryParams.providerName = this.filter.repository.value
      }

      // CONTENT TYPE
      if (this.filter.contentType.value.length) {
        queryParams.contentType = this.filter.contentType.value
      }

      // SORT BY
      if (this.sort) {
        queryParams.sortBy = this.sort
      }

      return queryParams
    }

    created() {
      if (this.$route.query['q']) {
        this.searchQuery = this.$route.query['q'] as string
        this.onSearch()
      }
    }

    mounted () {
      const el = document.getElementById('sensor') as HTMLElement
      const elementWatcher = scrollMonitor.create(el)
      elementWatcher.enterViewport(() => {
        if (this.hasMore) {
          this.fetchMore()
        }
      }, false)
    }

    @Watch('sort')
    onSortChange() {
      this.onSearch()
    }

    protected async onSearch() {
      if (!this.searchQuery) {
        return
      }
      this.pageNumber = 1
      this.hasMore = true
      this.isSearching = true

      try {
        const query = this.$apollo.queries.filtering_cznet
        query.setVariables(this.queryParams)
        const result = await query.refetch()
        this.hasMore = result.data.filtering_cznet.length === this.pageSize
        console.log('refetch results: ')
        console.log(result)
      }
      catch(e) {
        console.log(e)
      }
      this.isSearching = false
    }

    protected async fetchMore() {
      this.pageNumber++
      this.isFetchingMore = true
      try{
        const result = await this.$apollo.queries.filtering_cznet.fetchMore({
          variables: this.queryParams,
          updateQuery: (existing, incoming) => {
            this.hasMore = incoming.fetchMoreResult.filtering_cznet.length === this.pageSize

            return {
              filtering_cznet: [
                ...existing.filtering_cznet,
                ...incoming.fetchMoreResult.filtering_cznet
              ]
            }
          },
        })
        console.log('fetchMore results: ')
        console.log(result)
      }
      catch(e) {
        console.log(e)
      }
      this.isFetchingMore = false
    }

    protected getResultAuthors(result) {
      return result.creator?.List.map(c => c.name).join(', ')
    }

    protected getResultCreationDate(result) {
      return new Date(result.dateCreated).toLocaleDateString('en-us', { 
        year:"numeric",
        month:"long",
        day:"numeric"
      })
    }

    protected getResultPublicationDate(result) {
      return new Date(result.datePublished).toLocaleDateString('en-us', { 
        year:"numeric",
        month:"long",
        day:"numeric"
      })
    }

    protected getResultKeywords(result) {
      return result.keywords.join(', ')
    }

    protected getResultFunding(result) {
      if (result.funding) {
        return result.funding.map(f => f.name || f.funder.name).join(', ')
      }

      return ''
    }

    /** @param path: the filter object to act on.
     *  @param index: 0 or 1 (min or max).
     *  @param value: the value to set.
     */
    protected onSliderChange(path: any, index: 0 | 1, value: number) {
      if (!path.isActive) {
        return
      }
      // Conditional to prevent change event triggers on focus change where the value has not changed.
      if (path.range[index] !== value) {
        this.$set(path.range, index, value)
        this.onSearch()
      }
    }

    // TODO: turn this method into a filter
    protected getResultFieldHighlightedHtml(result: Schemaorg, path: string) {
      const div = document.createElement("DIV")
      div.innerHTML = Array.isArray(result[path]) ? result[path].join(', ') : result[path]
      let content = div.textContent || div.innerText || ""

      let hits = result.highlights
        .filter((highlight) => highlight.path === path)
        .map(hit => hit.texts
          .filter(t => t.type === 'hit')
          .map(t => t.value)
        )
        .flat()

      hits = [...new Set(hits)]
      hits.map((hit) => {
        content = content.replaceAll(hit, `<mark>${hit}</mark>`)
      })

      return content
    }
  }
</script>

<style lang="scss" scoped>
  .sidebar {
    width: 16rem;
  }

  .results-content {
    min-width: 0; // https://stackoverflow.com/a/66689926/3288102
  }

  .results-container {
    p {
      word-break: break-word;
    }

    a {
      &:hover {
        text-decoration: underline !important;
      }
    }
  }

  .result-title {
  }
</style>
