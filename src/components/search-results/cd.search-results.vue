<template>
  <v-container class="cd-search-results text-body-1">
    <div class="d-flex">
      <v-container class="sidebar">
        <div class="text-subtitle-2 mb-6">Filter by:</div>
        <div class="mb-6">
          <v-checkbox
            v-model="filter.publicationYear.isActive"
            label="Publication year"
            dense
            hide-details
          />
          <v-range-slider
            v-model="filter.publicationYear.range"
            :disabled="!(filter.publicationYear.isActive)"
            :min="filter.publicationYear.min"
            :max="filter.publicationYear.max"
            class="mb-1"
            hide-details
          />
          <div class="d-flex gap-1">
            <v-text-field
              :disabled="!(filter.publicationYear.isActive)"
              type="number" v-model="filter.publicationYear.range[0]"
              small dense outlined hide-details 
            />
            <v-text-field :disabled="!(filter.publicationYear.isActive)"
              type="number"
              v-model="filter.publicationYear.range[1]"
              small dense outlined hide-details
            />
          </div>
        </div>

        <div class="mb-6">
          <v-checkbox
            v-model="filter.dataCoverage.isActive"
            dense
            label="Data coverage"
            hide-details
          />
          <v-range-slider
            v-model="filter.dataCoverage.range"
            :disabled="!(filter.dataCoverage.isActive)"
            :min="filter.dataCoverage.min"
            :max="filter.dataCoverage.max"
            class="mb-1"
            hide-details
          />
          <div class="d-flex gap-1">
            <v-text-field
              :disabled="!(filter.dataCoverage.isActive)"
              type="number" v-model="filter.dataCoverage.range[0]"
              small dense outlined hide-details 
            />
            <v-text-field :disabled="!(filter.dataCoverage.isActive)"
              type="number"
              v-model="filter.dataCoverage.range[1]"
              small dense outlined hide-details
            />
          </div>
        </div>

        <v-text-field
          label="Author / Creator name:"
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
          class="mb-6"
          clearable
          outlined
          label="Repository"
          hide-details
          dense
        />

        <div>
          <div class="text-body-2">Content type:</div>
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
          <div class="d-table-row d-lg-flex align-center flex-row">
            <small class="d-table-cell text-right text-lg-left pr-2 py-2" style="white-space: nowrap">View mode:</small>
            <v-btn-toggle class="d-table-cell" v-model="view" dense mandatory>
              <v-btn small><v-icon small>mdi-view-list-outline</v-icon></v-btn>
              <v-btn small><v-icon small>mdi-map</v-icon></v-btn>
            </v-btn-toggle>
          </div>
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
          <div v-for="result of fuzzy_search" class="mb-12 text-body-2" :key="result._id">
            <a class="text-body-1" :href="result.url">{{ result.name }}</a>
            <div class="my-1">{{ getResultAuthors(result) }}</div>
            <div class="my-1">{{ getResultCreationDate(result) }}</div>
            <p class="mt-4">{{ result.description }}</p>
            <a class="mb-4 d-block" :href="result.url">{{ result.url }}</a>
            <div class="mb-2"><strong>Keywords: </strong>{{ getResultKeywords(result) }}</div>
            <div class="mb-2" v-if="result.funding"><strong>Funded by: </strong>{{ getResultFunding(result) }}</div>
            <div class="mb-2"><strong>License: </strong>{{ result.license.text }}</div>
          </div>
        </div>
      </v-container>
    </div>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import CdSearch from '@/components/search/cd.search.vue'
  import gql from 'graphql-tag'

  const Search = require('@/graphql/Search.gql')
  const maxPublicationYear = (new Date()).getFullYear()
  const minPublicationYear = 1900

  @Component({
    name: 'cd-search-results',
    components: { CdSearch },
    apollo: {
      fuzzy_search: {
        query: gql`${Search}`,
        variables: { term: ' ', limit: 0 }
      },
    }
  })
  export default class CdSearchResults extends Vue {
    protected fuzzy_search = []
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
      czProjects: {
        options: ['Drylands Cluster'],
        value: null
      },
      contentType: {
        options: ['Data', 'Notebook/Code', 'Software'],
        value: []
      },
      repository: {
        options: ['HydroShare', 'EarthChem', 'Zenodo'],
        value: null
      }
    }

    created() {
      if (this.$route.query['q']) {
        this.searchQuery = this.$route.query['q'] as string
        this.onSearch(this.searchQuery)
      }
    }

    protected async onSearch(searchQuery: string) {
      this.isSearching = true
      try {
        const query = this.$apollo.queries.fuzzy_search
        const result = await query.refetch({ limit: 10, term: searchQuery })
        this.isSearching = false
        console.log(result.data.fuzzy_search)
      }
      catch(e) {
        console.log(e)
        this.isSearching = false
      }
    }

    protected getResultAuthors(result) {
      return result.creator.List.map(c => c.name).join(', ')
    }

    protected getResultCreationDate(result) {
      return new Date(result.dateCreated).toLocaleDateString('en-us', { 
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
  }
</script>

<style lang="scss" scoped>
  .sidebar {
    width: 30rem;
  }

  .results-container a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
