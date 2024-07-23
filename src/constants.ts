export const APP_NAME = import.meta.env.VITE_APP_NAME || "";
export const SUPPORT_EMAIL = import.meta.env.VITE_APP_SUPPORT_EMAIL || "";
export const DEFAULT_TOAST_DURATION = 3500;

export const sameRouteNavigationErrorHandler = (e) => {
  // Ignore the vuex err regarding  navigating to the page they are already on.
  if (
    e.name !== "NavigationDuplicated" &&
    !e.message.includes("Avoided redundant navigation to current location")
  ) {
    // But print any other errors to the console
    console.error(e);
  }
};

export const MAX_YEAR = new Date().getFullYear();
export const MIN_YEAR = 1900;
export const INITIAL_RANGE: [number, number] = [MIN_YEAR, MAX_YEAR];

export const API_BASE = import.meta.env.VITE_APP_API_URL || "";
export const DSP_URL = import.meta.env.VITE_APP_DSP_URL || "";

export const ENDPOINTS: { [key: string]: string } = {
  search: `${API_BASE}/search`,
  typeahead: `${API_BASE}/typeahead`,
  clusters: `${API_BASE}/clusters`,
};
