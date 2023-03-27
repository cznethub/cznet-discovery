import { Model } from '@vuex-orm/core'
import { ENDPOINTS } from '@/constants'
import { getQueryString } from '@/util'

export interface ISearchState {
  results: IResult[],
  clusters: string[]
}

export default class Search extends Model {
  static entity = 'search'

  static fields() {
    return {

    }
  }

  static get $state(): any {
    return this.store().state.entities[this.entity]
  }

  static state(): ISearchState {
    return {
      results: [],
      clusters: []
    }
  }

  /** Performs a search and stores the result in state.results.
   * @returns a boolean indicating if the query has more pages that can be fetched with `fetchMore` method
   */
  public static async search(params: ISearchParams) {
    const response: Response = await fetch(`${ENDPOINTS.search}?${getQueryString(params)}`);

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const rawResults: any[] = await response.json();
    this.commit(state => {
      state.results = rawResults.map(this._parseResult)
    })
    return rawResults.length === params.pageSize
  }

  /** Fetches the next page indicated by params.pageNumber and appends the incoming items to `state.results`
   * @returns a boolean indicating if the query has more pages that can be fetched
   */
  public static async fetchMore(params: ISearchParams): Promise<boolean> {
    const response: Response = await fetch(`${ENDPOINTS.search}?${getQueryString(params)}`);

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const incoming = await response.json()

    this.commit((state) => {
      state.results = [
        ...state.results,
        ...incoming.map(this._parseResult)
      ] || []
    })

    return incoming.length === params.pageSize
  }

  /** Performs a typeahead search and returns the results */
  public static async typeahead(params: ITypeaheadParams): Promise<any[]> {
    const response: Response = await fetch(`${ENDPOINTS.typeahead}?${getQueryString(params)}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json()
    return data
  }

  /** Fetches the list of clusters and updates the state */
  public static async fetchClusters(): Promise<void> {
    const response: Response = await fetch(ENDPOINTS.clusters)

    if (!response.ok) {
      throw new Error('Failed to fetch clusters');
    }

    const clusters: string[] = await response.json();
    if (clusters) {
      this.commit((state) => {
        state.clusters = clusters
      })
    }
  }

  /** Transform raw result data from API into `IResult` shaped objects */
  private static _parseResult(rawResult: any): IResult {
    return {
      creator: rawResult.creator?.['@list']?.map(c => c.name) || [],
      dateCreated: rawResult.dateCreated || '',
      datePublished: rawResult.datePublished || '',
      description: rawResult.description || '',
      funding: rawResult.funding?.map((f) => f.name || f.funder.name) || [],
      highlights: rawResult.highlights || [],
      id: rawResult['@id'],
      keywords: rawResult.keywords || [],
      license: rawResult.license?.text || '',
      name: rawResult.name || '',
      score: rawResult.score || 0,
      spatialCoverage: rawResult.spatialCoverage?.geojson || [],
      url: rawResult.url || '',
    }
  }
}