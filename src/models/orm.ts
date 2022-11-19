import VuexORM from '@vuex-orm/core'
import SearchHistory from './search-history.model'
import SearchResults from './search-results.model'

/**
 * Register all the Models here.
 * https://vuex-orm.org/guide
 */
const db = new VuexORM.Database()
db.register(SearchResults)
db.register(SearchHistory)

export const orm = db