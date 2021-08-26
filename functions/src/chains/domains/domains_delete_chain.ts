
import FirestoreService from "../../services/firestore_service";
import AlgoliaService from "../../services/algolia_service";
import NotificationInterface from "../../interfaces/notification";

/**
 * @class
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
   * @description helps to update class dependencies
   * @return {Promise<DomainsDeleteChain>}
   */
  async updateDependency() {
    await new FirestoreService()
        .updateDependency(this.moduleName, "delete", this.snapshot.id);
    return this;
  }

  /**
   * Helps sends notification to the app
   * @return {Promise<DomainsDeleteChain>}
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
   * @description Help update domain document in algolia
   * @return {Promise<DomainsDeleteChain>}
   */
  async updateAngolia() : Promise<this> {
    /** Updating Algolia */
    (await new AlgoliaService("domains", this.snapshot)).delete();
    return this;
  }
}

export default DomainsDeleteChain;
