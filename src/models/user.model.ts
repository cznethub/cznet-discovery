import { router } from "@/router/router";
import { Model } from "@vuex-orm/core";
import { Subject } from "rxjs";
import { RawLocation } from "vue-router";
import { getQueryString } from "@/util";
import { ENDPOINTS } from "@/constants";
import { Notifications } from "@cznethub/cznet-vue-core";

export interface ICzCurrentUserState {
  accessToken: string;
}

export interface IUserState {
  isLoggedIn: boolean;
  accessToken: string;
  next: string;
  hasUnsavedChanges: boolean;
}

export default class User extends Model {
  static entity = "users";
  // static isLoginListenerSet = false;
  static logInDialog$ = new Subject<RawLocation | undefined>();
  static loggedIn$ = new Subject<void>();

  static fields() {
    return {};
  }

  static get $state(): IUserState {
    return this.store().state.entities[this.entity];
  }

  static get next() {
    return;
  }

  static get accessToken() {
    return this.$state?.accessToken;
  }

  static state(): IUserState {
    return {
      isLoggedIn: false,
      accessToken: "",
      next: "",
      hasUnsavedChanges: false,
    };
  }

  static openLogInDialog(redirectTo?: RawLocation) {
    this.logInDialog$.next(redirectTo);
  }

  static async logIn(callback?: () => any) {
    const params = {
      response_type: "token",
      client_id: "local_iguide_api",
      redirect_uri: "http://localhost:8080/auth-redirect",
      window_close: "True",
    };
    const loginUrl = `https://auth.cuahsi.io/realms/HydroShare/protocol/openid-connect/auth`;

    const popup: WindowProxy = window.open(
      `${loginUrl}?${getQueryString(params)}`,
      "_blank",
      "location=1,status=1,scrollbars=1, width=800,height=800"
    ) as WindowProxy;

    // if (!this.isLoginListenerSet) {
    // this.isLoginListenerSet = true; // Prevents registering the listener more than once

    const handleMessage = async (event: MessageEvent) => {
      console.log(event);
      if (
        event.type !== "message" ||
        event.origin !== "http://localhost:8080"
      ) {
        Notifications.toast({
          message: "Failed to Log In",
          type: "error",
        });
        return;
      }

      if (event.data) {
        Notifications.toast({
          message: "You have logged in!",
          type: "success",
        });
        await User.commit((state) => {
          state.isLoggedIn = true;
          state.accessToken = event.data;
        });
        // document.cookie = `Authorization=Bearer ${dict.access_token}; path=/`;
        this.loggedIn$.next();
        callback?.();

        popup.removeEventListener("message", handleMessage);
        popup.close();
      } else {
        Notifications.toast({
          message: "Failed to Log In",
          type: "error",
        });
      }
    };

    console.info(`User: listening to login window...`);
    // TODO: this event listener is broken if the popup has a redirect step before postMessaage
    // https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
    popup.addEventListener("message", handleMessage, { once: true });
  }

  static async checkAuthorization() {
    try {
      // TODO: find endpoint to verify authentication
      const response: Response = await fetch(
        `${ENDPOINTS.search}?${getQueryString({
          access_token: User.$state.accessToken,
        })}`
      );

      if (response.status !== 200) {
        // Something went wrong, authorization may be invalid
        User.commit((state) => {
          state.isLoggedIn = false;
        });
      }
    } catch (e: any) {
      // console.log(e.response.status)
      User.commit((state) => {
        state.isLoggedIn = false;
      });
    }
  }

  static async logOut() {
    // try {
    // await fetch(`${ENDPOINTS.logout}`);
    this._logOut();
    // } catch (e) {
    // We don't care about the response status. We at least log the user out in the frontend.
    // this._logOut();
    // }
  }

  private static async _logOut() {
    await User.commit((state) => {
      (state.isLoggedIn = false), (state.accessToken = "");
    });
    // this.isLoginListenerSet = false;

    Notifications.toast({
      message: "You have logged out!",
      type: "info",
    });

    if (router.currentRoute.meta?.hasLoggedInGuard) {
      router.push({ path: "/" });
    }
  }
}
