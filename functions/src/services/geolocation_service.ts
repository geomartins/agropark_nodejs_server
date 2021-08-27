
import * as functions from "firebase-functions";
import FirestoreService from "./firestore_service";
const IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");
const GeolocationParams =
require("ip-geolocation-api-javascript-sdk/GeolocationParams.js");

/**
 * @namespace
 */
class GeolocationService {
    private ipgeolocationApi: any;
    private geolocationParams: any;
    constructor() {
      this.ipgeolocationApi =
      new IPGeolocationAPI(functions.config().ip_geolocation.key, true);
      this.geolocationParams = new GeolocationParams();
    }
    update(uid: string, ip: string | null = null) {
      try {
        if (ip) {
          this.geolocationParams.setIPAddress(ip);
        }

        this.ipgeolocationApi.getGeolocation((json: any) => {
          if (json) {
            new FirestoreService().updateGeolocationByUid(uid, json);
          }
          return json;
        }, this.geolocationParams);
      } catch (err) {
        console.log(err);
      }
    }
}

export default GeolocationService;
