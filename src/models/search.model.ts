import { Model } from '@vuex-orm/core'
import { ENDPOINTS } from '@/constants'
import { stringifyParamValues } from '@/util'

export interface ISearchState {
  results: any[]
}

export default class Search extends Model {
  static entity = 'search'
  
  static fields () {
    return {

    }
  }

  static get $state(): any {
    return this.store().state.entities[this.entity]
  }

  static state(): any {
    return {
      results: [],
      clusters: []
    }
  }

  /** Performs a search and stores the result in state.results.
   * @returns a boolean indicating if the query has more pages that can be fetched with `fetchMore` method
   */
  public static async search(params: ISearchParams) {
    const strParams = stringifyParamValues(params)
    const response: Response = await fetch(ENDPOINTS.search + '?' + new URLSearchParams(strParams))

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    
    const data = await response.json()
    this.commit(state => {
      state.results = data
    })
    return data.length === params.pageSize
  }

  /** Fetches the next page indicated by params.pageNumber and appends the incoming items to `state.results`
   * @returns a boolean indicating if the query has more pages that can be fetched
   */
  public static async fetchMore(params: ISearchParams): Promise<boolean> {
    const strParams = stringifyParamValues(params)
    const response: Response = await fetch(ENDPOINTS.search + '?' + new URLSearchParams(strParams))

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const incoming = await response.json()

    this.commit((state) => {
      state.results = [
        ...state.results,
        ...incoming
      ] || []
    })

    return incoming.length === params.pageSize
  }

  /** Performs a typeahead search and returns the results */
  public static async typeahead(params: ITypeaheadParams): Promise<any[]> {
    const strParams = stringifyParamValues(params)
    const response: Response = await fetch(ENDPOINTS.typeahead + '?' + new URLSearchParams(strParams))
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

    const clusters = await response.json();
    if (clusters) {
      this.commit((state) => {
        state.clusters = clusters
      })
    }
  }
}