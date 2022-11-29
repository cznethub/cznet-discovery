<template>
  <v-container
    class="cd-search-results text-body-1"
    :class="{ 'is-small': $vuetify.breakpoint.smAndDown }"
  >
    <div class="d-sm-block d-md-flex">
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
            v-model="publicationYear"
            @change="onSliderControlChange('publicationYear')"
            :class="{ 'grayed-out': !filter.publicationYear.isActive }"
            :min="filter.publicationYear.min"
            :max="filter.publicationYear.max"
            class="mb-1"
            hide-details
          />
          <div
            class="d-flex gap-1"
            :class="{ 'grayed-out': !filter.publicationYear.isActive }"
          >
            <v-text-field
              @change="onSliderChange('publicationYear', 0, $event)"
              :value="publicationYear[0]"
              type="number"
              small
              dense
              outlined
              hide-details
            />
            <v-text-field
              @change="onSliderChange('publicationYear', 0, $event)"
              :value="publicationYear[1]"
              type="number"
              small
              dense
              outlined
              hide-details
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
            v-model="dataCoverage"
            @change="onSliderControlChange('dataCoverage')"
            :class="{ 'grayed-out': !filter.dataCoverage.isActive }"
            :min="filter.dataCoverage.min"
            :max="filter.dataCoverage.max"
            class="mb-1"
            hide-details
          />
          <div
            class="d-flex gap-1"
            :class="{ 'grayed-out': !filter.dataCoverage.isActive }"
          >
            <v-text-field
              @change="onSliderChange('dataCoverage', 0, $event)"
              :value="dataCoverage[0]"
              type="number"
              small
              dense
              outlined
              hide-details
            />
            <v-text-field
              @change="onSliderChange('dataCoverage', 1, $event)"
              :value="dataCoverage[1]"
              type="number"
              small
              dense
              outlined
              hide-details
            />
          </div>
        </div>

        <v-text-field
          @change="
            filter.creatorName = $event;
            onSearch();
          "
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
            v-model="filter.contentType.value"
            @change="onSearch"
            :key="index"
            :label="option"
            :value="option"
            hide-details
            dense
          />
        </div>

        <div class="text-center mt-8">
          <v-btn @click="clearFilters">Clear Filters</v-btn>
        </div>
      </v-container>

      <div class="results-content-wrapper">
        <v-container class="results-content">
          <cd-search v-model="searchQuery" @input="onSearch" />
          <div
            class="my-6 d-lg-flex flex-row justify-space-between gap-1 d-table"
          >
            <!-- <div class="d-table-row d-lg-flex align-center flex-row">
              <small class="d-table-cell text-right text-lg-left pr-2 py-2" style="white-space: nowrap">View mode:</small>
              <v-btn-toggle class="d-table-cell" v-model="view" dense mandatory>
                <v-btn small><v-icon small>mdi-view-list-outline</v-icon></v-btn>
                <v-btn small><v-icon small>mdi-map</v-icon></v-btn>
              </v-btn-toggle>
            </div> -->
            <div class="d-table-row d-lg-flex align-center flex-row">
              <small
                class="d-table-cell text-right text-lg-left pr-2"
                style="white-space: nowrap"
                >Sort results by:</small
              >
              <v-btn-toggle class="d-table-cell" v-model="sort" dense>
                <v-btn small value="dateCreated">Date</v-btn>
                <v-btn small value="name">Title</v-btn>
              </v-btn-toggle>
            </div>
          </div>
          <div class="results-container mb-12">
            <template v-if="isSearching">
              <!-- TODO: refactor into a component -->
              <div v-for="index in 4" :key="index" class="mb-16">
                <div class="d-flex">
                  <div class="flex-grow-1">
                    <v-skeleton-loader type="heading" />
                    <v-skeleton-loader
                      class="mt-2"
                      max-width="180"
                      type="text"
                    />
                    <v-skeleton-loader max-width="100" type="text" />
                  </div>
                  <v-skeleton-loader width="100" max-height="50" type="image" />
                </div>
                <v-skeleton-loader class="my-2" type="paragraph" />
                <div class="d-flex align-center my-2 gap-1">
                  <v-skeleton-loader width="90" type="text" />
                  <v-skeleton-loader width="90" type="text" />
                  <v-skeleton-loader width="90" type="text" />
                </div>
                <v-skeleton-loader type="button" />
              </div>
            </template>
            <template v-else>
              <div
                v-if="!results.length"
                class="text-body-2 text--secondary text-center mt-8"
              >
                <div class="mb-8">No results found.</div>
                <v-icon x-large>mdi-book-remove-multiple</v-icon>
              </div>
              <div
                v-for="result of results"
                class="mb-16 text-body-2"
                :key="result._id"
              >
                <a
                  class="result-title text-body-1 text-decoration-none"
                  :href="result.url"
                  v-html="getResultFieldHighlightedHtml(result, 'name')"
                ></a>
                <div
                  class="my-1"
                  v-html="getCreatorsHighlightedHtml(result)"
                ></div>
                <div class="my-1">{{ getResultCreationDate(result) }}</div>
                <div class="my-1" v-if="result.datePublished">
                  Publication Date: {{ getResultPublicationDate(result) }}
                </div>
                <p
                  class="mt-4"
                  v-html="getResultFieldHighlightedHtml(result, 'description')"
                ></p>

                <div class="d-flex gap-1 justify-space-between flex-wrap">
                  <div>
                    <a class="mb-4 d-block" :href="result.url">{{
                      result.url
                    }}</a>
                    <div class="mb-2">
                      <strong>Keywords: </strong
                      ><span
                        v-html="
                          getResultFieldHighlightedHtml(result, 'keywords')
                        "
                      ></span>
                    </div>
                    <div class="mb-2" v-if="result.funding">
                      <strong>Funded by: </strong>{{ getResultFunding(result) }}
                    </div>
                    <div class="mb-2" v-if="result.license.text">
                      <strong>License: </strong>{{ result.license.text }}
                    </div>
                  </div>

                  <!-- <div v-if="result.spatialCoverage" class="map-container" :id="`map-${ result._id}`">
                    <cd-spatial-coverage-map
                      :loader="loader"
                      :loader-options="options"
                    />
                  </div> -->
                </div>
              </div>
            </template>
          </div>
          <div
            v-if="results.length"
            v-intersect="{
              handler: onIntersect,
              options: { threshold: [0, 0.5, 1.0] },
            }"
          ></div>
          <div
            v-if="isFetchingMore"
            class="text-subtitle-2 text--secondary text-center"
          >
            Loading more results...
          </div>
          <div
            v-if="results.length && !hasMore"
            class="text-subtitle-2 text--secondary text-center"
          >
            End of results.
          </div>
        </v-container>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { SEARCH_RESOLVER, SEARCH_QUERY, MIN_YEAR, MAX_YEAR } from "@/constants";
