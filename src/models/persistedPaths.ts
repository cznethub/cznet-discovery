import SearchHistory from "./search-history.model";
import SearchResults from "./search-results.model";
import Search from "./search.model";

export const persistedPaths = [
  'entities.' + SearchResults.entity + '.publicationYear',
  'entities.' + SearchResults.entity + '.dataCoverage',
  'entities.' + SearchResults.entity + '.sort',
  'entities.' + SearchHistory.entity,
  'entities.' + Search.entity + '.clusters',
  // 'entities.' + SearchResults.entity + '.contentType',
  // 'entities.' + Submission.entity + '.alsoDeleteInRepository',
]