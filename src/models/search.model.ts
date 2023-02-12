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
      results: []
    }
  }

  /** Performs a search and stores the result in state.results.
   * @returns a boolean indicating if the query has more pages that can be fetched with fetchMore method
   */
  public static async search(params: ISearchParams) {
    const strParams = stringifyParamValues(params)
    const response: Response = await fetch(ENDPOINTS.search + '?' + new URLSearchParams(strParams), {
      mode: 'no-cors'
    })

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    
    const data = await response.json()
    this.commit(state => {
      state.results = data
    })
    return data.length === params.pageSize
  }

  /** Fetches the next page indicated by params.pageNumber and appends the incoming items to the current results
   * @returns a boolean indicating if the query has more pages that can be fetched
   */
  public static async fetchMore(params: ISearchParams): Promise<boolean> {
    const strParams = stringifyParamValues(params)
    const response: Response = await fetch(ENDPOINTS.search + '?' + new URLSearchParams(strParams), {
      mode: 'no-cors'
    })

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

  public static async typeahead(params: ITypeaheadParams) {
    const strParams = stringifyParamValues(params)
    const response = await fetch(ENDPOINTS.typeahead + '?' + new URLSearchParams(strParams), {
      mode: 'no-cors'
    })
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json()
    return data
  }
}