import { sameRouteNavigationErrorHandler } from "@/constants";
import { Loader, LoaderOptions } from "google-maps";
import CdSpatialCoverageMap from "@/components/search-results/cd.spatial-coverage-map.vue";
import CdSearch from "@/components/search/cd.search.vue";
import SearchResults from "@/models/search-results.model";
import gql from "graphql-tag";
import SearchHistory from "@/models/search-history.model";

const options: LoaderOptions = { libraries: ["drawing"] };
const loader: Loader = new Loader(
  process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
  options
);
const Search = require(`@/graphql/${SEARCH_QUERY}`);

@Component({
  name: "cd-search-results",
  components: { CdSearch, CdSpatialCoverageMap },
  apollo: {
    [SEARCH_RESOLVER]: {
      query: gql`
        ${Search}
      `,
      variables: { term: " " },
      // errorPolicy: 'ignore'
    },
  },
})
export default class CdSearchResults extends Vue {
  protected loader = loader;
  protected options = options;
  protected isIntersecting = false;
  protected searchQuery = "";
  protected pageNumber = 1;
  protected pageSize = 15;
  protected hasMore = true;
  protected isSearching = false;
  protected isFetchingMore = false;
  protected sort: "name" | "dateCreated" | null = null;
  // protected view: 'list' | 'map' = 'list'
  protected filter: ISearchFilter = {
    publicationYear: {
      min: MIN_YEAR,
      max: MAX_YEAR,
      isActive: false,
    },
    dataCoverage: {
      min: MIN_YEAR,
      max: MAX_YEAR,
      isActive: false,
    },
    // czProjects: {
    //   options: ['Drylands Cluster'],
    //   value: null
    // },
    contentType: {
      options: ["Dataset", "Notebook/Code", "Software"],
      value: [],
    },
    repository: {
      options: ["HydroShare", "EarthChem Library"],
      value: "",
    },
    creatorName: "",
  };

  protected get publicationYear() {
    return SearchResults.$state.publicationYear;
  }

  protected set publicationYear(range: [number, number]) {
    // TODO: validate input
    SearchResults.commit((state) => {
      state.publicationYear = range;
    });
  }

  protected get dataCoverage() {
    return SearchResults.$state.dataCoverage;
  }

  protected set dataCoverage(range: [number, number]) {
    // TODO: validate input
    SearchResults.commit((state) => {
      state.dataCoverage = range;
    });
  }

  protected get results() {
    return this[SEARCH_RESOLVER] || [];
  }

