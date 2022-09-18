import { RouteConfig } from "vue-router";

export const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    components: {

    },
  },
  {
    path: '*',
    redirect: '/',
  },
]
