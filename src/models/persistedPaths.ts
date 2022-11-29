import SearchHistory from "./search-history.model";
import SearchResults from "./search-results.model";

export const persistedPaths = [
  'entities.' + SearchResults.entity + '.publicationYear',
  'entities.' + SearchResults.entity + '.dataCoverage',
  'entities.' + SearchResults.entity + '.sort',
  'entities.' + SearchHistory.entity,
  // 'entities.' + SearchResults.entity + '.contentType',
  // 'entities.' + Submission.entity + '.alsoDeleteInRepository',
]