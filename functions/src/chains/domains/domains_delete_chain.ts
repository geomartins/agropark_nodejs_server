
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * The purpose of this class is to facilitate easy deletion of domain,
 * updating firestore and angolia of the deleted domain,
 * and notifying the app of the deleted domain
 * @class
 * @extends NotificationInterface
 * @property { object } snapshot - firestore snapshot object
  * @property { object } docRef - snapshot document reference
  * @property { object } deleterRef - person deleting the domain reference
  * @property { string } deleter - person deleting the domain
  *
  *
  *
  * @see {@link FirestoreService}
  * @see {@link AlgoliaService}
  * @see {@link WhoisService}
  * @see {@link NotificationInterface}

 */
class DomainsDeleteChain extends NotificationInterface {
  private docRef: any;
  deleterRef: any;
  deleter: any;

  /**
   *
   * @param {object} snapshot firestore snapshot object
   */
  constructor(protected snapshot: any) {
    super("domains", "/topics/domains");
    this.docRef = this.snapshot.data();
    this.deleter = snapshot.data().deleter;
  }


  /**
   * helps to update class dependencies
   * for the domain module
   *
   * @async
   * @public
   * @return {Promise<DomainsDeleteChain>}
   */
  async updateDependency() {
    await new FirestoreService()
        .updateDependency(this.moduleName, "delete", this.snapshot.id);
    return this;
  }


  /**
   * Helps sends notification to the app
   * informing them of the domain delete action
   * @async
   * @public
   * @return {Promise<DomainsDeleteChain>}
   * @see {@link NotificationInterface}
   */
  async notify() {
    const fullname = this.deleter;
    const item = this.docRef.name;


    const genericTitle = "Domain Delete Action!!";
    const genericMessage =
    `${fullname} deleted ${item} from domain`;

    const permissions =
    await new FirestoreService().getModuleNotificationChannel("domains");

    super.prepareNotification(genericTitle, genericMessage, permissions)
        .sendNotification();

    return this;
  }

  /**
   * Help update domain document in algolia so that
   *  firestore and angolia would be have the same document information
   * @async
   * @public
   * @return {Promise<DomainsDeleteChain>}
   * @see {@link AlgoliaService}
   */
  async updateAngolia() : Promise<this> {
    /** Updating Algolia */
    (await new AlgoliaService("domains", this.snapshot)).delete();
    return this;
  }
}

export default DomainsDeleteChain;
