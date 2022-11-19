import { Model } from '@vuex-orm/core'

export interface ISearchHistoryState {
}

export default class SearchHistory extends Model {
  static entity = 'search-history'
  static primaryKey = 'key'
  public readonly key!: string
  public readonly date!: Date
  
  static fields () {
    return {
      key: this.attr(''),
      date: this.attr(0)
    }
  }

  static get $state(): ISearchHistoryState {
    return this.store().state.entities[this.entity]
  }

  static state(): ISearchHistoryState {
    return {
    }
  }

  public static log(key: string) {
    SearchHistory.insert({ data: { key, date: Date.now() } })
  }
}