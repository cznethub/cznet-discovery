import { RouteConfig } from "vue-router";
import CdHome from "@/components/home/cd.home.vue";
import CdSearchResults from "@/components/search-results/cd.search-results.vue";
import CdFooter from "@/components/base/cd.footer.vue";
import CdContribute from "@/components/contribute/cd.contribute.vue";
import AuthRedirect from "@/components/account/auth-redirect.vue";

export const routes: RouteConfig[] = [
  {
    name: "home",
    path: "/",
    components: {
      content: CdHome,
      footer: CdFooter,
    },
  },
  {
    name: "search",
    path: "/search",
    components: {
      content: CdSearchResults,
      footer: CdFooter,
    },
  },
  {
    name: "contribute",
    path: "/contribute",
    components: {
      content: CdContribute,
      footer: CdFooter,
    },
  },
  {
    name: "auth-redirect",
    path: "/auth-redirect",
    components: {
      content: AuthRedirect,
      footer: CdFooter,
    },
  },
  {
    path: "*",
    redirect: "/",
  },
];
