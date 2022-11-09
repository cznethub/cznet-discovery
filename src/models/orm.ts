import VuexORM from '@vuex-orm/core'
import SearchResults from './search-results.model'

/**
 * Register all the Models here.
 * https://vuex-orm.org/guide
 */
const db = new VuexORM.Database()
db.register(SearchResults)

export const orm = db