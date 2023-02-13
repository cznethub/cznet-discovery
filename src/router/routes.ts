import { RouteConfig } from 'vue-router';
import CdHome from '@/components/home/cd.home.vue'
import CdAbout from '@/components/about/cd.about.vue'
import CdContact from '@/components/contact/cd.contact.vue'
import CdSearchResults from '@/components/search-results/cd.search-results.vue'
import CdFooter from '@/components/base/cd.footer.vue'

export const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/discover',
    components: {
      content: CdHome,
      footer: CdFooter
    },
  },
  {
    name: 'search',
    path: '/discover/search',
    components: {
      content: CdSearchResults,
      footer: CdFooter
    },
  },
  {
    name: 'about',
    path: '/discover/about',
    components: {
      content: CdAbout,
      footer: CdFooter
    },
  },
  {
    name: 'contact',
    path: '/discover/contact',
    components: {
      content: CdContact,
      footer: CdFooter
    },
  },
  {
    path: '*',
    redirect: '/discover',
  },
]
