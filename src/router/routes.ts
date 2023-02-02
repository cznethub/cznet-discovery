import { RouteConfig } from 'vue-router';
import CdHome from '@/components/home/cd.home.vue'
import CdAbout from '@/components/about/cd.about.vue'
import CdContact from '@/components/contact/cd.contact.vue'
import CdSearchResults from '@/components/search-results/cd.search-results.vue'
import CdFooter from '@/components/base/cd.footer.vue'

export const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    components: {
      content: CdHome,
      footer: CdFooter
    },
  },
  {
    name: 'search',
    path: '/search',
    components: {
      content: CdSearchResults,
      footer: CdFooter
    },
  },
  {
    name: 'about',
    path: '/about',
    components: {
      content: CdAbout,
      footer: CdFooter
    },
  },
  {
    name: 'contact',
    path: '/contact',
    components: {
      content: CdContact,
      footer: CdFooter
    },
  },
  {
    path: '*',
    redirect: '/',
  },
]
