<template>
  <v-app app>
    <v-app-bar
      color="navbar"
      ref="appBar"
      id="app-bar"
      elevate-on-scroll
      fixed
      app
    >
      <v-container class="d-flex align-end full-height pa-0 align-center">
        <router-link :to="{ path: `/` }" class="logo">
          <img :src="require('@/assets/img/logo.png')" alt="home" />
        </router-link>
        <div class="spacer"></div>
        <v-card
          class="nav-items has-space-right d-flex"
          :elevation="2"
          v-if="!$vuetify.breakpoint.mdAndDown"
        >
          <v-btn
            color="white"
            v-for="path of paths"
            :key="path.attrs.to || path.attrs.href"
            v-bind="path.attrs"
            :id="`navbar-nav-${path.label.replaceAll(/[\/\s]/g, ``)}`"
            :elevation="0"
            active-class="primary"
            :class="path.isActive?.() ? 'primary' : ''"
          >
            {{ path.label }}
          </v-btn>
        </v-card>

        <v-app-bar-nav-icon
          @click.stop="showMobileNavigation = true"
          v-if="$vuetify.breakpoint.mdAndDown"
        />
      </v-container>
    </v-app-bar>

    <v-main app>
      <v-container id="main-container">
        <v-sheet
          min-height="70vh"
          rounded
          :elevation="$route.meta.hideMainSheet ? 0 : 2"
        >
          <router-view name="content" />
        </v-sheet>
      </v-container>
    </v-main>

    <v-footer class="mt-8 navbar lighten-1">
      <router-view name="footer" />
    </v-footer>

    <v-navigation-drawer
      class="mobile-nav-items"
      v-model="showMobileNavigation"
      temporary
      app
    >
      <v-list nav dense class="nav-items">
        <v-list-item-group class="text-body-1">
          <v-list-item
            v-for="path of paths"
            @click="showMobileNavigation = false"
            :id="`drawer-nav-${path.label.replaceAll(/[\/\s]/g, ``)}`"
            :key="path.attrs.to || path.attrs.href"
            :class="path.isActive?.() ? 'accent' : ''"
            v-bind="path.attrs"
            active-class="accent white--text"
          >
            <v-icon class="mr-2">{{ path.icon }}</v-icon>
            <span>{{ path.label }}</span>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <cd-notifications />

    <link
      href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css"
      rel="stylesheet"
    />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { APP_NAME } from "./constants";
// import Search from "@/models/search.model";
import CdNotifications from "@/components/base/cz.notifications.vue";

@Component({
  name: "app",
  components: { CdNotifications },
})
export default class App extends Vue {
  public showMobileNavigation = false;
  public paths: any[] = [
    {
      attrs: { to: "/" },
      label: "Home",
      icon: "mdi-bookmark-multiple",
      isActive: () => this.$route.name === "search",
    },
    // {
    //   attrs: { href: "https://dsp.criticalzone.org/" },
    //   label: "Contribute Data",
    //   icon: "mdi-book-plus",
    // },
  ];

  async created() {
    document.title = APP_NAME;
  }
}
</script>

<style lang="scss" scoped>
.logo {
  height: 100%;
  cursor: pointer;

  img {
    height: 100%;
  }
}

#footer {
  width: 100%;
  margin: 0;
  min-height: unset;
  margin-top: 4rem;
  box-shadow: none;
}

.v-toolbar.v-app-bar--is-scrolled > .v-toolbar__content > .container {
  align-items: center !important;
  will-change: padding;
  padding-top: 0;
  padding-bottom: 0;
}

.nav-items {
  border-radius: 2rem !important;
  overflow: hidden;

  & > a.v-btn:first-child {
    border-top-left-radius: 2rem !important;
    border-bottom-left-radius: 2rem !important;
  }

  & > a.v-btn:last-child {
    border-top-right-radius: 2rem !important;
    border-bottom-right-radius: 2rem !important;
  }

  .v-btn {
    margin: 0;
    border-radius: 0;
    height: 39px !important;
  }
}

// .nav-items .v-btn.is-active,
// .mobile-nav-items .v-list-item.is-active {
//   background-color: #1976d2 !important;
//   color: #FFF;
// }
</style>