  /** Typeahead query parameters */
  protected get typeaheadParams() {
    const queryParams: { [key: string]: any } = {
      pageSize: this.pageSize,
      term: this.searchQuery,
    };

    // PUBLICATION YEAR
    if (this.filter.publicationYear.isActive) {
      this.$set(queryParams, "publishedStart", this.dataCoverage[0]);
      this.$set(queryParams, "publishedEnd", this.dataCoverage[1]);
    }

    // DATA COVERAGE
    if (this.filter.dataCoverage.isActive) {
      this.$set(queryParams, "dataCoverageStart", this.dataCoverage[0]);
      this.$set(queryParams, "dataCoverageEnd", this.dataCoverage[1]);
    }

    // CREATOR NAME
    if (this.filter.creatorName) {
      queryParams.creatorName = this.filter.creatorName;
    }

    // REPOSITORY
    if (this.filter.repository.value) {
      queryParams.providerName = this.filter.repository.value;
    }

    // CONTENT TYPE
    if (this.filter.contentType.value.length) {
      queryParams.contentType = this.filter.contentType.value;
    }

    return queryParams;
  }

  /** GraphQL query parameters */
  protected get queryParams() {
    const queryParams: { [key: string]: any } = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      term: this.searchQuery,
    };

    // PUBLICATION YEAR
    if (this.filter.publicationYear.isActive) {
      this.$set(queryParams, "publishedStart", this.dataCoverage[0]);
      this.$set(queryParams, "publishedEnd", this.dataCoverage[1]);
    }

    // DATA COVERAGE
    if (this.filter.dataCoverage.isActive) {
      this.$set(queryParams, "dataCoverageStart", this.dataCoverage[0]);
      this.$set(queryParams, "dataCoverageEnd", this.dataCoverage[1]);
    }

    // CREATOR NAME
    if (this.filter.creatorName) {
      queryParams.creatorName = this.filter.creatorName;
    }

    // REPOSITORY
    if (this.filter.repository.value) {
      queryParams.providerName = this.filter.repository.value;
    }

    // CONTENT TYPE
    if (this.filter.contentType.value.length) {
      queryParams.contentType = this.filter.contentType.value;
    }

    // SORT BY
    if (this.sort) {
      queryParams.sortBy = this.sort;
    }

