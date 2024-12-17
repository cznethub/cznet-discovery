<template>
  <v-container
    class="cd-search-results text-body-1"
    :class="{ 'is-small': $vuetify.display.smAndDown }"
  >
    <div class="d-sm-block d-md-flex">
      <v-container class="sidebar flex-shrink-0">
        <div class="sidebar--content">
          <div class="text-subtitle-2 mb-6">Filter by:</div>
          <!-- CREATION DATE -->
          <cd-range-input
            v-model="creationDate"
            v-model:isActive="filter.creationDate.isActive"
            @update:is-active="pushSearchRoute"
            @end="onSliderControlChange(filter.creationDate)"
            :min="filter.creationDate.min"
            :max="filter.creationDate.max"
            label="Date Created"
          />

          <!-- PUBLICATION YEAR -->
          <cd-range-input
            v-model="publicationYear"
            v-model:isActive="filter.publicationYear.isActive"
            @update:is-active="pushSearchRoute"
            @end="onSliderControlChange(filter.publicationYear)"
            :min="filter.publicationYear.min"
            :max="filter.publicationYear.max"
            label="Publication year"
          />

          <!-- DATA COVERAGE -->
          <cd-range-input
            v-model="dataCoverage"
            v-model:isActive="filter.dataCoverage.isActive"
            @update:is-active="pushSearchRoute"
            @end="onSliderControlChange(filter.dataCoverage)"
            :min="filter.dataCoverage.min"
            :max="filter.dataCoverage.max"
            label="Data temporal coverage"
          />

          <!-- CREATOR NAME -->
          <v-text-field
            @blur="pushSearchRoute"
            @keyup.enter="pushSearchRoute"
            @click:clear="pushSearchRoute"
            v-model="filter.creatorName"
            label="Author / Creator name"
            class="mb-6"
            hide-details
            clearable
            variant="outlined"
            density="compact"
          />

          <v-select
            :items="clusters"
            v-model="filter.project.value"
            @update:model-value="pushSearchRoute"
            class="mb-6"
            clearable
            variant="outlined"
            density="compact"
            hide-details
            multiple
            :label="$t('searchResults.filters.projectLabel')"
          />

          <!-- REPOSITORY -->
          <v-select
            :items="filter.repository.options"
            v-model="filter.repository.value"
            @update:model-value="pushSearchRoute"
            class="mb-6"
            clearable
            variant="outlined"
            density="compact"
            label="Repository"
            hide-details
          />

          <!-- <div>
          <div class="text-body-2">Content type</div>
          <v-checkbox
            v-for="(option, index) of filter.contentType.options"
            v-model="filter.contentType.value"
            @update:model-value="onSearch"
            :key="index"
            :label="option"
            :value="option"
            hide-details
            density="compact"
          />
        </div> -->

          <div class="text-center mt-8">
            <v-btn @click="clearFilters" :disabled="!isSomeFilterActive"
              >Clear Filters</v-btn
            >
          </div>
        </div>
      </v-container>

      <div class="results-content-wrapper">
        <v-container class="results-content">
          <cd-search
            v-model="searchQuery"
            @update:model-value="pushSearchRoute"
            @clear="
              searchQuery = '';
              pushSearchRoute();
            "
            :inputAttrs="{ variant: 'outlined' }"
          />
          <div
            class="my-6 d-lg-flex flex-row justify-space-between gap-1 d-table"
          >
            <div
              class="d-table-row d-lg-flex align-center flex-md-row flex-column"
            >
              <p class="mr-2">Sort results by:</p>
              <v-btn-toggle
                v-if="searchQuery"
                v-model="sort"
                density="compact"
                divided
                variant="outlined"
                mandatory
              >
                <v-btn
                  v-for="option of sortOptions"
                  :key="option.value"
                  size="small"
                  @click="
                    $nextTick(() => {
                      pushSearchRoute();
                    })
                  "
                  :value="option.value"
                  >{{ option.label }}</v-btn
                >
              </v-btn-toggle>
              <v-btn-toggle
                v-else
                v-model="sortEmpty"
                density="compact"
                divided
                variant="outlined"
                mandatory
              >
                <v-btn
                  v-for="option of sortOptions"
                  :key="option.value"
                  size="small"
                  @click="
                    $nextTick(() => {
                      pushSearchRoute();
                    })
                  "
                  :value="option.value"
                  >{{ option.label }}</v-btn
                >
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
              <div v-if="!results.length" class="text-body-2 text-center mt-8">
                <v-empty-state
                  text="No results found."
                  icon="mdi-text-box-remove"
                />
              </div>
              <div
                v-if="searchResultsMetadata?.count?.total"
                class="text-body-1 text-medium-emphasis mb-4"
              >
                {{ searchResultsMetadata?.count?.total || "" }} result{{
                  searchResultsMetadata?.count?.total != 1 ? "s" : ""
                }}
              </div>
              <div
                v-for="result of results"
                class="mb-16 text-body-2"
                :key="result.id"
              >
                <a
                  class="result-title text-h6 text-decoration-none"
                  :href="result.url"
                  target="_blank"
                  v-html="highlight(result, 'name')"
                ></a>
                <div class="my-1" v-html="highlightCreators(result)"></div>
                <div class="my-1" v-if="result.dateCreated">
                  Date Created: {{ formatDate(result.dateCreated) }}
                </div>
                <div class="my-1" v-if="result.datePublished">
                  Publication Date: {{ formatDate(result.datePublished) }}
                </div>
                <p
                  class="mt-4 mb-1"
                  :class="{ 'snip-3': !result._showMore }"
                  v-html="highlight(result, 'description')"
                ></p>

                <v-btn
                  size="x-small"
                  variant="text"
                  color="primary"
                  @click="result._showMore = !result._showMore"
                  >Show {{ result._showMore ? "less" : "more" }}...</v-btn
                >

                <div
                  class="d-flex gap-1 justify-space-between flex-wrap flex-lg-nowrap mt-2"
                >
                  <div>
                    <a
                      class="mb-2 d-block"
                      :href="result.url"
                      target="_blank"
                      >{{ result.url }}</a
                    >
                    <div class="mb-2">
                      <strong>Keywords: </strong
                      ><span v-html="highlight(result, 'keywords')"></span>
                    </div>
                    <div class="mb-2" v-if="result.funding.length">
                      <strong>Funded by: </strong
                      >{{ result.funding.join(", ") }}
                    </div>
                    <div class="mb-2" v-if="result.license">
                      <strong>License: </strong>{{ result.license }}
                    </div>
                  </div>

                  <div
                    v-if="hasSpatialFeatures(result)"
                    :id="`map-${result.id}`"
                  >
                    <cd-spatial-coverage-map
                      :loader="loader"
                      :loader-options="options"
                      :features="result.spatialCoverage"
                    />
                  </div>
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
          <div v-if="isFetchingMore" class="text-subtitle-2 text-center">
            Loading more results...
          </div>
          <div
            v-if="results.length && !hasMore"
            class="text-subtitle-2 text-center"
          >
            End of results.
          </div>
        </v-container>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";
