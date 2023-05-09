import SearchHistory from "./search-history.model";
import SearchResults from "./search-results.model";
import Search from "./search.model";

export const persistedPaths = [
  "entities." + SearchResults.entity + ".sort",
  "entities." + SearchHistory.entity,
];