    return queryParams;
  }

  /** Route query parameters with short keys. These are parameters needed to replicate a search. */
  protected get routeParams() {
    return {
      q: this.searchQuery,
      cn: this.filter.creatorName || undefined,
      r: this.filter.repository.value || undefined,
      py: this.filter.publicationYear.isActive
        ? this.publicationYear.map((n) => n.toString()) || undefined
        : undefined,
      dc: this.filter.dataCoverage.isActive
        ? this.dataCoverage.map((n) => n.toString()) || undefined
        : undefined,
      ct: this.filter.contentType.value || undefined,
      s: this.sort || undefined,
    };
  }

  created() {
    this._loadRouteParams();
    if (this.$route.query["q"]) {
      this.onSearch();
    }
  }

  protected onIntersect(entries, observer) {
    this.isIntersecting = entries[0].intersectionRatio >= 0.5;
    if (
      this.isIntersecting &&
      this.results.length &&
      this.hasMore &&
      !this.isSearching &&
      !this.isFetchingMore
    ) {
      this.fetchMore();
    }
  }

  @Watch("sort")
  protected onSortChange() {
    this.onSearch();
  }

  protected async onSearch() {
    if (!this.searchQuery) {
      return;
    }
    this.hasMore = true;
    this.isSearching = true;

    try {
      const query = this.$apollo.queries[SEARCH_RESOLVER];

      // set query parameters
      query.setVariables(this.queryParams);

      // set the parameters on the route
      this.$router
        .push({
          name: "search",
          query: this.routeParams,
        })
        .catch(sameRouteNavigationErrorHandler);

      SearchHistory.log(this.queryParams.term);
      const result = await query.refetch();
      this.hasMore = result.data?.[SEARCH_RESOLVER].length === this.pageSize;
      // console.log('refetch results: ')
      // console.log(result.data[SEARCH_RESOLVER].map(r => r.highlights))
    } catch (e) {
      console.log(e);
    }
    this.isSearching = false;
  }

  /** Gets the next page of results and appends them to the current results list. */
  protected async fetchMore() {
    this.pageNumber++;
    this.isFetchingMore = true;
    try {
      const result = await this.$apollo.queries[SEARCH_RESOLVER].fetchMore({
        variables: this.queryParams,
        updateQuery: (existing, incoming) => {
          this.hasMore =
            incoming.fetchMoreResult[SEARCH_RESOLVER].length === this.pageSize;
          return {
            [SEARCH_RESOLVER]: [
              ...(existing[SEARCH_RESOLVER] || []),
              ...incoming.fetchMoreResult[SEARCH_RESOLVER],
            ],
          };
        },
      });
      // console.log('fetchMore results: ')
      // console.log(result)
    } catch (e) {
      console.log(e);
    }
    this.isFetchingMore = false;
  }

  protected getResultAuthors(result) {
    return result.creator?.List.map((c) => c.name).join(", ");
  }

  protected getResultCreationDate(result) {
    return new Date(result.dateCreated).toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  protected getResultPublicationDate(result) {
    return new Date(result.datePublished).toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  protected getResultKeywords(result) {
    return result.keywords.join(", ");
  }

  protected getResultFunding(result) {
    if (result.funding) {
      return result.funding.map((f) => f.name || f.funder.name).join(", ");
    }

    return "";
  }

  /** @param path: the filter object to act on.
   *  @param index: 0 or 1 (min or max).
   *  @param value: the value to set.
   */
  protected onSliderChange(path: string, index: 0 | 1, value: number) {
    // Conditional to prevent change event triggers on focus change where the value has not changed.
    if (this[path][index] !== value) {
      this.$set(this.filter[path], "isActive", true);
      this.$set(this[path], index, value);
      this.onSearch();
    }
  }

  protected onSliderControlChange(path: any) {
    this.$set(this.filter[path], "isActive", true);
    this.onSearch();
  }

  protected getCreatorsHighlightedHtml(result: Cznet) {
    if (!result.creator) {
      return "";
    }
    const div = document.createElement("DIV");
    div.innerHTML = result.creator.List.map((c) => c.name).join(", ");

    let content = div.textContent || div.innerText || "";

    if (result.highlights) {
      let hits = result.highlights
        .filter((highlight) => highlight.path === "creator.@list.name")
        .map((hit) =>
          hit.texts.filter((t) => t.type === "hit").map((t) => t.value)
        )
        .flat();

      hits = [...new Set(hits)];
      hits.map((hit) => {
        content = content.replaceAll(hit, `<mark>${hit}</mark>`);
      });
    }

    return content;
  }

  // TODO: turn this method into a filter
  /** Applies highlights to a string or string[] field and returns the new content as HTML */
  protected getResultFieldHighlightedHtml(result: Cznet, path: string) {
    const div = document.createElement("DIV");
    div.innerHTML = Array.isArray(result[path])
      ? result[path].join(", ")
      : result[path];
    let content = div.textContent || div.innerText || "";

    if (result.highlights) {
      let hits = result.highlights
        .filter((highlight) => highlight.path === path)
        .map((hit) =>
          hit.texts.filter((t) => t.type === "hit").map((t) => t.value)
        )
        .flat();

      hits = [...new Set(hits)];
      hits.map((hit) => {
        content = content.replaceAll(hit, `<mark>${hit}</mark>`);
      });
    }

    return content;
  }

  protected clearFilters() {
    this.filter.publicationYear.isActive = false;
    this.filter.dataCoverage.isActive = false;
    this.filter.contentType.value = [];
    this.filter.repository.value = "";
    this.filter.creatorName = "";
    this.onSearch();
  }

  /** Load route query parameters into component values. */
  private _loadRouteParams() {
    // SEARCH QUERY
    this.searchQuery = this.$route.query["q"] as string;
    // CREATOR NAME
    this.filter.creatorName = (this.$route.query["cn"] as string) || "";
    // REPOSITORY
    this.filter.repository.value = (this.$route.query["r"] as string) || "";
    // CONTENT TYPE
    this.filter.contentType.value = (this.$route.query["ct"] as string[]) || [];

    // PUBLICATION YEAR
    if (this.$route.query["py"]) {
      this.filter.publicationYear.isActive = true;
      this.publicationYear =
        ((this.$route.query["py"] as [string, string])?.map((n) => +n) as [
          number,
          number
        ]) || this.publicationYear;
    }
    // DATA COVERAGE
    if (this.$route.query["dc"]) {
      this.filter.dataCoverage.isActive = true;
      this.dataCoverage =
        ((this.$route.query["dc"] as [string, string])?.map((n) => +n) as [
          number,
          number
        ]) || this.dataCoverage;
    }
    // SORT
    if (this.$route.query["s"]) {
      this.sort =
        (this.$route.query["s"] as "name" | "dateCreated") || this.sort;
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 20rem;
}

.cd-search-results.is-small {
  .sidebar {
    width: 100%;
  }
}

.results-content-wrapper {
  flex: 1 1 auto;
}

.results-content {
  min-width: 0; // https://stackoverflow.com/a/66689926/3288102
  max-width: 70rem;
  margin: unset;
}

.results-container {
  * {
    word-break: break-word;
  }

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline !important;
    }
  }
}

.grayed-out {
  opacity: 0.55;
}
</style>