import { MIN_YEAR, MAX_YEAR } from "@/constants";
import { sameRouteNavigationErrorHandler } from "@/constants";
import { Loader, LoaderOptions } from "google-maps";
import { formatDate } from "@/util";
import CdSpatialCoverageMap from "@/components/search-results/cd.spatial-coverage-map.vue";
import CdSearch from "@/components/search/cd.search.vue";
import SearchResults from "@/models/search-results.model";
import SearchHistory from "@/models/search-history.model";
import Search from "@/models/search.model";
import { Notifications } from "@cznethub/cznet-vue-core";
import {
  ISearchFilter,
  ISearchParams,
  IResult,
  ISearchResultsMetadata,
} from "@/types";
import CdRangeInput from "./cd.range-input.vue";
import { useRoute, useRouter } from "vue-router";

const options: LoaderOptions = { libraries: ["drawing"] };
const loader: Loader = new Loader(
  import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
  options,
);

const sortOptions: { label: string; value: string }[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Date Created", value: "dateCreated" },
  { label: "Title", value: "name" },
];

@Component({
  name: "cd-search-results",
  components: { CdSearch, CdSpatialCoverageMap, CdRangeInput },
})
class CdSearchResults extends Vue {
  loader = loader;
  options = options;
  isIntersecting = false;
  searchQuery = "";
  pageNumber = 1;
  pageSize = 15;
  hasMore = true;
  isSearching = false;
  isFetchingMore = false;
  sort: "name" | "dateCreated" | "relevance" = "relevance";
  sortEmpty = "dateCreated";
  // public view: 'list' | 'map' = 'list'
  filter: ISearchFilter = {
    publicationYear: {
      min: MIN_YEAR,
      max: MAX_YEAR,
      isActive: false,
    },
    creationDate: {
      min: MIN_YEAR,
      max: MAX_YEAR,
      isActive: false,
    },
    dataCoverage: {
      min: MIN_YEAR,
      max: MAX_YEAR,
      isActive: false,
    },
    project: {
      // Options are loaded via api during app `created` hook.
      value: [],
    },
    // contentType: {
    //   options: ["Dataset", "Notebook/Code", "Software"],
    //   value: [],
    // },
    repository: {
      options: ["HydroShare", "EarthChem Library", "Zenodo", "Other"],
      value: null,
    },
    creatorName: "",
  };
  formatDate = formatDate;
  route = useRoute();
  router = useRouter();

