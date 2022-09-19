import { RouteConfig } from "vue-router";
import Home from "@/components/home/home.vue"
import Footer from "@/components/base/footer.vue"

export const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    components: {
      content: Home,
      footer: Footer
    },
  },
  {
    path: '*',
    redirect: '/',
  },
]
