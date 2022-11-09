import { Model } from '@vuex-orm/core'
import { INITIAL_RANGE } from '@/constants'

export interface ISearchResultsState {
  sort: 'name' | 'dateCreated' | null
  publicationYear: [number, number]
  dataCoverage: [number, number]
  creatorName: string,
  repository: string,
  contentType: string[]
}

export default class SearchResults extends Model {
  static entity = 'search-results'
  
  static fields () {
    return {

    }
  }

  static get $state(): ISearchResultsState {
    return this.store().state.entities[this.entity]
  }

  static state(): ISearchResultsState {
    return {
      sort: null,
      publicationYear: INITIAL_RANGE,
      dataCoverage: INITIAL_RANGE,
      creatorName: '',
      repository: '',
      contentType: []
    }
  }
}