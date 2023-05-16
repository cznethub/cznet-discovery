import { router } from "@/router/router";
import { Model } from "@vuex-orm/core";
import { Subject } from "rxjs";
import { RawLocation } from "vue-router";
import CzNotification from "./notifications.model";
import { getQueryString } from "@/util";
import { ENDPOINTS } from "@/constants";

export interface ICzCurrentUserState {
  orcid: string;
  orcidAccessToken: string;
}

export interface IUserState {
  isLoggedIn: boolean;
  orcid: string;
  orcidAccessToken: string;
  next: string;
  hasUnsavedChanges: boolean;
}

export default class User extends Model {
  static entity = "users";
  static isLoginListenerSet = false;
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
    return this.$state?.orcidAccessToken;
  }

  static state(): IUserState {
    return {
      isLoggedIn: false,
      orcid: "",
      orcidAccessToken: "",
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

    if (!this.isLoginListenerSet) {
      this.isLoginListenerSet = true; // Prevents registering the listener more than once

      const handleMessage = async (message: MessageEvent) => {
        console.info(`User: listening to login window...`);
        console.log(message);
        const dict: any = {};
        (message.target as Window).location.hash
          .split("&")
          .reduce((acc, curr) => {
            const [key, val] = curr.split("=");
            acc[key] = val;
            return acc;
          }, dict);
        console.log(dict.access_token);
        popup.removeEventListener("message", handleMessage);
        popup.close();
        return;

        if (message.data.token) {
          CzNotification.toast({
            message: "You have logged in!",
            type: "success",
          });
          await User.commit((state) => {
            state.isLoggedIn = true;
            // state.orcid = message.data.orcid;
            state.orcidAccessToken = message.data.token;
          });
          document.cookie = `Authorization=Bearer ${message.data.token}; expires=${message.data.expiresIn}; path=/`;
          this.isLoginListenerSet = false;
          this.loggedIn$.next();
          if (callback) {
            callback();
          }
        } else {
          CzNotification.toast({
            message: "Failed to Log In",
            type: "error",
          });
        }
      };

      popup.addEventListener("message", handleMessage, { once: true });
    }
  }

  static async checkAuthorization() {
    try {
      // TODO: find endpoint to verify authentication
      const response: Response = await fetch(
        `${ENDPOINTS.search}?${getQueryString({
          access_token: User.$state.orcidAccessToken,
        })}`
      );

      if (response.status !== 200) {
        // Something went wrong, authorization may be invalid
        User.commit((state) => {
          state.isLoggedIn = false;
        });

        // TODO: toast sign out?
      }
    } catch (e: any) {
      // console.log(e.response.status)
      User.commit((state) => {
        state.isLoggedIn = false;
      });
    }
  }

  static async logOut() {
    try {
      await fetch(`${ENDPOINTS.logout}`);
      this._logOut();
    } catch (e) {
      // We don't care about the response status. We at least log the user out in the frontend.
      this._logOut();
    }
  }

  private static async _logOut() {
    await User.commit((state) => {
      (state.isLoggedIn = false), (state.orcidAccessToken = "");
    });
    this.isLoginListenerSet = false;

    CzNotification.toast({
      message: "You have logged out!",
      type: "info",
    });

    if (router.currentRoute.meta?.hasLoggedInGuard) {
      router.push({ path: "/" });
    }
  }
}
