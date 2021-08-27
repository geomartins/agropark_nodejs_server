import FirestoreService from "../../services/firestore_service";
import * as admin from "firebase-admin";
import WhoisService from "../../services/whois_service";
import * as pick from "../../repositories/pick";
import NotificationInterface from "../../interfaces/notification";


/**
 * @description Class for runing cronjobs
 * @class
 * @extends NotificationInterface
 */

/**
 * The purpose of this class is to run a cron job on domain
 * inorder to notify the user of almost - expired domain
 * @class
 * @extends NotificationInterface
 * @property { object } snapshot - firestore snapshot object
 * @property { any } expiryDate - domain expiry date
  *
  *
  *
  * @see {@link FirestoreService}
  * @see {@link WhoisService}

 */

class DomainsScheduleChain extends NotificationInterface {
  private expiryDate: any;
  private snapshot: any;

  /**
   * @constructor
   */
  constructor() {
    super("domains", "/topics/domains");
    const date = new Date();
    this.expiryDate = new Date(date.setMonth(date.getMonth() + 2));
  }


  /**
   * Fetch Expiring domain snapshot from domain collections in firestore
   * based on the timestamp
   * @return {Promise<DomainsScheduleChain>}
   * @public
   * @async
   */
  async fetchExpiringDomainSnapshot() {
    this.snapshot = await new FirestoreService().
        fetchExpiringDomainSnapshot(
            admin.firestore.Timestamp.fromDate(this.expiryDate)
        );
    return this;
  }


  /**
   * This keeps expired domain in sync with database
   * by updating already expired domain
   * @async
   * @public
   * @return {Promise<DomainsScheduleChain>}
   */
  async updateAlreadyExpiredDomain() {
    if (this.snapshot.empty) {
      return this;
    }
    this.snapshot.forEach(async (doc: any) => {
      const whoisExpiryDate =
        (await new WhoisService().fetchRecord(doc.data().name)).expiry_date;

      /** Comparing [whoisExpiryDate] and [expiryDate] */
      if (whoisExpiryDate >
        admin.firestore.Timestamp.fromDate(this.expiryDate)) {
        await doc.ref.update({expiry_date: whoisExpiryDate});
      }
    });
    await this.fetchExpiringDomainSnapshot();
    return this;
  }


  // async sendSlackNotification() {
  //   if (this.snapshot.empty) {
  //     return this;
  //   }
  //   this.snapshot.forEach( async (doc: any) => {
  //     const data = {
  //       "provider": doc.data().provider,
  //       "nameserver": doc.data().nameserver,
  //       "name": pick.capitalize(doc.data().name.split(".")[0]),
  //       "expiry_date": pick.humanReadable(doc.data().expiry_date.toDate()),
  //     };
  //     await new SlackService("#it-dept", "Dhreminder")
  //         .push("Expiring Domain Notification", data);
  //   });

  //   return this;
  // }

  /**
   * @description Sends notification to the app of already expired domain
   * or about soon to be expired domain
   * @async
   * @public
   * @return {Promise<DomainsScheduleChain>}
   */
  async notify() {
    if (this.snapshot.empty) {
      return this;
    }
    this.snapshot.forEach(async (doc: any) => {
      const domainName = pick.capitalize(doc.data().name.split(".")[0]);
      const expiry_date = pick.humanReadable(doc.data().expiry_date.toDate());

      const genericTitle = "Expiring Domain Notification";
      const genericMessage = `${domainName} expires on ${expiry_date}`;

      const permissions =
        await new FirestoreService().getModuleNotificationChannel("domains");

      super.prepareNotification(genericTitle, genericMessage, permissions)
          .sendNotification();
    });

    return this;
  }
}

export default DomainsScheduleChain;
