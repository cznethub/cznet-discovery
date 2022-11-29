<template>
  <div class="cd-home">
    <cd-home-search />
    <v-container class="text-center py-12">
      <div class="display-1 my-4">Featured Data and Research Products</div>
      <div class="text--secondary text-body-2 my-4 d-inline-block" style="max-width: 35rem;">
        Click on the links below to view and access CZNet's latest featured data and other research products  
      </div>
      <v-slide-group
        v-model="selected"
        center-active
        class="pa-4"
        show-arrows
      >
        <v-slide-item
          v-for="result, index in results"
          :key="index"
          v-slot="{ active, toggle }"
        >
          <v-card
            :color="active ? 'primary lighten-4' : 'grey lighten-4'"
            class="ma-4 text-left"
            width="400"
            height="auto"
            @click="toggle"
          >
            <template v-if="result">
              <v-card-text class="pb-0"><div>{{ getResultCreationDate(result) }}</div></v-card-text>
              <v-card-title class="text-body-1">{{ result.name }}</v-card-title>
              <v-card-text>{{ getResultAuthors(result) }}</v-card-text>
            </template>
            <v-skeleton-loader
              v-else
              type="image"
            ></v-skeleton-loader>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-container>

    <v-divider></v-divider>

    <v-container class="text-center py-12">
      <div class="display-1 mt-4">Contribute Data or Research Products</div>
      <div class="text--secondary text-body-2 mt-2 mb-4 d-inline-block" style="max-width: 35rem;">
        This Data Discovery Portal provides tools for discovering and accessing data related to the Critical Zone Collaborative network and the Earth's Critical Zone  
      </div>
      <br>

      <div class="text-subtitle-2 mt-4 d-inline-block" style="max-width: 30rem;">If you have data or other research products that you want to contribute, visit the CZNet Data Submission Portal</div>
      <br>

      <v-btn href="https://dsp.criticalzone.org" class="my-4" small color="primary">Contribute Data</v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { SEARCH_RESOLVER, SEARCH_QUERY  } from '@/constants'
  import CdHomeSearch from "@/components/home/cd.home-search.vue"
  const Search = require(`@/graphql/${ SEARCH_QUERY }`)
  import gql from 'graphql-tag'

  const numFeatured = 10

  @Component({
    name: 'cd-home',
    components: { CdHomeSearch },
    apollo: {
      [SEARCH_RESOLVER]: {
        query: gql`${Search}`,
        variables: { term: ' ' },
        // errorPolicy: 'ignore'
      },
    }
  })
  export default class CdHome extends Vue {
    protected selected: number | null = null

    protected get results() {
      return this[SEARCH_RESOLVER] || new Array(numFeatured).fill(null)
    }

    created() {
      this.getFeaturedDatasets()
    }

    protected async getFeaturedDatasets() {
      try {
        const query = this.$apollo.queries[SEARCH_RESOLVER]
        query.setVariables({
          pageSize: numFeatured,
          pageNumber: 1,
          term: 'Groundwater temperature'
        })
        
        const result = await query.refetch()
      }
      catch(e) {
        console.log(e)
      }
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
  }
</script>

<style lang="scss" scoped>
  
</style>
