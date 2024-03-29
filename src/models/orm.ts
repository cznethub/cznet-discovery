import VuexORM from '@vuex-orm/core'
import SearchHistory from './search-history.model'
import SearchResults from './search-results.model'
import Search from './search.model'

/**
 * Register all the Models here.
 * https://vuex-orm.org/guide
 */
const db = new VuexORM.Database()
db.register(SearchResults)
db.register(SearchHistory)
db.register(Search)

export const orm = db