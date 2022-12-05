<template>
  <v-container class="cd-featured-datasets text-center py-12">
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
        v-slot="{ toggle }"
      >
        <v-card
          class="my-4 ml-14 text-left"
          outlined
          width="400"
          height="auto"
          @click="toggle"
          :ripple="false"
        >
          <template v-if="result">
            <div class="d-flex full-height card-wrapper">
              <div class="card-icon">
                <div class="page-icons">
                  <div class="page-icon elevation-1"></div>
                  <div class="page-icon elevation-1"></div>
                </div>
              </div>
              <div class="card-content">
                <v-card-text class="pb-0"><div>{{ getResultCreationDate(result) }}</div></v-card-text>
                <v-card-title :title="result.name" class="text-body-1 text-truncate d-block">{{ result.name }}</v-card-title>
                <v-card-text>
                  <div class="mb-4">
                    <v-chip v-for="(keyowrd, index) of result.keywords.slice(0,3)" :key="index"
                      class="ma-1"
                      small outlined
                    >{{ keyowrd }}</v-chip>
                  </div>
                  <div>
                    {{ getResultAuthors(result) }}
                  </div>
                </v-card-text>
              </div>
            </div>
          </template>
          <v-skeleton-loader
            v-else
            type="image"
          ></v-skeleton-loader>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { SEARCH_RESOLVER, SEARCH_QUERY  } from '@/constants'
  import CdHomeSearch from "@/components/home/cd.home-search.vue"
  import gql from 'graphql-tag'

  const Search = require(`@/graphql/${ SEARCH_QUERY }`)
  const numFeatured = 10

  @Component({
    name: 'cd-featured-datasets',
    components: { CdHomeSearch },
    apollo: {
      [SEARCH_RESOLVER]: {
        query: gql`${Search}`,
        variables: { term: ' ' },
        // errorPolicy: 'ignore'
      },
    }
  })
  export default class CdFeaturedDatasets extends Vue {
    public selected: number | null = null

    public get results() {
      return this[SEARCH_RESOLVER] || new Array(numFeatured).fill(null)
    }

    created() {
      this.getFeaturedDatasets()
    }

    public async getFeaturedDatasets() {
      try {
        const query = this.$apollo.queries[SEARCH_RESOLVER]
        query.setVariables({
          pageSize: numFeatured,
          pageNumber: 1,
          term: 'Groundwater temperature'
        })
        
        const result = await query.refetch()
        console.log(result)
      }
      catch(e) {
        console.log(e)
      }
    }

    public getResultAuthors(result) {
      return result.creator?.List.map(c => c.name).join(', ')
    }

    public getResultCreationDate(result) {
      return new Date(result.dateCreated).toLocaleDateString('en-us', { 
        year:"numeric",
        month:"long",
        day:"numeric"
      })
    }

    public getResultPublicationDate(result) {
      return new Date(result.datePublished).toLocaleDateString('en-us', { 
        year:"numeric",
        month:"long",
        day:"numeric"
      })
    }

    public getResultKeywords(result) {
      return result.keywords.join(', ')
    }

    public getResultFunding(result) {
      if (result.funding) {
        return result.funding.map(f => f.name || f.funder.name).join(', ')
      }

      return ''
    }
  }
</script>

<style lang="scss" scoped>
  .card-wrapper, .page-icons, .v-card, .card-icon {
    overflow: visible;
  }

  .card-icon {
    width: 2rem;
    display: block;
    flex-shrink: 0;
    background: #EFEFEF;
    position: relative;

    --dx: 50%;
    --m: 0.5;
    --h: calc(var(--m) * 11rem);
    --w: calc(var(--m) * 8.5rem);
    --dy: calc(50% - var(--h) / 2);

    .page-icons {
      position: absolute;
      right: -1.8rem;
      top: var(--dy);
      transition:  all 0.15s ease-in-out;
      
      .page-icon {
        width: var(--w);
        height: var(--h);
        background: #FFF;
        transition:  all 0.25s ease-in-out;
        border: 1px solid #EFEFEF;
      }

      .page-icon:nth-child(1) {
        transform: rotate(-1deg);
      }

      .page-icon:nth-child(2) {
        transform: rotate(1deg);
        translate: 1rem calc(var(--h) * -1.2);
      }
    }
  }

  ::v-deep .v-card:hover {
    .page-icons {
      transform: rotate(-15deg);
    }

    .page-icon:nth-child(1) {
      transform-origin: bottom center;
      transform: rotate(-18deg);
    }
  }

  .card-content {
    flex: 1 1 auto;
    width: 0;
    box-shadow: -4px 0px 15px -4px rgb(0 0 0 / 15%);
    z-index: 1;
    background: #FFF;
  }
</style>
