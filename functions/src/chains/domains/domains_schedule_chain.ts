import FirestoreService from "../../services/firestore_service";
import * as admin from "firebase-admin";
import WhoisService from "../../services/whois_service";
import SlackService from "../../services/slack_service";
import * as pick from "../../repositories/pick";


class DomainsScheduleChain {
    private expiryDate: any;
    private snapshot: any;

    constructor() {
      const date = new Date();
      this.expiryDate = new Date(date.setMonth(date.getMonth()+2));
    }


    async fetchExpiringDomainSnapshot() {
      this.snapshot = await new FirestoreService().
          fetchExpiringDomainSnapshot(
              admin.firestore.Timestamp.fromDate(this.expiryDate)
          );
      return this;
    }


    async updateAlreadyExpiredDomain() {
      if (this.snapshot.empty) {
        return this;
      }
      this.snapshot.forEach( async (doc: any) => {
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


    async sendSlackNotification() {
      if (this.snapshot.empty) {
        return this;
      }
      this.snapshot.forEach( async (doc: any) => {
        const data = {
          "provider": doc.data().provider,
          "nameserver": doc.data().nameserver,
          "name": pick.capitalize(doc.data().name.split(".")[0]),
          "expiry_date": pick.humanReadable(doc.data().expiry_date.toDate()),
        };
        await new SlackService("#it-dept", "Dhreminder")
            .push("Expiring Domain Notification", data);
      });

      return this;
    }
}

export default DomainsScheduleChain;
