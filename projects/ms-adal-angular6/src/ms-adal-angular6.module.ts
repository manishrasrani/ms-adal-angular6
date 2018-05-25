import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { MsAdalAngular6Service } from './ms-adal-angular6.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class MsAdalAngular6Module { 
  static forRoot(adalConfig: any): ModuleWithProviders {
    return {
      ngModule: MsAdalAngular6Module,
      providers: [MsAdalAngular6Service, { provide: 'adalConfig', useValue: adalConfig }]
    };
  }
}