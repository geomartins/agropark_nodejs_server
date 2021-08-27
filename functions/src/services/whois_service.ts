import axios from "axios";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * @namespace
 */
class WhoisService {
  constructor() {}

  async fetchRecord(domain: string) {
    return axios.get("https://www.whoisxmlapi.com/whoisserver/WhoisService", {
      params: {
        apiKey: functions.config().whoisxml.key,
        domainName: domain,
        outputFormat: "JSON",
      },
    }).then((result) => {
      const record = result.data.WhoisRecord;
      const date = new Date(record.registryData.expiresDate);
      const info = {
        "provider": record.registrarName,
        "expiry_date": admin.firestore.Timestamp.fromDate(date),
        "nameserver": record.registryData.nameServers.hostNames,
      };
      return info;
    });
  }
}

export default WhoisService;
