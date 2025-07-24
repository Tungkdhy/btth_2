import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToastrModule } from 'ngx-toastr';
// import { unitTreeViewReducer } from './store/unit-tree-view/unit-tree-view.reducer';
// import { unitCoordinateReducer } from './store/unit-coordinate/unit-coordinate.reducer';
// import { UnitCoordinateEffects } from './store/unit-coordinate/unit-coordinate.effects';
// import { mapCoordinateReducer } from './store/map-coordinate/map-coordinate.reducer';
// import { MapCoordinateEffects } from './store/map-coordinate/map-coordinate.effects';
import { ErrorInterceptor } from './_metronic/layout/core/rest/error-interceptor';
import { RequestInterceptor } from './_metronic/layout/core/rest/request-interceptor';
import { unitReducer } from './store/unit-btth/unit-btth.reducer';
import { UnitEffects } from './store/unit-btth/unit-btth.effects';
import { networkSystemReducer } from './store/map-interaction/network-system/network-system.reducer';
import { NetworkSystemEffects } from './store/map-interaction/network-system/network-system.effects';
import { ModeToggleModule } from './modules/mode-toggle/mode-toggle.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NetworkInfrastructureEffects } from './store/network-infrastructure/network-infrastructure.effects';
import { networkInfrastructureReducer } from './store/network-infrastructure/network-infrastructure.reducer';
import { SecurityEventEffects } from './store/security-event/security-event.effects';
import { securityEventReducer } from './store/security-event/security-event.reducer';
import { networkInfrastructureEndpointReducer } from './store/network-infrastructure-endpoint/network-infrastructure-endpoint.reducer';
import { NetworkInfrastructureEndpointEndpointEffects } from './store/network-infrastructure-endpoint/network-infrastructure-endpoint.effects';
import { CombinedStoreEffects } from './store/combined-store/combined-store.effects';
import { dutyReducer } from './store/duty-schedule/duty-schedule.reducer';
import { DutyEffects } from './store/duty-schedule/duty-schedule.effects';
import { ComponentLoadedEffects } from './store/component-loaded/component-loaded.effects';
import { deviceStatsReducer } from './store/map-interaction/device-stats/device-stats.reducer';
import { DeviceStatsEffects } from './store/map-interaction/device-stats/device-stats.effects';
import { EndpointStatsEffects } from './store/map-interaction/endpoint-stats/endpoint-stats.effects';
import { endpointStatsReducer } from './store/map-interaction/endpoint-stats/endpoint-stats.reducer';
import { SecurityStatsEffects } from './store/map-interaction/security-stats/security-stats.effects';
import { securityStatsReducer } from './store/map-interaction/security-stats/security-stats.reducer';
import { MapStoreEffects } from './store/map-interaction/map-store/map-store.effects';
import { mapStoreReducer } from './store/map-interaction/map-store/map-store.reducer';
import { StatisticsStoreEffects } from './store/map-interaction/statistics-store/statistics-store.effects';
import { alertDisconnectedReducer } from './store/alert/alert-disconnected/alert-disconnected.reducer';
import { AlertDisconnectedEffects } from './store/alert/alert-disconnected/alert-disconnected.effects';
import { alertSecurityReducer } from './store/alert/alert-security/alert-security.reducer';
import { AlertSecurityEffects } from './store/alert/alert-security/alert-security.effects';
import { DateTimeRangeV2Effects } from './store/date-time-range-v2/date-time-range-v2.effects';
import { dateRangeV2Reducer } from './store/date-time-range-v2/date-time-range-v2.reducer';
import { SupabaseService } from './modules/dashboard/services/supabase.service';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi'; // ✅ locale tiếng Việt

import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';

registerLocaleData(vi); 
export function authSupabase(supabaseService: SupabaseService) {
  return () =>
    supabaseService.signIn('diep@email.com', 'Abc@123').then((res) => {});
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    // AuthKeycloakModule,
    StoreModule.forRoot({
      // unitTreeView: unitTreeViewReducer,
      // unitCoordinate: unitCoordinateReducer,
      // mapCoordinates: mapCoordinateReducer,
      unitBtth: unitReducer,
      networkSystems: networkSystemReducer,
      networkInfrastructure: networkInfrastructureReducer,
      networkInfrastructureEndpoint: networkInfrastructureEndpointReducer,
      securityEvent: securityEventReducer,
      duty: dutyReducer,
      deviceStats: deviceStatsReducer,
      endpointStats: endpointStatsReducer,
      securityStats: securityStatsReducer,
      map: mapStoreReducer,
      alertsDisconnected: alertDisconnectedReducer,
      alertsSecurity: alertSecurityReducer,
      dateRangeV2: dateRangeV2Reducer,
    }),
    EffectsModule.forRoot([
      // UnitCoordinateEffects,
      // MapCoordinateEffects,
      UnitEffects,
      NetworkSystemEffects,
      NetworkInfrastructureEffects,
      NetworkInfrastructureEndpointEndpointEffects,
      SecurityEventEffects,
      CombinedStoreEffects,
      DutyEffects,
      ComponentLoadedEffects,
      DeviceStatsEffects,
      EndpointStatsEffects,
      SecurityStatsEffects,
      MapStoreEffects,
      StatisticsStoreEffects,
      AlertDisconnectedEffects,
      AlertSecurityEffects,
      DateTimeRangeV2Effects,
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
    ToastrModule.forRoot(),
    ModeToggleModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: authSupabase,
    //   deps: [SupabaseService],
    //   multi: true,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ErrorInterceptor,
    //   multi: true,
    // },
    { provide: LOCALE_ID, useValue: 'vi' },
    { provide: NZ_I18N, useValue: vi_VN },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
