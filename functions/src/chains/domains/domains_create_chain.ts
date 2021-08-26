import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import WhoisService from "../../services/whois_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * The purpose of this class is to facilate creating of domain
 * updating dependencies, updating snapshot, send notification
 * to the app once it done and updating angolia
 * @class
 * @extends NotificationInterface
 * @property { object } snapshot - firestore snapshot object
  * @property { object } docRef - snapshot document reference
  * @property { object } creatorRef - creator object
  * @property { string } creator - creator of domain
 */
class DomainsCreateChain extends NotificationInterface {
  snapshot: any;
  docRef: any;
  creatorRef: any;
  creator: any;
  record: any;

  /**
   * This constructor accepts firestore snapshot as the only parameter
   * @param {object} snapshot - firestore snapshot object
   */
  constructor(snapshot: any) {
    super("domains", "/topics/domains");
    this.snapshot = snapshot;
    this.docRef = snapshot.data();
    this.creatorRef = snapshot.data().creator;
    this.creator = "";
  }

  /**
   * This helps fetch the full information of the
   * person who created the domain
   * @return {Promise<DomainsCreateChain>}
   * @async
   *
   */
  private async fetchCreatorDetails() {
    this.creator = await new FirestoreService()
        .getUserByUid(this.creatorRef);
    return this;
  }


  /**
   * This function helps get additional information
   * for the newly created domain from whoisservice
   * Information such as expiry_date, providers etc
   * @return {Promise<DomainsCreateChain>}
   */
  async fetchRecord() {
    const record = await new WhoisService().fetchRecord(this.docRef.name);
    if (record) {
      this.record = record;
    }
    return this;
  }


  /**
   * This function helps update the snapshot ref
   * with the updated records and updated creator details
   * @async
   * @return {Promise<DomainsCreateChain>}
   */
  async updateSnapshot() {
    await this.fetchCreatorDetails();
    await this.fetchRecord();
    await this.snapshot.ref.update({
      creator: this.creator,
      ...this.record,
    });
    return this;
  }

  /**
   * This function helps update any dependency attached to this class
   * @async
   * @return {Promise<DomainsCreateChain>}
   */
  async updateDependency() {
    await new FirestoreService()
        .updateDependency(this.moduleName, "create", this.snapshot.id);
    return this;
  }

  /**
   * Helps sends notification to the app using the notification interface
   * Send Whatzapp Notification, Slack Notification, SMS Notification,
   *  Push Notification, Email Notification etc
   * @async
   * @return {Promise<DomainsCreateChain>}
   */
  async notify() {
    const fullname = this.creator.firstname + " " + this.creator.lastname;
    const item = this.docRef.name;

    const genericTitle = "Domain Create Action!!";
    const genericMessage = `${fullname} added ${item} to domain`;

    const permissions =
      await new FirestoreService().getModuleNotificationChannel("domains");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }

  /**
   * This function helps update algolia... Hence newly created domain
   * is added to angolia.... This will be useful when searching for
   * data in angolia
   * @async
   * @return  {Promise<DomainsCreateChain>}
   */
  async updateAngolia() {
    /** Updating Algolia */
    (await new AlgoliaService("domains", this.snapshot)).create();
    return this;
  }
}

export default DomainsCreateChain;
