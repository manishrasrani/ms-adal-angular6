import { Injectable, Inject } from '@angular/core';
import { Observable, bindCallback } from 'rxjs';
import * as adalLib from 'adal-angular';

@Injectable({
  providedIn: 'root'
})
export class MsAdalAngular6Service {
  private context: adalLib;

  constructor(@Inject('adalConfig') private adalConfig: any) {
    this.context = adalLib.inject(adalConfig);
    this.handleWindowCallback();
  }

  public get LoggedInUserEmail() {
    if (this.isAuthenticated) {
      return this.context.getCachedUser().userName;
    }
    return '';
  }

  public get LoggedInUserName() {
    if (this.isAuthenticated) {
      return this.context.getCachedUser().profile.name;
    }
    return '';
  }

  public login() {
    this.context.login();
  }

  public logout() {
    this.context.logOut();
  }

  public GetResourceForEndpoint(url: string): string {
    let resource = null;
    if (url) {
      resource = this.context.getResourceForEndpoint(url);
      if (!resource) {
        resource = this.adalConfig.clientId;
      }
    }
    return resource;
  }

  public RenewToken(url: string) {
    let resource = this.GetResourceForEndpoint(url);
    return this.context.clearCacheForResource(resource); // Trigger the ADAL token renew 
  }

  public acquireToken(url: string) {
    const _this = this;   // save outer this for inner function
    let errorMessage: string;

    return bindCallback(acquireTokenInternal, (token: string) => {
      if (!token && errorMessage) {
        throw (errorMessage);
      }
      return token;
    })();

    function acquireTokenInternal(cb: any) {
      let s: string = null;
      let resource: string;
      resource = _this.GetResourceForEndpoint(url);

      _this.context.acquireToken(resource, (error: string, tokenOut: string) => {
        if (error) {
          _this.context.error('Error when acquiring token for resource: ' + resource, error);
          errorMessage = error;
          cb(null as string);
        } else {
          cb(tokenOut);
          s = tokenOut;
        }
      });
      return s;
    }
  }

  public acquireTokenRedirect(url: string, extraQueryParameters?: string | null, claims?: string | null) {
    const _this = this;
    let resource = _this.GetResourceForEndpoint(url);
    this.context.acquireTokenRedirect(resource, extraQueryParameters, claims);    
  }

  public getToken(url: string): string {

    const resource = this.context.getResourceForEndpoint(url);
    const storage = this.adalConfig.cacheLocation;
    let key;
    if (resource) {
      key = 'adal.access.token.key' + resource;
    } else {
      key = 'adal.idtoken';
    }
    if (storage === 'localStorage') {
      return localStorage.getItem(key);
    } else {
      return sessionStorage.getItem(key);
    }
  }

  handleWindowCallback() {
    this.context.handleWindowCallback();
  }

  public get userInfo() {
    return this.context.getCachedUser();
  }

  public get accessToken() {
    return this.context.getCachedToken(this.adalConfig.clientId);
  }

  public get isAuthenticated(): boolean {
    return (this.userInfo && this.accessToken) ? true : false;
  }
}