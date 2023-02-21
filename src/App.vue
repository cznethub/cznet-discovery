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
            :key="path.to"
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
          <router-view v-if="!isLoading" name="content" />
        </v-sheet>
      </v-container>
    </v-main>

    <v-footer class="mt-8 navbar darken-1">
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
            :key="path.to"
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

    <v-snackbar
      v-model="snackbar.isActive"
      :timeout="snackbar.isInfinite ? -1 : snackbar.duration"
      :color="snackbarColors[snackbar.type].snackbar"
    >
      <span>{{ snackbar.message }}</span>

      <template v-slot:action="{ attrs }">
        <v-btn
          @click="snackbar.isActive = false"
          v-bind="attrs"
          :color="snackbarColors[snackbar.type].actionButton"
          >Dismiss</v-btn
        >
      </template>
    </v-snackbar>

    <v-dialog
      :id="`dialog-` + dialog.title.replaceAll(` `, ``)"
      v-model="dialog.isActive"
      persistent
      width="500"
    >
      <v-card>
        <v-card-title>{{ dialog.title }}</v-card-title>
        <v-card-text class="text-body-1">{{ dialog.content }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="dialog-cancel"
            @click="
              dialog.isActive = false;
              dialog.onCancel();
            "
            text
          >
            {{ dialog.cancelText }}
          </v-btn>

          <v-btn
            v-if="dialog.onSecondaryAction"
            @click="
              dialog.isActive = false;
              dialog.onSecondaryAction();
            "
            color="green darken-1"
            text
          >
            {{ dialog.secondaryActionText }}
          </v-btn>

          <v-btn
            class="dialog-confirm"
            @click="
              dialog.isActive = false;
              dialog.onConfirm();
            "
            color="green darken-1"
            text
          >
            {{ dialog.confirmText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { Subscription } from "rxjs";
import { APP_NAME, DEFAULT_TOAST_DURATION } from "./constants";
import Notification, { IDialog, IToast } from "./models/notifications.model";
import Search from "@/models/search.model";

const INITIAL_DIALOG = {
  title: "",
  content: "",
  confirmText: "",
  cancelText: "",
  isActive: false,
  onConfirm: () => {},
  onCancel: () => {},
};

const INITIAL_SNACKBAR = {
  message: "",
  duration: DEFAULT_TOAST_DURATION,
  position: "center" as "center" | "left" | undefined,
  type: "default" as "default" | "success" | "error" | "info",
  isActive: false,
  isInfinite: false,
  // isPersistent: false,
};

@Component({
  name: "app",
  components: {},
})
export default class App extends Vue {
  public isLoading = true;
  public onToast!: Subscription;
  public onOpenDialog!: Subscription;
  public showMobileNavigation = false;
  public snackbarColors = {
    success: { snackbar: "primary", actionButton: "primary darken-2" },
    error: { snackbar: "error darken-2", actionButton: "error darken-3" },
    info: { snackbar: "primary", actionButton: "primary darken-2" },
    default: { snackbar: undefined, actionButton: undefined },
  };
  public snackbar: IToast & { isActive: boolean; isInfinite: boolean } =
    INITIAL_SNACKBAR;
  public dialog: IDialog & { isActive: boolean } = INITIAL_DIALOG;
  public paths: any[] = [
    {
      attrs: { to: "/" },
      label: "Discover Data",
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

    try {
      Search.fetchClusters()
    }
    catch(e) {
      console.error('Failed to fetch clusters', e);
    }

    this.onToast = Notification.toast$.subscribe((toast: IToast) => {
      this.snackbar = { ...this.snackbar, ...toast };
      this.snackbar.isActive = true;
    });

    this.onOpenDialog = Notification.dialog$.subscribe((dialog: IDialog) => {
      this.dialog = { ...INITIAL_DIALOG, ...dialog };
      this.dialog.isActive = true;
    });

    this.isLoading = false;
  }

  beforeDestroy() {
    // Good practice
    this.onToast.unsubscribe();
    this.onOpenDialog.unsubscribe();
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
