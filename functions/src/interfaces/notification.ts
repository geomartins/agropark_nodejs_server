
import SmsService from "../services/sms_service";
import WhatzappService from "../services/whatzapp_service";
import SlackService from "../services/slack_service";
import PushyService from "../services/pushy_service";
import MailService from "../services/mail_service";
import FirestoreService from "../services/firestore_service";

/**
 * @interface
 */
interface Notification{
    moduleName: string;
    topicName: string;
    notificationPermission: {
      inApp: boolean;
      pushy: boolean;
      mail: string | "";
      sms: string | "";
      slack: string | "";
      whatzapp: string | "";
    };
     inAppData: {
        title: string | "";
        message: string | "";
      },
    pushyData: {
      topic: string | "";
      title: string | "";
      message: string | "";
    },
    whatzappData: {
      telephone: string | "",
      message: string | "",
    },
    smsData: {
      telephone: string | "" | string[],
      message: string | "",
    }
    mailData: {
      replacements: {
        [key: string]: string
      },
      mailOption: {
        from?: string | "",
        to: string | "",
        subject: string | "",
      }
    }

  }

/**
 * @class
 * @abstract
 * @extends Notification
 */
abstract class NotificationInterface implements Notification {
    moduleName: string;
    topicName: string;
    notificationPermission: {
        inApp: true, pushy: boolean; mail: string | "";
        sms: string | ""; slack: string | ""; whatzapp:string | ""; }
       = {
         inApp: true,
         pushy: true,
         mail: "",
         sms: "",
         slack: "",
         whatzapp: "",
       }

      inAppData : { title: string; message: string; } = {
        title: "", message: "",
      };

      pushyData: { topic: string; title: string; message: string; } = {
        title: "", topic: "", message: "",
      };
      whatzappData: { telephone: string; message: string; } = {
        telephone: "", message: "",
      };
      smsData: { telephone: string | string[]; message: string; } = {
        telephone: "", message: "",
      };

      mailData: {
            replacements: { [key: string]: string; };
            mailOption: { from?: string; to: string; subject: string;
      }; } = {
        replacements: {},
        mailOption: {
          from: "", to: "", subject: "",
        },
      }

      constructor(moduleName: string, topicName: string) {
        this.moduleName = moduleName;
        this.topicName = topicName;
      }


      prepareNotification(genericTitle: string,
          genericMessage: string, notificationData: any) {
        this.notificationPermission = notificationData;
        // [INAPP]
        this.inAppData.title = genericTitle;
        this.inAppData.message = genericMessage;

        // [PUSHY]
        this.pushyData.title = genericTitle;
        this.pushyData.message = genericMessage;

        // [WHATZAPP]
        this.whatzappData.message = genericTitle+" "+genericMessage;
        this.whatzappData.telephone = this.notificationPermission.whatzapp;

        // [SMS]
        this.smsData.message = genericTitle+" "+genericMessage;
        this.smsData.telephone= this.notificationPermission.sms;

        // [MAIL]
        this.mailData.mailOption = {
          to: this.notificationPermission.mail,
          subject: genericTitle,
        };
        this.mailData.replacements = {
          title: genericTitle,
          message: genericMessage,
        };

        return this;
      }

      async sendNotification() {
        if (this.notificationPermission.inApp == true) {
          new FirestoreService().updateModuleNotifier(this.moduleName,
              this.inAppData ).catch((err) => {});
        }
        if (this.notificationPermission.pushy == true) {
          new PushyService().pushToTopics(this.topicName, this.pushyData, {})
              .catch((err) => {});
        }
        if (this.notificationPermission.sms) {
          new SmsService(this.smsData).smsNigeria().catch((err) => {});
        }
        if (this.notificationPermission.whatzapp) {
          new WhatzappService(this.whatzappData).whatzapp().catch((err) => {});
        }

        if (this.notificationPermission.mail) {
          new MailService("notification")
              .send(this.mailData.replacements, this.mailData.mailOption)
              .catch((err) => {});
        }

        if (this.notificationPermission.slack) {
          new SlackService(this.notificationPermission.slack, "AgroPark")
              .push(this.pushyData.message, this.pushyData).catch((err) => {});
        }
      }
}

export default NotificationInterface;