  get sortOptions(): { label: string; value: string }[] {
    return this.searchQuery
      ? sortOptions
      : sortOptions.slice(1, sortOptions.length);
  }

  get searchResultsMetadata(): ISearchResultsMetadata | undefined {
    return Search.$state.results.metadata;
  }

  public get creationDate() {
    return SearchResults.$state.creationDate;
  }

  public set creationDate(range: [number, number]) {
    // TODO: validate input
    SearchResults.commit((state) => {
      state.creationDate = range;
    });
  }

  public get publicationYear() {
    return SearchResults.$state.publicationYear;
  }

  public set publicationYear(range: [number, number]) {
    // TODO: validate input
    SearchResults.commit((state) => {
      state.publicationYear = range;
    });
  }

  public get dataCoverage() {
    return SearchResults.$state.dataCoverage;
  }

  public set dataCoverage(range: [number, number]) {
    // TODO: validate input
    SearchResults.commit((state) => {
      state.dataCoverage = range;
    });
  }

  public get results(): IResult[] {
    return Search.$state.results.docs;
  }

  public get clusters() {
    return Search.$state.clusters;
  }

  public get isSomeFilterActive() {
    return (
      this.filter.creationDate.isActive ||
      this.filter.publicationYear.isActive ||
      this.filter.dataCoverage.isActive ||
      // this.filter.contentType.value.length ||
      this.filter.repository.value ||
      this.filter.project.value ||
      this.filter.creatorName
    );
  }

  /** Search query parameters */
  get queryParams(): ISearchParams {
    const queryParams: ISearchParams = {
      term: this.searchQuery,
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
    };

    // CREATION DATE
    if (this.filter.creationDate.isActive) {
      queryParams.creationDateStart = this.creationDate[0];
      queryParams.creationDateEnd = this.creationDate[1];
    }

    // PUBLICATION YEAR
    if (this.filter.publicationYear.isActive) {
      queryParams.publishedStart = this.publicationYear[0];
      queryParams.publishedEnd = this.publicationYear[1];
    }

    // DATA COVERAGE
    if (this.filter.dataCoverage.isActive) {
      queryParams.dataCoverageStart = this.dataCoverage[0];
      queryParams.dataCoverageEnd = this.dataCoverage[1];
    }

    // CREATOR NAME
    if (this.filter.creatorName) {
      queryParams.creatorName = this.filter.creatorName;
    }

    // REPOSITORY
    if (this.filter.repository.value) {
      queryParams.providerName = this.filter.repository.value;
    }

    // PROJECT
    if (this.filter.project.value?.length) {
      queryParams.clusters = this.filter.project.value;
    }

    // CONTENT TYPE
    // if (this.filter.contentType.value?.length) {
    //   queryParams.contentType = this.filter.contentType.value;
    // }

    // SORT BY
    if (this.searchQuery && this.sort) {
      queryParams.sortBy = this.sort;
    } else if (this.sortEmpty) {
      // @ts-ignore
      queryParams.sortBy = this.sortEmpty;
    }

    return queryParams;
  }

  /** Route query parameters with short keys. These are parameters needed to replicate a search. */
  public get routeParams() {
    return {
      q: this.searchQuery,
      cn: this.filter.creatorName || undefined,
      r: this.filter.repository.value || undefined,
      cd: this.filter.creationDate.isActive
        ? this.creationDate.map((n) => n.toString()) || undefined
        : undefined,
      py: this.filter.publicationYear.isActive
        ? this.publicationYear.map((n) => n.toString()) || undefined
        : undefined,
      dc: this.filter.dataCoverage.isActive
        ? this.dataCoverage.map((n) => n.toString()) || undefined
        : undefined,
      // ct: this.filter.contentType.value || undefined,
      p: this.filter.project.value || undefined,
      s: (this.searchQuery ? this.sort : this.sortEmpty) || undefined,
    };
  }

  created() {
    this._loadRouteParams();
    this._onSearch();
  }

