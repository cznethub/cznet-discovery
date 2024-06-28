import { RouteRecordRaw } from "vue-router";
import CdHome from "@/components/home/cd.home.vue";
import CdAbout from "@/components/about/cd.about.vue";
import CdContact from "@/components/contact/cd.contact.vue";
import CdSearchResults from "@/components/search-results/cd.search-results.vue";
import CdFooter from "@/components/base/cd.footer.vue";

export const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    components: {
      content: CdHome,
      footer: CdFooter,
    },
    meta: {
      title: "Home",
    },
  },
  {
    name: "search",
    path: "/search",
    components: {
      content: CdSearchResults,
      footer: CdFooter,
    },
    meta: {
      title: "Search",
    },
  },
  {
    name: "about",
    path: "/about",
    components: {
      content: CdAbout,
      footer: CdFooter,
    },
    meta: {
      title: "About",
    },
  },
  {
    name: "contact",
    path: "/contact",
    components: {
      content: CdContact,
      footer: CdFooter,
    },
    meta: {
      title: "Contact",
    },
  },
  /** @see https://router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes */
  { path: "/:pathMatch(.*)*", name: "not-found", redirect: { name: "home" } },
  {
    path: "/:pathMatch(.*)",
    name: "bad-not-found",
    redirect: { name: "home" },
  },
];
