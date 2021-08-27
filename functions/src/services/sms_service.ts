import * as functions from "firebase-functions";
import axios from "axios";
const accountSid = functions.config().twillo.id;
const authToken = functions.config().twillo.key;
const appMobileNumber = functions.config().twillo.mobile;
const appMobileName = "AgroPark-Erp";
const smsNigeriaToken =
functions.config().sms_nigeria.key;

const client = require("twilio")(accountSid, authToken);

type NotificationData = {
    telephone: string | string[];
    message: string | "";
}


/**
 * @namespace
 */
class SmsService {
  constructor(private notificationData: NotificationData ) {}

  async twiloSms() {
    return client.messages
        .create({
          body: this.notificationData.message,
          from: appMobileNumber,
          to: this.notificationData.telephone,
        });
  }

  async smsNigeria() {
    return await axios.post("https://www.bulksmsnigeria.com/api/v1/sms/create", {
      api_token: smsNigeriaToken,
      from: appMobileName,
      to: this.notificationData.telephone,
      body: this.notificationData.message,
      dnd: 2,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default SmsService;