  public onIntersect(_isIntersecting: boolean, entries: any[], _observer: any) {
    this.isIntersecting = entries[0]?.intersectionRatio >= 0.5;
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

  /** Pushes the desired search to the router, which will reload the route with the new query parameters */
  pushSearchRoute() {
    try {
      if (this.queryParams.term) {
        SearchHistory.log(this.queryParams.term);
      }

      // Note: this will reload the component because the router-view in the App component has `:key="route.fullPath"`
      this.router
        .push({
          name: "search",
          query: this.routeParams,
        })
        .catch(sameRouteNavigationErrorHandler);
    } catch (e) {
      console.log(e);
      Search.commit((state) => {
        state.results = [];
      });
      Notifications.toast({
        message: `Failed to perform search`,
        type: "error",
      });
    }
  }

  async _onSearch() {
    this.hasMore = true;
    this.isSearching = true;
    this.pageNumber = 1;

    this.hasMore = await Search.search(this.queryParams);
    this.isSearching = false;
  }

  /** Get the next page of results. */
  public async fetchMore() {
    this.pageNumber++;
    this.isFetchingMore = true;
    try {
      this.hasMore = await Search.fetchMore(this.queryParams);
    } catch (e) {
      console.log(e);
    }
    this.isFetchingMore = false;
  }

  public onSliderControlChange(filter: {
    min: number;
    max: number;
    isActive: boolean;
  }) {
    filter.isActive = true;

    this.pushSearchRoute();
  }

  public highlightCreators(result: IResult) {
    if (!result.creator) {
      return "";
    }
    const div = document.createElement("DIV");
    div.innerHTML = result.creator.join(", ");

    let content = div.textContent || div.innerText || "";

    if (result.highlights) {
      let hits = result.highlights
        .filter((highlight) => highlight.path === "creator.@list.name")
        .map((hit) =>
          hit.texts.filter((t) => t.type === "hit").map((t) => t.value),
        )
        .flat();

      hits = [...new Set(hits)];
      hits.map((hit) => {
        content = content.replaceAll(hit, `<mark>${hit}</mark>`);
      });
    }

    return content;
  }

  /** Applies highlights to a string or string[] field and returns the new content as HTML */
  public highlight(result: IResult, path: keyof IResult) {
    const div = document.createElement("DIV");
    const field = result[path];

    div.innerHTML = Array.isArray(field) ? field.join(", ") : field;
    let content = div.textContent || div.innerText || "";

    if (result.highlights) {
      let hits = result.highlights
        .filter((highlight) => highlight.path === path)
        .map((hit) =>
          hit.texts.filter((t) => t.type === "hit").map((t) => t.value),
        )
        .flat();

      hits = [...new Set(hits)];
      hits.map((hit) => {
        content = content.replaceAll(hit, `<mark>${hit}</mark>`);
      });
    }

    return content;
  }

  public clearFilters() {
    const wasSomeActive = this.isSomeFilterActive;

    this.filter.creationDate.isActive = false;
    this.creationDate = [MIN_YEAR, MAX_YEAR];

    this.filter.publicationYear.isActive = false;
    this.publicationYear = [MIN_YEAR, MAX_YEAR];

    this.filter.dataCoverage.isActive = false;
    this.dataCoverage = [MIN_YEAR, MAX_YEAR];

    // this.filter.contentType.value = [];
    this.filter.project.value = [];
    this.filter.repository.value = null;
    this.filter.creatorName = "";

    if (wasSomeActive) {
      this.pushSearchRoute();
    }
  }

  /** Load route query parameters into component values. */
  private _loadRouteParams() {
    // SEARCH QUERY
    this.searchQuery = this.$route.query["q"] as string;

    // CREATOR NAME
    this.filter.creatorName = (this.$route.query["cn"] as string) || "";

    // REPOSITORY
    this.filter.repository.value = (this.$route.query["r"] as string) || null;

    // CONTENT TYPE
    // this.filter.contentType.value = (this.$route.query["ct"] as string[]) || [];

    // PROJECT
    this.filter.project.value = this.$route.query["p"]
      ? ([this.$route.query["p"]].flat() as string[])
      : [];

    // CREATION DATE
    if (this.$route.query["cd"]) {
      this.filter.creationDate.isActive = true;
      this.creationDate =
        ((this.$route.query["cd"] as [string, string])?.map((n) => +n) as [
          number,
          number,
        ]) || this.creationDate;
    }

    // PUBLICATION YEAR
    if (this.$route.query["py"]) {
      this.filter.publicationYear.isActive = true;
      this.publicationYear =
        ((this.$route.query["py"] as [string, string])?.map((n) => +n) as [
          number,
          number,
        ]) || this.publicationYear;
    }

    // DATA COVERAGE
    if (this.$route.query["dc"]) {
      this.filter.dataCoverage.isActive = true;
      this.dataCoverage =
        ((this.$route.query["dc"] as [string, string])?.map((n) => +n) as [
          number,
          number,
        ]) || this.dataCoverage;
    }

    // SORT
    if (this.route.query["s"]) {
      if (this.searchQuery) {
        this.sort =
          (this.route.query["s"] as "name" | "dateCreated" | "relevance") ||
          this.sort;
      } else {
        this.sortEmpty =
          (this.route.query["s"] as "name" | "dateCreated" | "relevance") ||
          this.sort;
      }
    }
  }

  public hasSpatialFeatures(result: IResult): boolean {
    return result.spatialCoverage?.some((feature: any) => feature.geometry);
  }
}
export default toNative(CdSearchResults);
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

:deep(.v-select--chips .v-select__selections .v-chip--select:first-child) {
  margin-top: 1rem;
}
</style>
