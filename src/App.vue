<template>
  <v-app app>
    <v-app-bar id="app-bar" color="navbar" scroll-behavior="elevate" fixed app>
      <v-container class="d-flex align-end full-height py-1 align-center">
        <router-link :to="{ path: `/` }" class="logo">
          <img :src="'/img/logo.png'" alt="home" />
        </router-link>
        <v-spacer></v-spacer>
        <v-card
          class="nav-items mr-2 d-flex mr-4"
          :elevation="2"
          v-if="!$vuetify.display.mdAndDown"
        >
          <v-btn
            v-for="path of paths"
            v-bind="path.attrs"
            :id="`navbar-nav-${path.label.replaceAll(/[\/\s]/g, ``)}`"
            :key="path.attrs.to || path.attrs.href"
            :elevation="0"
            active-class="primary"
            :color="path.isActive && path.isActive() ? 'primary' : ''"
            variant="flat"
          >
            {{ path.label }}
            <v-icon v-if="path.isExternal" small class="ml-2" right>
              mdi-open-in-new
            </v-icon>
          </v-btn>
        </v-card>

        <v-app-bar-nav-icon
          @click.stop="showMobileNavigation = true"
          v-if="$vuetify.display.mdAndDown"
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
          <router-view v-if="!isLoading" name="content" />
        </v-sheet>
      </v-container>
    </v-main>

    <v-footer class="mt-8 bg-blue-grey-lighten-4">
      <router-view name="footer" />
    </v-footer>

    <v-navigation-drawer
      class="mobile-nav-items"
      v-model="showMobileNavigation"
      temporary
      app
    >
      <v-list nav dense class="nav-items">
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
      </v-list>
    </v-navigation-drawer>

    <cz-notifications />

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
import { Component, Vue, toNative } from "vue-facing-decorator";
import { APP_NAME, DSP_URL } from "./constants";
import Search from "@/models/search.model";
import { CzNotifications } from "@cznethub/cznet-vue-core";

@Component({
  name: "app",
  components: { CzNotifications },
})
class App extends Vue {
  public isLoading = true;
  public showMobileNavigation = false;
  paths: any[] = [];

  async created() {
    document.title = APP_NAME;

    this.paths = [
      {
        attrs: { to: "/" },
        label: "Discover Data",
        icon: "mdi-bookmark-multiple",
        isActive: () =>
          this.$route.name === "search" || this.$route.name === "home",
      },
      {
        attrs: { href: DSP_URL },
        label: "Contribute Data",
        icon: "mdi-book-plus",
      },
      {
        attrs: { to: "/about" },
        label: "About",
        icon: "mdi-help",
        isActive: () => this.$route.name === "about",
      },

      {
        attrs: { to: "/contact" },
        label: "Contact",
        icon: "mdi-book-open-blank-variant",
        isActive: () => this.$route.name === "contact",
      },
    ];

    try {
      Search.fetchClusters();
    } catch (e) {
      console.error("Failed to fetch clusters", e);
    }

    this.isLoading = false;
  }
}
export default toNative(App);
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
