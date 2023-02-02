export const APP_NAME = process.env.VUE_APP_NAME || ''
export const BANNER_TITLE = process.env.VUE_APP_BANNER_TITLE || ''
export const BANNER_SUBTITLE = process.env.VUE_APP_BANNER_SUBTITLE || ''
export const SUPPORT_EMAIL = process.env.VUE_APP_SUPPORT_EMAIL || ''
export const DEFAULT_TOAST_DURATION = 3500
export const APP_ID = process.env.VUE_APP_REALM_APP_ID || ''
export const GRAPHQL_URL = `https://realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`
export const SEARCH_RESOLVER = process.env.VUE_APP_SEARCH_RESOLVER || ''
export const SEARCH_QUERY = process.env.VUE_APP_SEARCH_QUERY || ''
export const TYPEAHEAD_RESOLVER = process.env.VUE_APP_TYPEAHEAD_RESOLVER || ''
export const TYPEAHEAD_QUERY = process.env.VUE_APP_TYPEAHEAD_QUERY || ''

export const sameRouteNavigationErrorHandler = (e) => {
  // Ignore the vuex err regarding  navigating to the page they are already on.
  if (e.name !== 'NavigationDuplicated' && !e.message.includes('Avoided redundant navigation to current location')) {
    // But print any other errors to the console
    console.error(e)
  }
}

export const MAX_YEAR = (new Date()).getFullYear()
export const MIN_YEAR = 1900
export const INITIAL_RANGE: [number, number] = [MIN_YEAR, MAX_YEAR]