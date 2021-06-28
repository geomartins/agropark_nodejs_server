const accountSid = "AC0ff37d5fbf8f420923d4eb93f60b6e01";
const authToken = "876f275661263b3a43922340824d8a0d";
const appMobileNumber = "+14155238886";
const client = require("twilio")(accountSid, authToken);

type NotificationData = {
    telephone: string | "",
    message: string | "";
}

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
