// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v8.1.8',
  USERDATA_KEY: 'authf649fc9a5f55',
  apiUrl: 'api',
};

export const CONFIG = {
  SESSION_EXPIRED: 3000,
  IDLE_TIMEOUT: 30,
  ALERT_INTERVAL: 30,
  API: {
    BACKEND: {
      URL: 'http://86.0.188.212:5000',
      DIEU_HANH_TRUC_URL: 'http://192.168.2.8:5000',
      DUTY_SCHEDULE: 'http://86.0.188.212:5000/api',
    },
    // "keycloak": {
    //   "url": "http://192.168.43.194:8050",
    //   "realm": "btl86",
    //   "clientId": "menu_mgis"
    // },
    GEOSERVER: {
      // URL: 'http://186.1.40.226:80/geoserver',
      URL: 'http://192.168.43.193:80/geoserver',
    },
  },
  SUPABASE: {
    URL: 'http://192.168.43.163:8001',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
  },
};
