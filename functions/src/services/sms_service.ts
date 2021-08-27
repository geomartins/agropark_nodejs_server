import axios from "axios";
const accountSid = "AC0ff37d5fbf8f420923d4eb93f60b6e01";
const authToken = "876f275661263b3a43922340824d8a0d";
const appMobileNumber = "+14155238886";
const appMobileName = "AgroPark-Erp";
const smsNigeriaToken =
"s6SAVGn4I9WTnQOK3vbuljbZO1ht9NkH36hzkCyUEOSewfOFuWLWzdhGrDT6";

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
