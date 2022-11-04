<template>
  <v-container class="cd-search-results text-body-1">
    <div class="d-flex">
      <v-container class="sidebar">
        <div class="text-subtitle-2 mb-6">Filter by:</div>
        <!-- PUBLICATION YEAR -->
        <div class="mb-4">
          <v-checkbox
            v-model="filter.publicationYear.isActive"
            @change="onFilterChange"
            label="Publication year"
            dense
            hide-details
          />
          <v-range-slider
            v-model="filter.publicationYear.range"
            @change="onFilterChange"
            :disabled="!(filter.publicationYear.isActive)"
            :min="filter.publicationYear.min"
            :max="filter.publicationYear.max"
            class="mb-1"
            hide-details
          />
          <div class="d-flex gap-1">
            <v-text-field
              @change="$set(filter.publicationYear.range, 0, $event); onFilterChange()"
              :value="filter.publicationYear.range[0]"
              :disabled="!(filter.publicationYear.isActive)"
              type="number"
              small dense outlined hide-details 
            />
            <v-text-field
              @change="$set(filter.publicationYear.range, 1, $event); onFilterChange()"
              :value="filter.publicationYear.range[1]"
              :disabled="!(filter.publicationYear.isActive)"
              type="number"
              small dense outlined hide-details
            />
          </div>
        </div>

        <!-- DATA COVERAGE -->
        <div class="mb-6">
          <v-checkbox
            v-model="filter.dataCoverage.isActive"
            @change="onFilterChange"
            dense
            label="Data coverage"
            hide-details
          />
          <v-range-slider
            v-model="filter.dataCoverage.range"
            @change="onFilterChange"
            :disabled="!(filter.dataCoverage.isActive)"
            :min="filter.dataCoverage.min"
            :max="filter.dataCoverage.max"
            class="mb-1"
            hide-details
          />
          <div class="d-flex gap-1">
            <v-text-field
              @change="$set(filter.dataCoverage.range, 0, $event); onFilterChange()"
              :value="filter.dataCoverage.range[0]"
              :disabled="!(filter.dataCoverage.isActive)"
              type="number"
              small dense outlined hide-details 
            />
            <v-text-field
              @change="$set(filter.dataCoverage.range, 1, $event); onFilterChange()"
              :value="filter.dataCoverage.range[1]"
              :disabled="!(filter.dataCoverage.isActive)"
              type="number"
              small dense outlined hide-details
            />
          </div>
        </div>

        <v-text-field
          @change="$set(filter, 'creatorName', $event); onFilterChange()"
          :value="filter.creatorName"
          label="Author / Creator name"
          class="mb-6"
          hide-details
          clearable
          outlined
          dense
        />

        <v-select
          :items="filter.czProjects.options"
          v-model="filter.czProjects.value"
          class="mb-6"
          clearable
          outlined
          label="CZ project"
          hide-details
          dense
        />

        <v-select
          :items="filter.repository.options"
          v-model="filter.repository.value"
          @change="onFilterChange"
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
            hide-details
            dense
            :label="option"
            :value="option"
          />
        </div>
      </v-container>
      
      <v-container class="flex-grow-1">
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
              mandatory
            >
              <v-btn small @click="sort = 'date'">Date</v-btn>
              <v-btn small @click="sort = 'title'">Title</v-btn>
              <v-btn small @click="sort = 'author'">Author</v-btn>
              <v-btn small @click="sort = 'popular'">Most Popular</v-btn>
            </v-btn-toggle>
          </div>
        </div>
        <div class="results-container">
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
            <a class="text-body-1 text-decoration-none" :href="result.url" v-html="getResultFieldHighlightedHtml(result, 'name')"></a>
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
      </v-container>
    </div>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import CdSearch from '@/components/search/cd.search.vue'
  import gql from 'graphql-tag'

  const Search = require('@/graphql/Search.gql')
  const maxPublicationYear = (new Date()).getFullYear()
  const minPublicationYear = 1900

  @Component({
    name: 'cd-search-results',
    components: { CdSearch },
    apollo: {
      filtering_cznet: {
        query: gql`${Search}`,
        variables: { term: ' ', limit: 0 },
        // errorPolicy: 'ignore'
      },
    }
  })
  export default class CdSearchResults extends Vue {
    protected filtering_cznet = []
    protected searchQuery = ''
    protected isSearching = false
    protected sort: 'date' | 'title' | 'author' | 'popular' = 'date'
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
        options: ['Data', 'Notebook/Code', 'Software'],
        value: []
      },
      repository: {
        options: ['HydroShare', 'EarthChem Library'],
        value: null
      }
    }

    created() {
      if (this.$route.query['q']) {
        this.searchQuery = this.$route.query['q'] as string
        this.onSearch()
      }
    }

    protected onFilterChange(e) {
      this.onSearch()
    }

    protected async onSearch() {
      if (!this.searchQuery) {
        return
      }
      
      this.isSearching = true
      const queryParams: { [key:string]: any } = { 
        limit: 10,
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
      if (this.filter.repository) {
        queryParams.providerName = this.filter.repository
      }

      try {
        const query = this.$apollo.queries.filtering_cznet
        query.setVariables(queryParams)
        const result = await query.refetch()
        console.log(result.data.filtering_cznet)
      }
      catch(e) {
        console.log(e)
      }
      this.isSearching = false
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

  // TODO: pagination example
  // https://stackoverflow.com/questions/48305624/how-to-use-mongodb-aggregation-for-pagination
</script>

<style lang="scss" scoped>
  .sidebar {
    width: 30rem;
  }

  .results-container a {
    &:hover {
      text-decoration: underline !important;
    }
  }
</style>
