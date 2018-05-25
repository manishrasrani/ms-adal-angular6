import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MsAdalAngular6Service } from "./ms-adal-angular6.service";

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {
    constructor(private adalSvc: MsAdalAngular6Service) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.adalSvc.isAuthenticated) {
            return true;
        } else {
            this.adalSvc.login();
            return false;
        }
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(childRoute, state);
    }
}