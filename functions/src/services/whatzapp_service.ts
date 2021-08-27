import * as functions from "firebase-functions";
const accountSid = functions.config().twillo.id;
const authToken = functions.config().twillo.key;
const appMobileNumber = functions.config().twillo.mobile;
const client = require("twilio")(accountSid, authToken);

type NotificationData = {
    telephone: string | "",
    message: string | "";
}

/**
 * @namespace
 */
class WhatzappService {
  constructor(private notificationData: NotificationData ) {}

  async whatzapp() {
    return await client.messages
        .create({
          from: "whatsapp:"+appMobileNumber,
          body: this.notificationData.message,
          to: "whatsapp:"+this.notificationData.telephone,
        });
  }
}

export default WhatzappService;
