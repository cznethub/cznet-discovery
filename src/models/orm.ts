import VuexORM from '@vuex-orm/core'

/**
 * Register all the Models here.
 * https://vuex-orm.org/guide
 */

const db = new VuexORM.Database()

export const orm = db